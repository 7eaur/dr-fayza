import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = (process.env.CLINIC_PREVIEW_URL || 'https://dr-fayza-git-design-agency-suite-fayza-20261109-wasl15.vercel.app').replace(/\/+$/, '');
const out = path.resolve('visual-audit');
fs.mkdirSync(out, { recursive: true });

const allRoutes = [
  '/', '/about/', '/services/',
  '/services/pregnancy/', '/services/womens-health/', '/services/fertility/',
  '/services/ultrasound/', '/services/maternity/', '/services/cosmetic/',
  '/services/#diagnostics', '/guides/',
  '/guides/pregnancy-care/', '/guides/womens-visit/',
  '/guides/fertility-consultation/', '/guides/ultrasound-guide/',
  '/faq/', '/contact/', '/missing-page-test'
];
const configs = [
  { width: 320, height: 700, routes: ['/', '/about/', '/services/pregnancy/', '/contact/'] },
  { width: 360, height: 800, routes: ['/', '/contact/'] },
  { width: 390, height: 844, routes: allRoutes },
  { width: 768, height: 1024, routes: ['/', '/about/', '/services/', '/guides/', '/contact/'] },
  { width: 1280, height: 800, routes: ['/', '/about/'] },
  { width: 1440, height: 900, routes: allRoutes }
];
const report = {
  url: base,
  created: new Date().toISOString(),
  pages: [],
  errors: [],
  warnings: [],
  note: 'Automated browser checks are not an independent human design judgment. Real device/assistive tech tests are separate.'
};
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const safeName = s => s === '/' ? 'home' : s.replace(/^\/|\/$/g, '').replaceAll('/', '-');
for (const config of configs) {
  const context = await browser.newContext({ viewport: { width: config.width, height: config.height }, deviceScaleFactor: 1, locale: 'ar-YE', colorScheme: 'light' });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(String(e)));
  for (const route of config.routes) {
    const target = base + route;
    const is404 = route === '/missing-page-test';
    try {
      const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(async () => {
        // Full-page capture does not scroll the page; trigger lazy images explicitly.
        const images = [...document.images];
        for (const image of images) image.loading = 'eager';
        await Promise.race([
          Promise.all(images.map(image => image.decode().catch(() => null))),
          new Promise(resolve => setTimeout(resolve, 15000))
        ]);
      });
      await page.waitForTimeout(250);
      const d = await page.evaluate(() => ({
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        width: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        main: !!document.querySelector('main'),
        body: document.body.innerText.slice(0, 180),
        brokenImages: [...document.images].filter(x => x.complete && x.naturalWidth === 0).map(x => x.getAttribute('src')),
        viewportMeta: document.querySelector('meta[name="viewport"]')?.content,
        missingAlt: [...document.images].filter(x => !x.hasAttribute('alt')).map(x => x.getAttribute('src')),
        includesAgencyCss: [...document.styleSheets].some(x => String(x.href).includes('/styles/agency.css')),
        hasLoader: !!document.querySelector('.clinic-loader'),
        hasSimple404: !!document.querySelector('.clinic-notfound'),
        navTiming: (() => { const n=performance.getEntriesByType('navigation')[0];return n ? { responseEndMs:Math.round(n.responseEnd), domContentLoadedMs:Math.round(n.domContentLoadedEventEnd), loadMs:Math.round(n.loadEventEnd), documentTransferKB:Math.round(n.transferSize/1024) }:null })(),
        firstPartyTransferKB: Math.round(performance.getEntriesByType('resource').filter(x=>x.name.startsWith(location.origin)).reduce((total,x)=>total+x.transferSize,0)/1024)
      }));
      const f = [config.width, safeName(route)].join('__');
      if (!is404) await page.screenshot({ path: path.join(out, f + '.png'), fullPage: true, animations: 'disabled' });
      const entry = { width: config.width, route, status: response?.status() ?? null, ...d };
      report.pages.push(entry);
      if (is404 && (!entry.hasSimple404 || entry.hasLoader)) report.errors.push({ width: config.width, route, issue:'Missing simple 404 or loader incorrectly displayed' });
      if (!is404 && entry.status !== 200) report.errors.push({ width: config.width, route, issue: 'HTTP ' + entry.status });
      if (is404 && entry.status !== 404) report.errors.push({ width: config.width, route, issue: '404 status incorrect: ' + entry.status });
      if (entry.h1Count !== 1 || !entry.main || entry.lang !== 'ar' || entry.dir !== 'rtl') report.errors.push({ width: config.width, route, issue: 'Semantic document structure mismatch', entry });
      if (!entry.includesAgencyCss) report.errors.push({ width: config.width, route, issue: 'Agency stylesheet missing' });
      if (entry.width > entry.viewport + 2) report.errors.push({ width: config.width, route, issue: 'Horizontal scroll overflow: ' + entry.width + ' > ' + entry.viewport });
      if (entry.brokenImages.length) report.errors.push({ width: config.width, route, issue: 'Broken images', images: entry.brokenImages });
      if (entry.missingAlt.length) report.errors.push({ width: config.width, route, issue: 'Image missing alt', images: entry.missingAlt });
      if (config.width <= 600 && ['/about/', '/services/pregnancy/', '/services/maternity/'].includes(route)) {
        const relatedCardWidths = await page.locator('.section .cards:not(.agency-services__cards) > .card')
          .evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().width)));
        if (relatedCardWidths.some(width => width < 270)) {
          report.errors.push({ width: config.width, route, issue: 'Unusable narrow related service cards', relatedCardWidths });
        }
      }
      if ([390, 1440].includes(config.width) && ['/', '/about/', '/services/', '/contact/', '/guides/pregnancy-care/'].includes(route)) {
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const violationRows = axe.violations.map(v => ({
          id: v.id, impact: v.impact, description: v.help,
          selectors: v.nodes.map(n => n.target.join(' ')).slice(0, 8)
        }));
        const severity = violationRows.filter(x => ['serious', 'critical'].includes(x.impact));
        const lesser = violationRows.filter(x => !['serious', 'critical'].includes(x.impact));
        if (severity.length) report.errors.push({ width: config.width, route, issue: 'Axe WCAG severe violations', findings: severity });
        if (lesser.length) report.warnings.push({ width: config.width, route, issue: 'Axe WCAG lower-severity violations', findings: lesser });
      }
    } catch (err) {
      report.errors.push({ width: config.width, route, issue: String(err) });
    }
  }
  if (config.width === 390) {
    try {
      await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
      const toggle = page.locator('#menu-button');
      await toggle.click();
      const expanded = await toggle.getAttribute('aria-expanded');
      const visible = await page.locator('#primary-nav').isVisible();
      if (expanded !== 'true' || !visible) report.errors.push({ width: 390, route: '/', issue: 'Mobile menu failed to open' });
      await page.keyboard.press('Escape');
      if (await toggle.getAttribute('aria-expanded') !== 'false') report.errors.push({ width: 390, route: '/', issue: 'Mobile menu failed to close on Escape' });
    } catch (err) { report.errors.push({ width: 390, issue: 'Mobile menu test failed: ' + String(err) }); }
  }
  if (consoleErrors.length) report.warnings.push({ width: config.width, errors: consoleErrors });
  await context.close();
}
// Simulated cold 4G samples provide a more useful mobile check than unthrottled CI localhost-style timings.
const throttledSamples=[];
for (const route of ['/', '/contact/']) {
 const mobileContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,locale:'ar-YE'});
 const mobile=await mobileContext.newPage();
 try {
  await mobile.addInitScript(()=>{
   window.__lastLCP=0;
   try{new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__lastLCP=entry.startTime}).observe({type:'largest-contentful-paint',buffered:true})}catch{}
  });
  const cdp=await mobileContext.newCDPSession(mobile);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:75000});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  const response=await mobile.goto(base+route,{waitUntil:'load',timeout:60000});
  await mobile.waitForTimeout(1000);
  const sample=await mobile.evaluate(()=>{
   const nav=performance.getEntriesByType('navigation')[0];
   const paint=performance.getEntriesByType('paint').find(x=>x.name==='first-contentful-paint');
   return {responseEndMs:Math.round(nav?.responseEnd||0),domContentLoadedMs:Math.round(nav?.domContentLoadedEventEnd||0),
    loadMs:Math.round(nav?.loadEventEnd||0),fcpMs:Math.round(paint?.startTime||0),lcpMs:Math.round(window.__lastLCP||0),
    firstPartyTransferKB:Math.round(performance.getEntriesByType('resource').filter(x=>x.name.startsWith(location.origin)).reduce((a,x)=>a+x.transferSize,0)/1024)};
  });
  throttledSamples.push({route,width:390,network:'simulated 1.6 Mbps, 150ms latency, 4x CPU slowdown',status:response?.status(),...sample});
 }catch(err){report.warnings.push({route,issue:'Mobile throttled sample unavailable: '+String(err)})}
 finally{await mobileContext.close()}
}
await browser.close();
const performanceSamples=report.pages.filter(p=>['/','/contact/','/services/'].includes(p.route)&&[390,1440].includes(p.width)).map(p=>({width:p.width,route:p.route,...p.navTiming,firstPartyTransferKB:p.firstPartyTransferKB}));
fs.writeFileSync(path.join(out,'performance-samples.json'),JSON.stringify({note:'Automated Chrome lab timings, not Lighthouse scores or real-user field Core Web Vitals. Throttled samples emulate 1.6 Mbps/150ms/4x CPU slowdown.',samples:performanceSamples,throttledSamples},null,2));
console.log('Navigation samples (ms/KB): '+JSON.stringify(performanceSamples));
console.log('Throttled mobile (ms/KB): '+JSON.stringify(throttledSamples));
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
const summary = {
  pages: report.pages.length, screenshots: report.pages.filter(p => p.route !== '/missing-page-test').length, errors: report.errors.length, warnings: report.warnings.length
};
fs.writeFileSync(path.join(out, 'SUMMARY.md'), '# Clinic automated visual QA\n\n' + JSON.stringify(summary, null, 2) + '\n\n## Errors\n' + (report.errors.length ? report.errors.map(x => '- ' + JSON.stringify(x)).join('\n') : 'None') + '\n');
console.log(JSON.stringify(summary));
if (report.errors.length) {
  console.error(JSON.stringify(report.errors.slice(0, 15), null, 2));
  process.exitCode = 1;
}