import fs from 'node:fs';import path from 'node:path';const root=path.join(process.cwd(),'dist');const files=[];function scan(dir){for(const x of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,x.name);if(x.isDirectory())scan(p);else files.push(path.relative(root,p).replaceAll('\\','/'));}}scan(root);const pages=files.filter(p=>p.endsWith('index.html'));const issues=[];if(pages.length!==19)issues.push('Expected 19 HTML pages; got '+pages.length);for(const p of pages){const html=fs.readFileSync(path.join(root,p),'utf8');const title=html.match(/<title>(.*?)<\/title>/)?.[1];if(!title)issues.push('Missing title: '+p);if(!html.includes('name="description"'))issues.push('Missing description: '+p);if(!html.includes('<main id="main">'))issues.push('Missing main: '+p);for(const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){let u=m[1];if(u==='/')u='index.html';else if(u.endsWith('/'))u+='index.html';else u=u.slice(1);if(u.startsWith('/'))u=u.slice(1);if(!files.includes(u))issues.push(p+' => missing '+m[1]);}if((html.match(/<h1\b/g)||[]).length!==1)issues.push('Expected one h1: '+p);}if(issues.length){console.error(issues.join('\n'));process.exit(1);}console.log('Verified '+pages.length+' static pages and '+files.length+' total output files.');


