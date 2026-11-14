import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('dist');
const origin='https://dr-fayza.vercel.app';
const card=fs.readFileSync(path.join(root,'assets/clinic-social-card.png'));
assert.equal(card.subarray(1,4).toString(),'PNG');
assert.equal(card.readUInt32BE(16),1200);
assert.equal(card.readUInt32BE(20),630);
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
assert.equal(urls.length,19);
assert.equal(new Set(urls).size,19);
assert(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: '+origin+'/sitemap.xml'));
const titles=new Set(),descriptions=new Set();
for(const url of urls){
  assert(url.startsWith(origin+'/'));
  const route=new URL(url).pathname;
  const html=fs.readFileSync(path.join(root,route.slice(1),'index.html'),'utf8');
  assert(html.includes('<link rel="canonical" href="'+url+'">'),route+' canonical differs from sitemap');
  assert(html.includes('content="index,follow,max-image-preview:large"'),route+' indexing policy');
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];
  const desc=html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(title&&!titles.has(title),route+' duplicate/missing title');titles.add(title);
  assert(desc&&!descriptions.has(desc),route+' duplicate/missing description');descriptions.add(desc);
  assert(!/صورة توضيحية|توجه تحريري|مذكور في (?:مواد|المواد)|واردة في المواد|ليس موقعًا مثبتًا/.test(html),route+' internal copy leaked');
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const page=graph.find(x=>x['@id']===url+'#webpage');
  assert.equal(page.name,title);assert.equal(page.description,desc);
  if(route!=='/'){
    const crumbs=graph.find(x=>x['@type']==='BreadcrumbList').itemListElement;
    assert.equal(crumbs.at(-1).item,url);
    if(/^\/(services|guides)\/[^/]+\/$/.test(route)){
      assert.equal(crumbs.length,3,route+' missing parent breadcrumb');
      assert(urls.includes(crumbs[1].item));
    }
  }
  const image=html.match(/property="og:image" content="([^"]+)"/)[1];
  assert(fs.existsSync(path.join(root,new URL(image).pathname)),route+' missing social image');
  assert(html.includes('name="twitter:image" content="'+image+'"'));
  if(route==='/about/'){
    assert(image.endsWith('/clinic-about-hero.webp'));
    assert(html.match(/<img[^>]*data-image-slot="inner"[^>]*>/)?.[0].includes('clinic-about-hero'));
    assert(!/<img[^>]*womens-consultation/.test(html));
  }
  if(route==='/'){
    assert(image.endsWith('/clinic-social-card.png'));
    assert(html.includes('property="og:image:width" content="1200"'));
    assert(html.includes('property="og:image:height" content="630"'));
  }
}
const notFound=fs.readFileSync(path.join(root,'404.html'),'utf8');
assert(notFound.includes('content="noindex,follow"'));
assert(!notFound.includes('rel="canonical"'));
assert(!urls.some(x=>x.includes('/404/')));
console.log('SEO audit passed: 19 unique canonical pages, indexing, nested breadcrumbs, structured data, social images and client copy.');
