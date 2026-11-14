import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { chromium } from 'playwright';

const root=path.resolve('dist');
const out=path.resolve('visual-audit');
const base=(process.env.CLINIC_PREVIEW_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
fs.mkdirSync(out,{recursive:true});
const report={pages:[],failures:[],warnings:[],checks:[]};
const files=fs.readdirSync(root,{recursive:true}).filter(p=>String(p).endsWith('.html')).map(p=>path.join(root,String(p)));
// Check the actual shipped URL, content fingerprint, preload reuse and image dimensions.
const checked=new Set();
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:src|href)="(\/static\/([a-f0-9]{12})\/[^"?#]+)"/g)){
  if(checked.has(match[1]))continue;
  checked.add(match[1]);
  const bytes=fs.readFileSync(path.join(root,match[1].slice(1)));
  assert.equal(createHash('sha256').update(bytes).digest('hex').slice(0,12),match[2],`Wrong fingerprint: ${match[1]}`);
 }
 for(const tag of html.matchAll(/<img\b[^>]*srcset="([^"]+)"[^>]*>/g)){
  for(const candidate of tag[1].split(', ')){
   const [url,descriptor]=candidate.split(' ');
   const metadata=await sharp(path.join(root,url.slice(1))).metadata();
   assert.equal(metadata.width,Number.parseInt(descriptor),`Wrong image descriptor: ${url}`);
  }
 }
 const hero=html.match(/<img\b[^>]*data-image-slot="[^"]+"[^>]*>/)?.[0];
 if(hero){
  const preload=[...html.matchAll(/<link\b[^>]*rel="preload"[^>]*>/g)].map(x=>x[0]).find(x=>x.includes('imagesrcset'));
  if(hero.includes('srcset=')){
   assert(preload,`Missing hero preload: ${file}`);
   for(const [imageAttr,preloadAttr] of [['src','href'],['srcset','imagesrcset'],['sizes','imagesizes']]){
    const value=(tag,name)=>tag.match(new RegExp('\\b'+name+'="([^"]+)"'))?.[1];
    assert.equal(value(hero,imageAttr),value(preload,preloadAttr),`Preload mismatch: ${file}`);
   }
  }
 }
}
report.checks.push(`Validated ${checked.size} fingerprinted resources and responsive descriptors across ${files.length} HTML documents`);
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:2,locale:'ar-YE'});
 const page=await context.newPage();
 const external=[];const broken=[];
 page.on('request',r=>{if(!r.url().startsWith(base+'/'))external.push(r.url())});
 page.on('response',r=>{if(r.status()>=400)broken.push({url:r.url(),status:r.status()})});
 page.on('pageerror',e=>report.failures.push({width,error:String(e)}));
 for(const route of ['/','/contact/','/about/','/services/','/services/pregnancy/','/guides/','/faq/']){
  await page.goto(base+route,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(300);
  const data=await page.evaluate(()=>{
   const lastLine=[];
   for(const element of document.querySelectorAll('h1,.agency-contact h2,.agency-doctor__content h2')){
    const lines=new Map();const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    let node;while((node=walker.nextNode()))for(const match of node.textContent.matchAll(/\S+/g)){
     const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
     const y=Math.round(range.getBoundingClientRect().top);lines.set(y,[...(lines.get(y)||[]),match[0]]);
    }
    const rows=[...lines.values()];if(rows.length>1&&rows.at(-1).length===1)lastLine.push({text:element.textContent,last:rows.at(-1)[0]});
   }
   return {overflow:document.documentElement.scrollWidth>innerWidth,orphans:lastLine,
    deferredImages:[...document.images].filter(x=>x.loading==='lazy'&&!x.complete).length,
    failedImages:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src),
    hero:[...document.querySelectorAll('[data-image-slot]')].map(x=>({src:x.currentSrc,rendered:x.width,intrinsic:x.naturalWidth})),
    transfer:performance.getEntriesByType('resource').reduce((sum,x)=>sum+x.transferSize,0)};
  });
  if(data.overflow||data.failedImages.length)report.failures.push({width,route,...data});
  if(data.orphans.length)report.warnings.push({width,route,orphans:data.orphans});
  report.pages.push({width,route,...data});
  await page.screenshot({path:path.join(out,`fixed-${width}-${route.replaceAll('/','-')||'home'}.png`),animations:'disabled'});
 }
 if(external.length||broken.length)report.failures.push({width,external,broken});
 await context.close();
}
// The signature cannot intercept a tap, even on the first visit.
const fresh=await browser.newContext({viewport:{width:390,height:844}});
const first=await fresh.newPage();await first.goto(base+'/',{waitUntil:'load'});
const intro=first.locator('[data-clinic-brand-intro]');
if(await intro.count())assert.equal(await intro.evaluate(x=>getComputedStyle(x).pointerEvents),'none');
await first.locator('#menu-button').click();assert.equal(await first.locator('#menu-button').getAttribute('aria-expanded'),'true');
await fresh.close();report.checks.push('First-visit signature does not intercept mobile menu taps');
// A missing photo offers a retry and recovers without reloading the page.
const failureContext=await browser.newContext();const failurePage=await failureContext.newPage();
const imagePattern='**/assets/clinic-contact-hero*.webp';
await failurePage.route(imagePattern,r=>r.abort());
await failurePage.goto(base+'/contact/',{waitUntil:'load'});
await failurePage.locator('[data-image-retry]').waitFor();
await failurePage.unroute(imagePattern);
await failurePage.locator('[data-image-retry]').click();
await failurePage.waitForFunction(()=>document.querySelector('.clinic-contact-hero__image')?.naturalWidth>0);
await failureContext.close();report.checks.push('Failed image retries successfully without a full page reload');
for(const options of [{javaScriptEnabled:false},{reducedMotion:'reduce'}]){
 const context=await browser.newContext({viewport:{width:390,height:844},...options});const page=await context.newPage();
 await page.goto(base+'/',{waitUntil:'load'});assert(await page.locator('main h1').isVisible());
 if(options.reducedMotion){assert.equal(await page.locator('.clinic-brand-intro').count(),0);assert.equal(await page.evaluate(()=>document.getAnimations().length),0)}
 else assert.equal(await page.locator('.clinic-brand-intro').isVisible(),false);
 await context.close();
}
report.checks.push('Page remains readable without JS; reduced-motion disables optional animations');
await browser.close();
fs.writeFileSync(path.join(out,'layout-performance-regressions.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:report.checks,pages:report.pages.length,failures:report.failures,warnings:report.warnings},null,2));
assert.equal(report.failures.length,0,'Layout/performance regressions detected');
