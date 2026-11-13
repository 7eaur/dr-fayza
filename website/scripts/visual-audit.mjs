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
  '/faq/', '/contact/', '/privacy/', '/missing-page-test'
];
const configs = [
  { width: 320, height: 700, routes: ['/', '/about/', '/services/pregnancy/', '/contact/'] },
  { width: 360, height: 800, routes: ['/', '/contact/', '/privacy/'] },
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
        includesAgencyCss: [...document.styleSheets].some(x => String(x.href).includes('/styles/agency.css'))
      }));
      const f = [config.width, safeName(route)].join('__');
      if (!is404) await page.screenshot({ path: path.join(out, f + '.png'), fullPage: true, animations: 'disabled' });
      const entry = { width: config.width, route, status: response?.status() ?? null, ...d };
      report.pages.push(entry);
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
      if ([390, 1440].includes(config.width) && ['/', '/about/', '/services/', '/contact/', '/guides/pregnancy-care/', '/privacy/'].includes(route)) {
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
await browser.close();
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