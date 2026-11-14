import { webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base=(process.env.CLINIC_PREVIEW_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const browser=await webkit.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,locale:'ar-YE'});
const page=await context.newPage();const errors=[];
page.on('pageerror',error=>errors.push(String(error)));
for(const route of ['/','/about/','/contact/','/services/']){
 const response=await page.goto(base+route,{waitUntil:'load'});
 assert.equal(response.status(),200);
 assert.equal(await page.locator('.header .logo img').count(),1);
 assert.equal(await page.locator('.clinic-logo-reveal,[data-clinic-brand-intro],body>img').count(),0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'visual-audit/webkit-'+(route.replaceAll('/','-')||'home')+'.png',animations:'disabled'});
}
await page.goto(base+'/',{waitUntil:'load'});
await page.locator('#menu-button').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
await page.keyboard.press('Escape');assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
await page.locator('footer').scrollIntoViewIfNeeded();
const top=page.locator('[data-back-to-top]');await top.waitFor({state:'visible'});await top.click();
await page.waitForFunction(()=>scrollY<5);await top.waitFor({state:'hidden'});
assert.equal(await page.locator('body').getAttribute('id'),'page-top');
await context.close();
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const reducedPage=await reduced.newPage();await reducedPage.goto(base+'/',{waitUntil:'load'});
assert.equal(await reducedPage.locator('[data-logo-motion]').count(),0);
assert.equal(await reducedPage.evaluate(()=>document.getAnimations().length),0);
await reduced.close();await browser.close();assert.deepEqual(errors,[]);
fs.writeFileSync('visual-audit/webkit-smoke.json',JSON.stringify({engine:'WebKit',width:390,routes:4,checks:['one original logo','no overlay','no horizontal overflow','mobile menu','back-to-top','reduced-motion'],errors},null,2));
console.log('WebKit mobile: 4 routes, navigation/back-to-top/reduced-motion passed; no page errors.');