// Agency redesign acceptance gates. These are static checks, not a visual-browser audit.
for(const p of pages){
 const html=fs.readFileSync(path.join(root,p),'utf8');
 if(!html.includes('<html lang="ar" dir="rtl">'))issues.push('Arabic RTL missing: '+p);
 if(!html.includes('href="/styles/agency.css"'))issues.push('Agency styles missing: '+p);
 if(!html.includes('<meta property="og:image"'))issues.push('OG image missing: '+p);
 if(html.includes('774694946'))issues.push('Retired phone number: '+p);
 if(html.includes('لم نستلم رابط خرائط'))issues.push('Internal editorial text leaked: '+p);
 for(const match of html.matchAll(/<img\b[^>]*>/g)){
   if(!/\balt="/.test(match[0]))issues.push('Image alt missing: '+p);
 }
}
const agencyCss=fs.readFileSync(path.join(root,'styles/agency.css'),'utf8');
for(const token of ['--ink: #0c495c','@media (max-width: 600px)','prefers-reduced-motion']){
 if(!agencyCss.includes(token))issues.push('Design token or responsive gate missing: '+token);
}
if(issues.length){console.error(issues.join('\n'));process.exit(1);}
console.log('Agency design checks passed: Arabic RTL, imagery, SEO, tokens and CSS.');


for(const p of pages) {
 const html=fs.readFileSync(path.join(root,p),'utf8');
 const isArticle=p.startsWith('guides/') && p!=='guides/index.html';
 if(isArticle && !html.includes('<meta property="og:type" content="article">')) issues.push('Missing article OG type: '+p);
 if(!isArticle && html.includes('<meta property="og:type" content="article">')) issues.push('Wrong OG type: '+p);
 if(html.includes('author":{"@id":"https://dr-fayza.vercel.app/#doctor"')) issues.push('Unverified medical content authorship: '+p);
 if(!html.includes('<meta property="og:image:alt"')) issues.push('Missing social image description: '+p);
}
const notFound=fs.readFileSync(path.join(root,'404.html'),'utf8');
if(!notFound.includes('name="robots" content="noindex,follow"')) issues.push('404 page must be noindex');
if(notFound.includes('<link rel="canonical"')) issues.push('404 page must not claim canonical');
if(issues.length){console.error(issues.join('\n'));process.exit(1);}
console.log('Agency editorial SEO and medical attribution checks passed.');

// Marketing-and-mobile regression gates.
const homeHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
const aboutHtml=fs.readFileSync(path.join(root,'about/index.html'),'utf8');
const faqHtml=fs.readFileSync(path.join(root,'faq/index.html'),'utf8');
const serviceHtml=fs.readFileSync(path.join(root,'services/index.html'),'utf8');
const medicalSlugs=['pregnancy','womens-health','fertility','ultrasound','maternity','cosmetic'];
for(const slug of medicalSlugs){
 if(!homeHtml.includes('href="/services/'+slug+'/')) issues.push('Medical service absent from home: '+slug);
 if(!serviceHtml.includes('href="/services/'+slug+'/')) issues.push('Medical service absent from services: '+slug);
}
if(!serviceHtml.includes('id="diagnostics"')) issues.push('Diagnostics section not embedded into medical services');
if(!serviceHtml.includes('فحوصات مخبرية تدعم التقييم')) issues.push('Lab information missing from medical services');
if(!serviceHtml.includes('التصوير الطبي عندما يلزم')) issues.push('Sonography information missing from medical services');
if(pages.includes('diagnostics/index.html')) issues.push('Old diagnostics page must not be generated');
if(!homeHtml.includes('clinic-process__timeline')) issues.push('Missing practical first-visit guide');
if(!homeHtml.includes('agency-services__diagnostics')) issues.push('Missing diagnostic service discovery');
if(!aboutHtml.includes('agency-mission__grid')) issues.push('Missing clinic vision and mission');
if(!faqHtml.includes('كيف أستعد لزيارتي الأولى؟')) issues.push('Missing first-visit FAQ');
const agencyCssMobile=fs.readFileSync(path.join(root,'styles/agency.css'),'utf8');
if(!agencyCssMobile.includes('.section .cards:not(.agency-services__cards)')) issues.push('Mobile related service layout regression');
if(issues.length){console.error(issues.join('\n'));process.exit(1);}
console.log('Agency mobile UX and content coverage gates passed.');

if(!homeHtml.includes('https://www.google.com/maps/search/')) issues.push('Map search link missing');
if(!aboutHtml.includes('رؤيتنا ورسالتنا')) issues.push('Clinic story missing');
if(!homeHtml.includes('OpeningHoursSpecification')) issues.push('Opening hours missing from structured data');
if(!fs.readFileSync(path.join(root,'services/pregnancy/index.html'),'utf8').includes('clinic-inner-hero')) { 
  // Page-head compact hides duplicated decorative art above service content.
  const servicePage=fs.readFileSync(path.join(root,'services/pregnancy/index.html'),'utf8');
  if(!servicePage.includes('clinic-inner-hero__grid')) issues.push('Interior service hero missing');
}
if(issues.length){console.error(issues.join('\n'));process.exit(1);}
console.log('Unified clinic release gates passed.');

// The retired standalone diagnostics page and redirect must not return accidentally.
if(files.includes('diagnostics/index.html')) issues.push('Retired diagnostics page still generated');
if(!fs.readFileSync(path.join(root,'services/index.html'),'utf8').includes('id="diagnostics"')) issues.push('Integrated services diagnostics missing');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!index.includes('clinic-hours__sessions') || !index.includes('clinic-visit__layout')) issues.push('Home visit and hours component missing');
if(index.includes('الدوام الاعتيادي')) issues.push('Retired ordinary-hours label on homepage');
if(issues.length){console.error(issues.join('\\n'));process.exit(1);}
console.log('Visit section, schedule and diagnostics cleanup verified.');

// Release gates: remove privacy, simple 404, motion and usable contrast.
if(files.includes('privacy/index.html')) issues.push('Privacy page must not be built');
if(homeHtml.includes('href="/privacy/"')) issues.push('Privacy link still visible');
const errorHtml=fs.readFileSync(path.join(root,'404.html'),'utf8');
if(!errorHtml.includes('clinic-notfound') || !errorHtml.includes('href="/"')) issues.push('Simple 404 missing');
const contactHtml=fs.readFileSync(path.join(root,'contact/index.html'),'utf8');
if(!contactHtml.includes('agency-contact__hours-head')) issues.push('Contact schedule missing');
if(!agencyCss.includes('prefers-reduced-motion')) issues.push('Motion reduced preference missing');
if(issues.length){console.error(issues.join('\\n'));process.exit(1);}
console.log('Privacy removal, error-page and motion checks passed.');
