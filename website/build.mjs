import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { transform } from 'esbuild';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { PurgeCSS } from 'purgecss';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');
import {site,mapsSearch,whatsappFor,services,faqs,articles} from './src/content.mjs';

const icons = { calendar: 'M4 5h16v16H4zM8 2v6m8-6v6M4 10h16', menu: 'M4 6h16M4 12h16M4 18h16', close: 'M5 5l14 14M19 5 5 19', heart: 'M20.8 4.6a5.6 5.6 0 0 0-7.9 0L12 5.5l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.5a5.6 5.6 0 0 0 0-7.9Z', clock: 'M12 7v5l4 2', pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z', phone: 'M21 16v4a2 2 0 0 1-2 2C10 21 3 14 2 5a2 2 0 0 1 2-2h4l2 5-2 2a15 15 0 0 0 6 6l2-2Z', message: 'M21 12a9 9 0 0 1-9 9 9 9 0 0 1-4-.9L3 21l1.5-4.3A9 9 0 1 1 21 12Z', arrow: 'M19 12H5m6-6-6 6 6 6', check: 'm4 12 5 5L20 6', scan: 'M3 4h18v15H3Zm5 12c3-8 7-8 10 0', baby: 'M9 4a3 3 0 0 1 6 0M12 7c-6 0-9 4-9 8s4 7 9 7 9-3 9-7-3-8-9-8Z', flower: 'M12 12C7 11 4 6 6 2c4 0 6 4 6 10Zm0 0c5-1 8-6 6-10-4 0-6 4-6 6 10Zm0 0v10', sparkles: 'm12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z', shield: 'M12 2 21 6v6c0 5-3 8-9 10-6-2-9-5-9-10V6Zm-4 10 3 3 5-6', file: 'M5 2h9l5 5v15H5Z M14 2v6h5 M9 13h6m-6 4h6', info: 'M12 11v6m0-10h.01' };
const ico = (key) => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (icons[key] || icons.heart) + '"/>' + (key === 'clock' ? '<circle cx="12" cy="12" r="9"/>' : '') + (key === 'pin' ? '<circle cx="12" cy="10" r="2.5"/>' : '') + (key === 'info' ? '<circle cx="12" cy="12" r="9"/>' : '') + '</svg>';
const link = (href, label, type = 'solid', icon = 'arrow') => '<a class="button button--' + type + '" href="' + href + '"' + (href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + ico(icon) + '</a>';
const nav = [['/', 'الرئيسية'], ['/about/', 'عن الدكتورة'], ['/services/', 'الخدمات'], ['/guides/', 'التوعية الصحية'], ['/faq/', 'الأسئلة الشائعة'], ['/contact/', 'التواصل']];
const heading = (kicker, title, sub = '') => '<div class="heading"><span class="kicker">' + kicker + '</span><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>';

const serviceCategories = {
  pregnancy: 'الحمل والمتابعة',
  'womens-health': 'النساء والصحة الوقائية',
  fertility: 'الخصوبة والإنجاب',
  ultrasound: 'الفحوصات والتصوير',
  maternity: 'الولادة والاستقبال',
  cosmetic: 'التجميل النسائي'
};
const serviceShowcase = () =>
 '<section class="section clinic-services-directory" id="services-list" aria-labelledby="services-list-title"><div class="container">'+
 '<div class="clinic-services-directory__heading"><div><span class="kicker">دليل الخدمات</span><h2 id="services-list-title">اختاري الخدمة الأقرب إلى استفساركِ</h2></div><p>ستجدين نبذة مختصرة عن كل مجال، وتفاصيل أكثر عند فتح البطاقة.</p></div>'+
 '<div class="clinic-services-directory__grid">'+services.map(s=>
 '<a class="clinic-services-card" href="/services/'+s.id+'/" aria-label="تفاصيل '+s.name+'">'+
 '<span class="clinic-services-card__top"><span class="clinic-services-card__icon">'+ico(s.icon)+'</span><span class="clinic-services-card__category">'+serviceCategories[s.id]+'</span></span>'+
 '<strong>'+s.name+'</strong><p>'+s.desc+'</p><span class="clinic-services-card__more">التفاصيل والاستفسار '+ico('arrow')+'</span></a>').join('')+'</div></div></section>';

function servicesHero(){
 return '<section class="clinic-services-hero" aria-labelledby="clinic-services-hero-title"><div class="container clinic-services-hero__grid">'+
 '<div class="clinic-services-hero__copy"><nav class="breadcrumbs" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>الخدمات الطبية</span></nav>'+
 '<span class="kicker">رعاية طبية متخصصة في ذمار</span><h1 id="clinic-services-hero-title">خدمات واضحة لصحة المرأة والحمل</h1>'+
 '<p>تعرّفي على مجالات الاستشارة والمتابعة والتدخلات النسائية والفحوصات المساندة، واستفسري عن توفر الإجراء المناسب قبل الزيارة.</p>'+
 '<nav class="clinic-services-hero__links" aria-label="الانتقال لأقسام الخدمات"><a href="#services-list">الخدمات الرئيسية</a><a href="#surgical-care">التدخلات النسائية</a><a href="#diagnostics">المختبر والسونار</a></nav></div>'+
 '<div class="clinic-services-hero__image"><img data-image-slot="services" src="/assets/generated/pregnancy-care.webp" width="960" height="720" alt="رعاية صحة المرأة ومتابعة الحمل" decoding="async" fetchpriority="high"></div>'+
 '</div></section>';
}
const surgicalTopics = [
 'العمليات القيصرية والحالات التي تتعلق بالحمل خارج الرحم',
 'جراحات الرحم والأورام الليفية وفق تقييم الحالة',
 'جراحات أكياس المبيض والمبايض حسب الحاجة الطبية',
 'إصلاح الهبوط المهبلي وترميم جدار المهبل وأعضاء الحوض',
 'الإجراءات التشخيصية والجراحية لأمراض النساء',
 'جراحات التجميل النسائي بحسب التقييم الطبي'
];
function surgerySection(){
 return '<section class="section clinic-surgery" id="surgical-care" aria-labelledby="clinic-surgery-title"><div class="container clinic-surgery__layout">'+
 '<div class="clinic-surgery__intro"><span class="kicker">التدخلات النسائية</span><h2 id="clinic-surgery-title">الجراحة النسائية وإجراءاتها</h2>'+
 '<p>استشارة متخصصة لفهم الخيارات الجراحية المناسبة لحالتكِ، ومناقشة خطوات الإجراء والتعافي والمتابعة. استفسري عن توفر الإجراء ومكان تقديمه عند التواصل.</p>'+
 link(whatsappFor('الاستشارات والتدخلات الجراحية النسائية'),'استفسري عن إجراء جراحي','line','message')+'</div>'+
 '<ul class="clinic-surgery__list">'+surgicalTopics.map(x=>'<li>'+ico('check')+'<span>'+x+'</span></li>').join('')+'</ul>'+
 '</div></section>';
}

const card = (s) => '<a class="card" href="/services/' + s.id + '/"><span class="card-ic">' + ico(s.icon) + '</span><h3>' + s.name + '</h3><p>' + s.desc + '</p><span class="more">اعرفي التفاصيل ' + ico('arrow') + '</span></a>';
const faq = (items) => '<div class="faq-list">' + items.map(([q, a], i) => '<details ' + (i === 0 ? 'open' : '') + '><summary>' + q + ico('arrow') + '</summary><p>' + a + '</p></details>').join('') + '</div>';
const articleTile = (a) => {
 const artwork={ 'pregnancy-care':'pregnancy', 'womens-visit':'womens', 'fertility-consultation':'fertility', 'ultrasound-guide':'diagnostics' }[a.id];
 const source=artwork?'/assets/illustrations/'+artwork+'.svg':'/assets/generated/'+a.image;
 return '<article class="tile"><div class="tile-visual"><img src="'+source+'" alt="'+a.category+'" width="960" height="720" loading="lazy" decoding="async"></div><div class="tile-body"><small>'+a.category+'</small><h3>'+a.title+'</h3><p>'+a.desc+'</p><a href="/guides/'+a.id+'/">اقرئي المقال '+ico('arrow')+'</a></div></article>';
};

function header(url) {
 return '<a class="skip" href="#main">تخطي إلى المحتوى</a><header class="header"><div class="container header-inner"><a class="logo" href="/" aria-label="الرئيسية"><img src="/assets/logo-horizontal-primary.png" alt="'+site.name+'" width="225" height="86" loading="eager" fetchpriority="high" decoding="sync"></a><nav class="nav" id="primary-nav" aria-label="القائمة الرئيسية">'+nav.map(([href,label])=>'<a href="'+href+'" '+(url===href?'aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav><div class="header-actions"><a class="header-wa" aria-label="تواصلي عبر واتساب" href="'+site.whatsapp+'" target="_blank" rel="noopener noreferrer">'+ico('message')+'<span>اسألي عبر واتساب</span></a><button class="menu-toggle" id="menu-button" aria-expanded="false" aria-controls="primary-nav" aria-label="فتح القائمة">'+ico('menu')+'</button></div></div></header>';
}
function footer() {
 const officialLinks = [
 ['/', 'الرئيسية'],['/about/','عن الدكتورة'],['/services/','الخدمات'],['/guides/','التوعية الصحية'],['/contact/','التواصل']
 ];
 const serviceLinks = [services[0],services[1],services[2],services[4]];
 return '<footer class="footer clinic-footer"><div class="container clinic-footer__grid">'+
 '<section class="clinic-footer__contact"><h2>تواصلي معنا</h2><a href="'+site.whatsapp+'" target="_blank" rel="noopener noreferrer">'+ico('message')+'<span>واتساب العيادة</span></a><a href="'+site.call+'">'+ico('phone')+'<span>'+site.phone+'</span></a><span class="clinic-footer__item">'+ico('pin')+'<span>'+site.address+'</span></span><a href="'+site.url+'" target="_blank" rel="noopener noreferrer">'+ico('globe')+'<span>'+site.url.replace(/^https:\/\//,'')+'</span></a></section>'+
 '<nav class="clinic-footer__links" aria-label="روابط سريعة"><h2>روابط سريعة</h2>'+officialLinks.map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join('')+'</nav>'+
 '<nav class="clinic-footer__links" aria-label="الخدمات الطبية"><h2>الخدمات الطبية</h2>'+serviceLinks.map(x=>'<a href="/services/'+x.id+'/">'+x.name+'</a>').join('')+'<a href="/services/#diagnostics">المختبر والفحوصات</a></nav>'+
 '<section class="clinic-footer__brand"><a href="/"><img src="/assets/logo-horizontal-primary.png" alt="'+site.name+'" width="225" height="86" loading="lazy"></a><h2 class="visually-hidden">'+site.short+'</h2><p>رعاية متخصصة لصحة المرأة ومتابعة الحمل وتأخر الإنجاب في ذمار.</p><p class="clinic-footer__hours">الدوام: السبت–الخميس<br>8 صباحًا–1 ظهرًا، 4 عصرًا–8 مساءً</p></section>'+
 '<div class="clinic-footer__meta"><p>جميع الحقوق محفوظة © <span id="year">2026</span> '+site.short+'</p><p>تطوير <a href="https://www.wasl-tech.com" target="_blank" rel="noopener noreferrer">وصل تك</a></p></div></div></footer>';
}
function cta(title = 'هل تريدين معرفة الخطوة التالية؟') {
  return '<section class="cta clinic-page-cta"><div class="container cta-inner"><div><span class="kicker kicker-light">تواصلي قبل الزيارة</span><h2>' + title + '</h2><p>اسألي عن الخدمة المناسبة، الدوام، أو طريقة الوصول قبل الحضور.</p></div><div class="cta-actions">' + link(site.whatsapp, 'اسألي عبر واتساب', 'white', 'message') + link(site.call, 'اتصلي الآن', 'ghost', 'phone') + '</div></div></section>';
}
const innerBreadcrumb = (kicker,title) => {
 const parent = services.some(s=>s.name===title) ? ['/services/','الخدمات الطبية']
  : articles.some(a=>a.title===title) ? ['/guides/','التوعية الصحية'] : null;
 return '<nav class="breadcrumbs" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span>'+
  (parent?'<a href="'+parent[0]+'">'+parent[1]+'</a><span aria-hidden="true">/</span>':'')+
  '<span aria-current="page">'+(parent?title:kicker)+'</span></nav>';
};
const innerHero = (kicker,title,desc,asset='hero-mother-care.webp',mode='image') =>
 '<section class="clinic-inner-hero'+(mode==='text'?' clinic-inner-hero--text':mode==='clinic'?' clinic-inner-hero--clinic':'')+'"><div class="container clinic-inner-hero__grid">'+
 '<div class="clinic-inner-hero__copy">'+innerBreadcrumb(kicker,title)+'<h1>'+title+'</h1><p>'+desc+'</p></div>'+
 (mode==='text'?'':'<div class="clinic-inner-hero__visual"><img data-image-slot="inner" src="'+(mode==='clinic'?'/assets/'+asset:mode==='svg'?'/assets/illustrations/'+asset+'.svg':'/assets/generated/'+asset)+'" alt="'+(mode==='clinic'?'شعار واسم الدكتورة فايزة الوصابي على جدار العيادة':kicker)+'" width="960" height="540" loading="eager" fetchpriority="high" decoding="async"></div>')+
 '</div></section>';
function pageHead(kicker,title,sub,art='motherhood',variant='') {
 const assets={motherhood:'hero-mother-care.webp',pregnancy:'pregnancy-care.webp',womens:'womens-consultation.webp',fertility:'fertility-support.webp',diagnostics:'diagnostics'};
 const asset=assets[art]||'hero-mother-care.webp';
 return innerHero(kicker,title,sub,asset,art==='diagnostics'?'svg':'image');
}
function values() {
  return '<section class="section values-section"><div class="container"><div class="heading"><span class="kicker">طريقة الرعاية</span><h2>معلومات أوضح، وقرار أهدأ</h2><p>نستمع إلى أسئلتكِ، ونشرح خيارات الفحص والمتابعة بلغة واضحة تناسب احتياجاتكِ.</p></div><div class="values-grid"><article class="value-item"><span class="value-icon">' + ico('message') + '</span><div><h3>نستمع أولًا</h3><p>وصفك للأعراض وتاريخك الصحي جزء أساسي من فهم الحالة.</p></div></article><article class="value-item"><span class="value-icon">' + ico('shield') + '</span><div><h3>نحترم الخصوصية</h3><p>نمنحكِ مساحة لطرح أسئلتكِ ومناقشة احتياجاتكِ بخصوصية واحترام.</p></div></article><article class="value-item"><span class="value-icon">' + ico('arrow') + '</span><div><h3>نوضح الخطوة التالية</h3><p>تخرجين من الزيارة وأنت تعرفين ما يلزم متابعته أو السؤال عنه.</p></div></article></div></div></section>';
}
function firstVisit() {
 const steps=[
 ['message','تواصلي معنا','اسألي عن وقت الزيارة والخدمة المناسبة.'],
 ['file','جهّزي معلوماتكِ','أحضري التقارير وأسماء الأدوية إن توفرت.'],
 ['heart','ابدئي الاستشارة','اشرحي الأعراض وأسئلتكِ لتحديد ما يلزم من تقييم.'],
 ['check','اعرفي خطوتكِ القادمة','استفسري عن المتابعة ومتى تحتاجين إلى مراجعة أخرى.']
 ];
 return '<section class="agency-first-visit clinic-process" aria-labelledby="agency-first-visit-title"><div class="container"><div class="clinic-process__heading"><span class="kicker">خطوات زيارتكِ</span><h2 id="agency-first-visit-title">كيف تبدأ رحلتكِ معنا؟</h2><p>من الاستفسار الأول حتى فهم خطة المتابعة، بخطوات بسيطة وواضحة.</p></div><ol class="clinic-process__timeline">'+steps.map(([icon,title,desc],i)=>'<li><span class="clinic-process__icon">'+ico(icon)+'</span><div><small>0'+(i+1)+'</small><h3>'+title+'</h3><p>'+desc+'</p></div></li>').join('')+'</ol></div></section>';
}
const careTopics = {
  pregnancy: {
    opening: 'من أول زيارة لتأكيد الحمل وحتى الاستعداد للولادة، تتغير الأسئلة المهمة مع كل مرحلة. لذلك لا تقتصر المتابعة على الاطمئنان في لحظة معينة؛ بل تساعد على ربط الأعراض والتاريخ الصحي ونتائج الفحوصات بخطة واضحة.',
    sections: [
      ['بداية الحمل', 'تُناقش بداية الحمل وتاريخه، والأعراض الحالية، والأدوية المستخدمة، والتاريخ الصحي أو أي حمل سابق. وقد توصي الطبيبة بفحوصات أو تصوير وفق عمر الحمل وما يظهر في التقييم.'],
      ['خلال أشهر الحمل', 'تشمل المتابعة مناقشة نمو الحمل والتغيرات الطبيعية والعلامات التي تستدعي مراجعة مبكرة، مع توضيح دور التحاليل والتصوير عند الحاجة، وتوقيت العودة المناسب لكل حالة.'],
      ['الاستعداد للولادة', 'في المراحل الأخيرة تصبح خطة الولادة والاستعداد لها والأسئلة المتعلقة بوقت الذهاب إلى جهة الاستقبال جزءًا أساسيًا من النقاش، خاصة عند وجود عوامل خطورة أو تجارب ولادة سابقة.']
    ],
    questions: ['متى يُنصح بالزيارة القادمة؟', 'ما الأعراض التي تستوجب تواصلاً عاجلاً؟', 'هل يلزمني فحص أو تحضير قبل الموعد؟']
  },
  'womens-health': {
    opening: 'صحة المرأة لا ترتبط بمرحلة عمرية واحدة. فقد تكون الزيارة بسبب اضطراب في الدورة، أو ألم بالحوض، أو تغير غير معتاد، أو رغبة في مناقشة وسائل تنظيم الأسرة والصحة الوقائية.',
    sections: [
      ['اضطرابات الدورة والهرمونات', 'تختلف أسباب عدم انتظام الدورة والنزف غير المعتاد من حالة لأخرى؛ ولهذا تؤخذ طبيعة الأعراض ومدتها والتاريخ الصحي في الاعتبار قبل تحديد الحاجة إلى التحاليل أو السونار.'],
      ['آلام الحوض والأعراض المتكررة', 'الألم المتكرر أو الإفرازات غير المعتادة أو الأعراض التي تؤثر على الحياة اليومية تستحق نقاشًا طبيًا منظمًا لتحديد ما يلزم من فحص أو متابعة.'],
      ['الوقاية وتنظيم الأسرة', 'تُناقش الخيارات المتاحة لتنظيم الأسرة وفق التاريخ الصحي والاحتياج الشخصي، مع توضيح مزايا كل خيار واعتباراته، وقد تتضمن الزيارة مناقشة الفحوصات الوقائية الملائمة.']
    ],
    questions: ['ما المعلومات التي تساعد في تفسير الأعراض؟', 'هل يلزم السونار أو التحاليل؟', 'متى يجب إعادة التقييم إذا استمر العرض؟']
  },
  fertility: {
    opening: 'رحلة تقييم تأخر الإنجاب تحتاج إلى فهم الصورة كاملة، بعيدًا عن الوصفات المتشابهة أو إلقاء المسؤولية على طرف واحد. عوامل الخصوبة قد تكون متداخلة وتتطلب خطوات متدرجة.',
    sections: [
      ['متى يُنصح بطلب التقييم؟', 'في العموم يُنصح بالتقييم بعد 12 شهرًا من المحاولة المنتظمة دون حمل لمن هن دون 35 عامًا، وبعد 6 أشهر لمن هن في سن 35 عامًا أو أكبر، وقد يُنصح بتقييم أبكر عند وجود عوامل خطورة أو اضطرابات معروفة.'],
      ['تقييم يشمل الزوجين', 'قد تشمل البداية مراجعة انتظام الدورة والحمل السابق والحالة الصحية ونتائج التحاليل السابقة، مع مناقشة تقييم الزوج أيضًا عند الحاجة؛ فلا يُفترض السبب من دون معلومات كافية.'],
      ['خطة تناسب النتائج', 'الخطوة التالية قد تكون استكمال فحوصات، أو متابعة سبب معروف، أو مناقشة خيارات علاجية وإحالة متخصصة إذا لزم الأمر. المهم فهم سبب كل خطوة قبل اتخاذها.']
    ],
    questions: ['هل تحتاج النتائج السابقة إلى إعادة؟', 'ما الخطوة المناسبة لكلا الزوجين؟', 'متى نقيّم الاستجابة أو نغيّر الخطة؟']
  },
  ultrasound: {
    opening: 'يساعد التصوير بالموجات فوق الصوتية على الإجابة عن أسئلة طبية محددة، لكنه ليس بديلًا عن التاريخ الصحي والفحص. تختلف طريقة التصوير وتوقيته باختلاف الغرض منه.',
    sections: [
      ['السونار في الحمل', 'قد يُطلب التصوير لتقييم جوانب من الحمل ونموه بحسب المرحلة، ولا يعني إجراء تصوير واحد أن كل الاحتمالات الطبية قد حُسمت.'],
      ['السونار في صحة المرأة', 'قد يدعم تقييم الرحم والمبيضين وبعض أسباب الألم أو النزف، وتُقرأ النتائج إلى جانب الأعراض والفحص السريري.'],
      ['قراءة النتيجة والتحضير', 'اسألي عن نوع التصوير المناسب وما إذا كانت هناك تعليمات تحضير؛ واحفظي التقرير السابق إن توفر للمقارنة عند الحاجة.']
    ],
    questions: ['ما السؤال الطبي الذي يجيب عنه الفحص؟', 'هل أحتاج إلى أي تحضير؟', 'متى يلزم تكرار التصوير أو مراجعة النتيجة؟']
  },
  maternity: {
    opening: 'الاستعداد للولادة لا يبدأ عند ظهور علامات المخاض فقط؛ بل يشمل معرفة الجهة التي ستستقبل الحالة، وطريقة الوصول، والمعلومات الصحية التي يجدر تجهيزها مسبقًا.',
    sections: [
      ['قبل موعد الولادة', 'ناقشي خطة الولادة مع الطبيبة أثناء المتابعة، خصوصًا إذا كانت هناك ولادة قيصرية سابقة أو حمل عالي الخطورة أو توصيات خاصة.'],
      ['عند بدء العلامات', 'قد تكون الانقباضات المنتظمة أو نزول السائل أو النزف من العلامات التي تستدعي تقييمًا. عند وجود نزف شديد أو ألم غير محتمل أو انخفاض واضح في حركة الجنين، اطلبي الرعاية العاجلة فورًا.'],
      ['الوصول والاستقبال', 'استقبال حالات الولادة على مدار اليوم تحت إشراف كادر طبي متخصص. اتصلي لمعرفة مكان الاستقبال والتحضير للحضور، وتوجهي مباشرة للرعاية العاجلة عند وجود علامات طارئة.']
    ],
    questions: ['إلى أين أتوجه عند بدء المخاض؟', 'ما الأوراق والتقارير التي أحضرها؟', 'ما العلامات التي تستدعي الذهاب فورًا؟']
  },
  cosmetic: {
    opening: 'الاستشارة التجميلية النسائية موضوع طبي شخصي، وقد تتعلق بأعراض وظيفية أو آثار ولادة أو رغبة في فهم الخيارات المتاحة. تبدأ الاستشارة بالنقاش حول الاحتياج الحقيقي والتوقعات والفائدة والضرر المحتمل.',
    sections: [
      ['التقييم أولًا', 'تُراجع الشكوى والتاريخ الطبي، ويُناقش ما إذا كان المطلوب علاج عرض وظيفي، أو تقييم تغير بعد الولادة، أو استفسارًا تجميليًا بحتًا.'],
      ['الخيارات والمخاطر', 'لا يناسب كل إجراء كل حالة؛ وقد تكون بعض التقنيات محدودة الأدلة أو تتطلب متابعة خاصة. لذلك يجب توضيح الفوائد المحتملة والمخاطر والبدائل وتكلفة الإجراء قبل الموافقة.'],
      ['قرار دون استعجال', 'يمكنك طلب وقت للتفكير، وفهم خطة التعافي والمتابعة، وطرح أي سؤال يتعلق بالخصوصية أو التوقعات الواقعية. واستفسري عن تفاصيل الإجراء وخطوات التحضير قبل الزيارة.']
    ],
    questions: ['هل أحتاج إجراءً فعلًا أم توجد بدائل؟', 'ما المخاطر وفترة التعافي المتوقعة؟', 'هل هذا الإجراء متوفر وكيف تتم متابعته؟']
  }
};
const editorialSection = (kicker,title,paragraph,items) =>
  '<section class="section editorial-block"><div class="container"><div class="heading"><span class="kicker">'+kicker+'</span><h2>'+title+'</h2><p>'+paragraph+'</p></div><div class="editorial-grid">'+items.map(([h,p],i)=>'<article class="editorial-item"><span class="editorial-number">0'+(i+1)+'</span><h3>'+h+'</h3><p>'+p+'</p></article>').join('')+'</div></div></section>';

function home() {
  return [
    '<section class="agency-hero clinic-hero" aria-labelledby="agency-hero-title"><div class="container clinic-hero__shell">'+
    '<div class="clinic-hero__copy"><span class="clinic-hero__kicker">عيادة الدكتورة فايزة الوصابي · ذمار</span><h1 id="agency-hero-title">رعاية متخصصة لصحة المرأة <span>والحمل وتأخر الإنجاب</span></h1><p>استشارات متخصصة في أمراض النساء والتوليد والخصوبة، مع اهتمام بفهم احتياج كل مراجعة وتوضيح خطوات الرعاية المناسبة لها.</p></div>'+
    '<div class="clinic-hero__visual"><img data-image-slot="home" src="/assets/generated/hero-mother-care.webp" alt="رعاية الأم وصحة المرأة" width="1600" height="900" fetchpriority="high" decoding="async"></div>'+
    '<div class="clinic-hero__actions">'+link(site.whatsapp,'تواصلي عبر واتساب','solid','message')+link("/services/","استكشفي الخدمات","line","arrow")+'</div>'+
    '<ul class="clinic-hero__features"><li>'+ico('check')+'صحة المرأة</li><li>'+ico('check')+'متابعة الحمل</li><li>'+ico('check')+'الخصوبة والإنجاب</li></ul>'+
    '</div></section>',
    "<section class=\"section agency-services\" aria-labelledby=\"agency-services-title\"><div class=\"container\"><div class=\"agency-section-head\"><div><span class=\"kicker\">الخدمات الطبية</span><h2 id=\"agency-services-title\">لكل مرحلة من صحتكِ، استشارة تناسب احتياجكِ</h2><p>تعرّفي على مجالات الاستشارة، وتواصلي للتأكد من تفاصيل الخدمة قبل الحضور.</p></div><a class=\"agency-text-link\" href=\"/services/\">جميع الخدمات ",
    ico('arrow'),
    "</a></div><div class=\"cards agency-services__cards\">",
    services.map(card).join(''),
    "</div><a class=\"agency-services__diagnostics\" href=\"/services/#diagnostics\"><span class=\"agency-services__diagnostics-symbol\" aria-hidden=\"true\">",
    ico('scan'),
    "</span><span><strong>المختبر والفحوصات والسونار</strong><small>استفسري عن التحاليل والفحوصات والتصوير المتاح وفق حالتكِ قبل الزيارة.</small></span>",
    ico('arrow'),
    "</a></div></section>",
    "<section class=\"section agency-doctor\" aria-labelledby=\"agency-doctor-title\"><div class=\"container agency-doctor__grid\"><div class=\"agency-doctor__content\"><span class=\"kicker\">عن الدكتورة</span><h2 id=\"agency-doctor-title\">تعرفي على الطبيبة التي ستستمع إلى أسئلتكِ</h2><p>الدكتورة فايزة علي ناصر الوصابي، استشارية أمراض وجراحة النساء والتوليد والعقم. تجمع مجالات تأهيلها بين الرعاية النسائية، ومتابعة الحمل، وطب الإنجاب والإخصاب المساعد.</p><p>تبدأ الاستشارة بفهم التاريخ الصحي والشكوى، ثم مناقشة ما يلزم تقييمه والمتابعة المناسبة.</p>",
    link('/about/', 'المزيد عن الدكتورة', 'line', 'arrow'),
    "</div><aside class=\"agency-doctor__credentials\" aria-label=\"التخصص والمؤهلات\"><div class=\"agency-doctor__symbol\"><img src=\"/assets/symbol-primary.png\" width=\"140\" height=\"140\" alt=\"\" loading=\"lazy\"></div><span class=\"agency-doctor__label\">التخصص المهني</span><h3>أمراض وجراحة النساء والتوليد والعقم</h3><ul><li>دكتوراه زمالة عربية (الأردن)</li><li>دكتوراه زمالة يمنية</li><li>دبلوم تجميل نسائي</li><li>دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul></aside></div></section>",
    "<section class=\"agency-birth clinic-birth\" aria-labelledby=\"agency-birth-title\"><div class=\"container agency-birth__inner\"><span class=\"agency-birth__icon\">",
    ico('clock'),
    "</span><div><span class=\"agency-birth__kicker\">معلومات عن استقبال الولادة</span><h2 id=\"agency-birth-title\">استقبال حالات الولادة على مدار 24 ساعة</h2><p>تحت إشراف كادر طبي متخصص. يرجى الاتصال لتأكيد موقع الاستقبال قبل الحضور؛ هذه الخدمة منفصلة عن دوام بقية العيادة.</p></div>",
    link(site.call, 'اتصلي للتأكيد', 'white', 'phone'),
    "</div></section>",
    firstVisit(),
    "<section class=\"section agency-guides\" aria-labelledby=\"agency-guides-title\"><div class=\"container\"><div class=\"agency-section-head\"><div><span class=\"kicker\">التوعية الصحية</span><h2 id=\"agency-guides-title\">معلومات تساعدكِ على التحضير لزيارتكِ</h2><p>مقالات توعوية عامة عن الحمل وصحة المرأة وتأخر الإنجاب، ولا تغني عن الاستشارة والتقييم الطبي.</p></div><a class=\"agency-text-link\" href=\"/guides/\">جميع المقالات ",
    ico('arrow'),
    "</a></div><div class=\"tiles\">",
    articles.slice(0,3).map(articleTile).join(''),
    "</div></div></section>",
    '<section class="section agency-visit clinic-visit" aria-labelledby="agency-visit-title"><div class="container clinic-visit__layout">'+
    '<div class="clinic-visit__location"><span class="kicker">موقع العيادة</span><h2 id="agency-visit-title">ننتظركِ في ذمار</h2><p class="clinic-visit__intro">يسعدنا استقبال استفساراتكِ ومساعدتكِ على الوصول إلى العيادة بكل سهولة.</p>'+
    '<div class="clinic-visit__address"><span class="clinic-visit__address-icon">'+ico('pin')+'</span><div><strong>عنوان العيادة</strong><p>ذمار، شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي.</p></div></div>'+
    '<div class="clinic-visit__actions">'+link(mapsSearch,'الاطلاع على الموقع في الخرائط','line','pin')+link(site.call,'اتصلي بالعيادة','solid','phone')+'</div>'+
    '<small class="clinic-visit__map-note">للمساعدة في الوصول، اتصلي بنا وسنوضح لكِ معالم الطريق.</small></div>'+
    '<aside class="clinic-hours" aria-label="مواعيد عمل العيادة"><div class="clinic-hours__top"><span class="clinic-hours__icon">'+ico('clock')+'</span><span class="clinic-hours__eyebrow">مواعيد العمل</span></div>'+
    '<h3>أوقات استقبال المراجعات</h3><div class="clinic-hours__days"><span>'+ico('calendar')+' أيام العمل</span><strong>السبت – الخميس</strong></div>'+
    '<div class="clinic-hours__sessions"><div class="clinic-hours__session"><span class="clinic-hours__session-name">الفترة الصباحية</span><strong><bdi>8:00 ص</bdi> <span>—</span> <bdi>1:00 م</bdi></strong></div>'+
    '<div class="clinic-hours__session"><span class="clinic-hours__session-name">الفترة المسائية</span><strong><bdi>4:00 م</bdi> <span>—</span> <bdi>8:00 م</bdi></strong></div></div>'+
    '<p class="clinic-hours__footnote">يوم الجمعة خارج مواعيد عمل العيادة. لاستقبال حالات الولادة على مدار 24 ساعة، يرجى الاتصال لتأكيد موقع الاستقبال.</p></aside>'+
    '</div></section>'

  ].join('');
}
function about() {
  return [
    innerHero('عن الدكتورة','الدكتورة فايزة علي ناصر الوصابي','استشارية أمراض وجراحة النساء والتوليد والعقم في ذمار؛ رعاية لصحة المرأة ومتابعة الحمل والخصوبة باهتمام وخصوصية.','clinic-about-hero.webp','clinic'),
    '<section class="section"><div class="container agency-profile__grid"><article class="agency-profile__story"><span class="kicker">النهج المهني</span><h2>الاهتمام بالتفاصيل يصنع فرقًا في فهم الحالة</h2><p>لكل مراجعة تاريخ صحي وظروف مختلفة. تبدأ الاستشارة بفهم الشكوى وأهداف الزيارة، ثم ربط الأعراض والتقارير المتاحة بخيارات الفحص والمتابعة. وتبقى الأسئلة جزءًا طبيعيًا من الحوار الطبي، سواء كانت الزيارة لأول مرة أو ضمن متابعة مستمرة.</p><p>تشمل مجالات الاهتمام صحة المرأة والحمل والولادة وتأخر الإنجاب والاستشارات النسائية التجميلية، مع توجيه كل حالة إلى التقييم المناسب بدل افتراض أن الحل واحد للجميع.</p></article><aside class="agency-profile__credentials"><span class="kicker">التأهيل المهني</span><h2>المؤهلات</h2><ul class="check-list"><li>'+ico('check')+'دكتوراه زمالة عربية (الأردن)</li><li>'+ico('check')+'دكتوراه زمالة يمنية</li><li>'+ico('check')+'دبلوم تجميل نسائي</li><li>'+ico('check')+'دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul></aside></div></section>',
    '<section class="agency-mission" aria-labelledby="agency-mission-title"><div class="container"><div class="agency-section-head"><div><span class="kicker">ما نطمح إليه</span><h2 id="agency-mission-title">رؤيتنا ورسالتنا</h2><p>رعاية تنطلق من احتياجاتكِ، وتمنحكِ مساحة لفهم صحتكِ ومناقشة خياراتكِ بثقة.</p></div></div><div class="agency-mission__grid"><article><span>01 / الرؤية</span><h3>رعاية نسائية أقرب إلى احتياجات كل امرأة</h3><p>أن تكون العيادة وجهة معروفة في ذمار للاستشارة النسائية المتخصصة، حيث تجد المرأة مساحة لطرح أسئلتها، وفهم خياراتها، ومتابعة صحتها بوعي في كل مرحلة من حياتها.</p></article><article><span>02 / الرسالة</span><h3>الجمع بين التخصص والوضوح والاحترام</h3><p>نسعى إلى تقديم رعاية واستشارات في أمراض النساء والولادة والخصوبة، تقوم على الإنصات والتقييم المناسب وتوضيح خطوات المتابعة، مع احترام الخصوصية والاختلافات الفردية بين المراجعات.</p></article></div></div></section>',
    editorialSection('مراحل من حياة المرأة','احتياجات تتغير ورعاية تتطور','تختلف الأسئلة الصحية من سن إلى آخر، ولهذا لا تُختصر صحة المرأة في الحمل والولادة فقط.',[['الصحة النسائية اليومية','متابعة اضطرابات الدورة وآلام الحوض والأسئلة المتعلقة بالهرمونات وتنظيم الأسرة.'],['الحمل والأمومة','مراجعات الحمل والاستعداد للولادة، ومناقشة ما يتغير قبل الحمل وبعده.'],['الخصوبة والقرارات الشخصية','فهم أسباب تأخر الإنجاب أو مناقشة خيارات نسائية أخرى وفق الأهداف والحالة الصحية.']]),
    cta('هل ترغبين في معرفة الخدمة التي تناسب استفساركِ؟')
  ].join('');
}

function servicesPage() {
 return [
  servicesHero(),
  serviceShowcase(),
  surgerySection(),
  diagnosticsSection(),
  '<section class="clinic-services-guidance"><div class="container"><div><span class="kicker">قبل الحضور</span><h2>تواصلٌ بسيط يوضح لكِ الخطوة التالية</h2><p>اسألي عن توفر الخدمة، ومكان تقديمها، والتحضير الذي تحتاجينه، ولا تؤجلي طلب الرعاية العاجلة عند وجود أعراض طارئة.</p></div>'+
  link(site.whatsapp,'اسألي العيادة عبر واتساب','solid','message')+'</div></section>'
 ].join('');
}

const serviceScope = {
 pregnancy: ['متابعة الحمل الطبيعي والحمل عالي الخطورة بحسب الحالة','تقييم العلامات التي تستدعي متابعة إضافية','الاستعداد للولادة ومراجعة التقارير'],
 'womens-health': ['اضطرابات الهرمونات وتنظيم الدورة الشهرية','الكشف المبكر عن أورام النساء ومسحة عنق الرحم وفق التقييم','تركيب وإزالة وسائل منع الحمل بعد الاستشارة'],
 fertility: ['تشخيص أسباب تأخر الإنجاب والعقم','مراجعة فحوصات الزوجين وخيارات المتابعة','تحديد الخطوات العلاجية المناسبة أو الإحالة عند الحاجة'],
 ultrasound: ['سونار متابعة الحمل والحوض بحسب التوصية الطبية','شرح نتائج التصوير وخطوات المتابعة المناسبة لحالتكِ'],
 maternity: ['الاستفسار عن الولادة الطبيعية والولادة القيصرية وفق الحالة','استقبال حالات الولادة على مدار 24 ساعة فقط، مع تأكيد جهة الاستقبال مسبقًا'],
 cosmetic: ['تقييم احتياجات التجميل النسائي وآثار الولادة','مناقشة علاج سلس البول الإجهادي والخيارات المناسبة','مناقشة الخيارات المناسبة وآلية التحضير والتعافي والمتابعة']
};


const serviceIntroHeadings = {
 pregnancy: 'متابعة تناسب كل مرحلة من الحمل',
 'womens-health': 'رعاية لأعراض وأولويات مختلفة',
 fertility: 'خطوات واضحة لفهم تأخر الإنجاب',
 ultrasound: 'التصوير لدعم التقييم الطبي',
 maternity: 'الاستعداد والاستقبال بوضوح',
 cosmetic: 'تقييم الاحتياج قبل أي إجراء'
};

function detail(s) {
 const extra=careTopics[s.id];
 const questions=extra.questions.map(q=>'<li>'+ico('check')+'<span>'+q+'</span></li>').join('');
 const related=services.filter(x=>x.id!==s.id).slice(0,3).map(item=>'<a href="/services/'+item.id+'/"><span class="clinic-related__icon">'+ico(item.icon)+'</span><strong>'+item.name+'</strong>'+ico('arrow')+'</a>').join('');
 const highlights=(serviceScope[s.id]||[]).map(x=>'<li>'+ico('check')+'<span>'+x+'</span></li>').join('');
 return pageHead('خدمات العيادة',s.name,s.desc,s.art,'compact')+
 '<section class="section clinic-detail-overview"><div class="container clinic-detail-overview__layout"><article class="clinic-detail-overview__story">'+
 '<span class="kicker">عن الخدمة</span><h2>'+serviceIntroHeadings[s.id]+'</h2><p class="clinic-detail-overview__opening">'+extra.opening+'</p>'+
 '<div class="clinic-detail-overview__topics"><h3>ما الذي تشملُه الاستشارة؟</h3><ul class="clinic-detail-overview__benefits">'+s.benefits.map(x=>'<li>'+ico('check')+'<span>'+x+'</span></li>').join('')+'</ul></div>'+
 '<div class="clinic-detail-overview__topics clinic-detail-overview__topics--scope"><h3>موضوعات وخدمات مرتبطة</h3><ul class="clinic-detail-overview__scope">'+highlights+'</ul><p class="clinic-detail-overview__scope-note">تساعدكِ الاستشارة على فهم الخيارات المناسبة لحالتكِ والتحضير للخطوة التالية.</p></div>'+
 '<div class="clinic-detail-overview__audience"><strong>لمن قد تناسب؟</strong><p>'+s.who+'</p></div></article>'+
 '<aside class="clinic-detail-contact"><span class="clinic-detail-contact__icon">'+ico(s.icon)+'</span><span class="kicker">التواصل المباشر</span><h2>هل لديكِ استفسار عن '+s.name+'؟</h2>'+
 '<p>تواصلي لمعرفة تفاصيل الخدمة والوقت المناسب لزيارتكِ.</p>'+
 link(whatsappFor(s.name),'استفسري عبر واتساب','solid','message')+link(site.call,'اتصلي بالعيادة','line','phone')+
 '<div class="clinic-detail-contact__tip"><strong>قبل الزيارة</strong><p>'+s.tip+'</p></div></aside></div></section>'+
 '<section class="section clinic-care-path"><div class="container"><div class="clinic-care-path__heading"><span class="kicker">خطوات الرعاية</span><h2>ماذا تتوقعين خلال المتابعة؟</h2></div>'+
 '<ol class="clinic-care-path__list">'+extra.sections.map(([h,p],i)=>'<li><span class="clinic-care-path__number">0'+(i+1)+'</span><h3>'+h+'</h3><p>'+p+'</p></li>').join('')+'</ol></div></section>'+
 '<section class="section clinic-questions"><div class="container clinic-questions__inner"><div><span class="kicker">قبل الموعد</span><h2>أسئلة مفيدة للطبيبة</h2></div><ul class="clinic-questions__list">'+questions+'</ul></div></section>'+
 '<section class="section clinic-related"><div class="container"><div class="clinic-related__title">'+heading('للاستكشاف','خدمات أخرى قد تهمكِ')+'</div><div class="clinic-related__links">'+related+'</div><a class="clinic-related__back" href="/services/">'+ico('arrow')+' جميع الخدمات الطبية</a></div></section>';
}

function diagnosticsSection() {
 return '<section class="section clinic-diagnostics" id="diagnostics" aria-labelledby="clinic-diagnostics-title"><div class="container">'+
 '<div class="clinic-diagnostics__heading"><span class="kicker">الفحوصات المساندة</span><h2 id="clinic-diagnostics-title">المختبر والسونار</h2><p>الفحوصات تساعد في التقييم بحسب الحالة، وتوفر النوع المطلوب وتعليمات التحضير يحتاجان إلى تأكيد قبل الحضور.</p></div>'+
 '<div class="clinic-diagnostics__grid">'+
 '<article class="clinic-diagnostics__card"><span class="clinic-diagnostics__icon">'+ico('file')+'</span><h3>فحوصات مخبرية تدعم التقييم</h3><p>يوجد مختبر ضمن خدمات العيادة. اسألي عن التحاليل المتاحة، والتوقيت المناسب لأخذ العينات، وموعد ظهور النتائج.</p>'+
 '<a href="'+whatsappFor('الفحوصات المخبرية')+'">الاستفسار عن التحاليل '+ico('arrow')+'</a></article>'+
 '<article class="clinic-diagnostics__card"><span class="clinic-diagnostics__icon">'+ico('scan')+'</span><h3>التصوير الطبي عندما يلزم</h3><p>السونار لدعم متابعة الحمل وبعض حالات أمراض النساء. اسألي عن نوع الفحص وتعليمات التحضير المناسبة قبل زيارتكِ.</p>'+
 '<a href="/services/ultrasound/">تفاصيل السونار '+ico('arrow')+'</a></article>'+
 '</div><p class="clinic-diagnostics__note">'+ico('check')+' اسألي: هل الفحص متاح؟ هل يحتاج تحضيرًا؟ وكيف تستلمين النتيجة؟</p>'+
 '</div></section>';
}

function guides() {
  return [
    innerHero('التوعية الصحية','معلومات تساعدكِ على فهم صحتكِ','مقالات مبسطة عن الحمل وصحة المرأة وتأخر الإنجاب، لتجهيزي أسئلتك قبل الاستشارة.','fertility-support.webp','text'),
    "<section class=\"section agency-article-index\"><div class=\"container\"><div class=\"note agency-article-index__notice\">إذا كنتِ تعانين من أعراض شديدة أو مفاجئة، اطلبي تقييمًا طبيًا عاجلًا ولا تنتظري الرد على الرسائل.</div><div class=\"tiles\">",
    articles.map(articleTile).join(''),
    "</div></div></section>",
    cta('لديكِ استفسار عن المتابعة؟')
  ].join('');
}
function article(a) { return innerHero(a.category,a.title,a.desc,a.image) + '<article class="section clinic-article"><div class="container article-layout"><div class="article-main"><div class="note">هذه معلومات تثقيفية عامة وليست تشخيصًا أو خطة علاج شخصية.</div>' + a.parts.map(([h, p]) => '<h2>' + h + '</h2><p>' + p + '</p>').join('') + '<p class="article-signoff">إذا كانت لديك حالة أو أعراض مقلقة، تواصلي مع الطبيبة لتحديد ما يلزم من تقييم ومتابعة.</p><a class="text-link" href="/guides/">عودة إلى التوعية الصحية ' + ico('arrow') + '</a></div><aside class="article-aside"><span class="kicker">هل لديك سؤال؟</span><h3>خذي المعلومة إلى استشارة مناسبة</h3><p>المقال يشرح الفكرة العامة، أما القرار الطبي فيعتمد على حالتك وتاريخك الصحي.</p>' + link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message') + '</aside></div></article>'; }
function faqPage() {
  return [
    innerHero('الأسئلة الشائعة','كل ما يهمك قبل الزيارة','إجابات واضحة عن التواصل والدوام والخدمات والموقع والتحضير للاستشارة.','motherhood','text'),
    "<section class=\"section agency-faq-page\"><div class=\"container agency-faq-page__grid\"><div>",
    faq(faqs),
    "</div><aside class=\"agency-faq-page__contact\"><span class=\"kicker\">هل لديكِ سؤال آخر؟</span><h2>تواصلي مع العيادة مباشرة</h2><p>يمكنكِ التأكد من الخدمة والوقت المناسب قبل الحضور.</p>",
    link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message'),
    link(site.call, 'اتصلي الآن', 'line', 'phone'),
    "</aside></div></section>"
  ].join('');
}

/* A dedicated contact hero leaves the building sign visible, with copy over the sky. */
function contactHero() {
  return `<section class="clinic-contact-hero" aria-labelledby="clinic-contact-hero-title">
    <div class="container"><div class="clinic-contact-hero__stage">
      <img class="clinic-contact-hero__image" data-image-slot="contact" src="/assets/clinic-contact-hero.webp" width="1440" height="810"
           loading="eager" fetchpriority="high" decoding="async"
           alt="لوحة عيادة الدكتورة فايزة الوصابي على واجهة المبنى">
      <div class="clinic-contact-hero__copy" dir="rtl">
        <nav class="breadcrumbs" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>التواصل</span></nav>
        <h1 id="clinic-contact-hero-title">نساعدكِ على الوصول والاستفسار</h1>
        <p>تواصلي عبر الهاتف أو واتساب لمعرفة الوقت المناسب، أو اطلعي على العنوان وساعات الدوام.</p>
      </div>
    </div></div>
  </section>`;
}

/* The supplied direction diagram is illustrative; do not present it as a verified Google pin. */
function contactAddressCard() {
  return `<section class="agency-contact__location" aria-labelledby="contact-address-title">
    <div class="container"><article class="clinic-address-card">
      <div class="clinic-address-card__header">
        <div class="clinic-address-card__heading">
          <span class="clinic-address-card__icon" aria-hidden="true">${ico('pin')}</span>
          <div><span class="kicker">موقع العيادة</span><h2 id="contact-address-title">تفضلي بزيارتنا في ذمار</h2>
          <p>شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي.</p></div>
        </div>
        ${link(mapsSearch, 'ابحثي في خرائط Google', 'line', 'pin')}
      </div>
      <figure class="clinic-address-card__figure">
        <div class="clinic-address-card__diagram">
          <img src="/assets/clinic-address-map.webp" width="1672" height="765"
               alt="مخطط إرشادي على شارع صنعاء تعز بين جولة رداع وجولة كمران، يوضح العيادة قرب بنك الكريمي وعمارة الأوقاف"
               loading="lazy" decoding="async">
        </div>
        <figcaption>تعرّفي على معالم الطريق إلى العيادة من خلال مخطط الوصول.
        <a class="clinic-address-card__zoom" href="/assets/clinic-address-map.webp" target="_blank" rel="noopener noreferrer" aria-label="افتحي مخطط الوصول بالحجم الكامل في تبويب جديد">تكبير المخطط</a></figcaption>
      </figure>
    </article></div>
  </section>`;
}

function contact() {
  return [
    contactHero(),
    `<section class="section agency-contact"><div class="container agency-contact__grid"><div>
       <span class="kicker">اتصال مباشر</span><h2>اختاري طريقة التواصل المناسبة لكِ</h2>
       <p>للأسئلة عن الخدمات وتوفرها وتوقيت المراجعة، اتصلي أو أرسلي رسالة عبر واتساب.</p>
       <div class="agency-contact__actions">`,
    link(site.call, 'اتصلي الآن · 785600066', 'solid', 'phone'),
    link(site.whatsapp, 'افتحي محادثة واتساب', 'line', 'message'),
    `</div><p class="agency-contact__privacy">لخصوصيتكِ، اسألي فريق العيادة عن الطريقة المناسبة لمشاركة التقارير الطبية.</p>
     </div><aside class="agency-contact__hours">
       <div class="agency-contact__hours-head"><span class="agency-contact__hours-icon">${ico('clock')}</span>
         <div><span class="agency-contact__small">مواعيد العمل</span><strong>السبت إلى الخميس</strong></div>
       </div>
       <dl><div><dt>الفترة الصباحية</dt><dd><bdi>8:00 ص</bdi> – <bdi>1:00 م</bdi></dd></div>
           <div><dt>الفترة المسائية</dt><dd><bdi>4:00 م</bdi> – <bdi>8:00 م</bdi></dd></div></dl>
       <p class="agency-contact__hours-note">الجمعة إجازة للعيادة. استقبال حالات الولادة متاح 24 ساعة بعد تأكيد مكان الاستقبال بالاتصال.</p>
     </aside></div></section>`,
    contactAddressCard(),
    `<section class="agency-birth clinic-birth"><div class="container agency-birth__inner">
        <span class="agency-birth__icon">${ico('clock')}</span>
        <div><span class="agency-birth__kicker">استقبال حالات الولادة</span>
          <h2>الاستقبال على مدار 24 ساعة</h2>
          <p>تحت إشراف كادر طبي متخصص. اتصلي بنا لمعرفة مكان الاستقبال وطريقة الوصول.</p>
        </div>`,
    link(site.call, 'اتصلي للتأكيد', 'white', 'phone'),
    `</div></section>`
  ].join('');
}

const pages = [
  { url: '/', title: 'الرئيسية', seoTitle: 'الدكتورة فايزة الوصابي | استشارية نساء وتوليد وعقم في ذمار', desc: 'عيادة الدكتورة فايزة علي ناصر الوصابي في ذمار؛ استشارية أمراض وجراحة النساء والتوليد والعقم. تعرّفي على خدمات متابعة الحمل وصحة المرأة والمواعيد وطرق التواصل.', body: home() },
  { url: '/about/', title: 'عن الدكتورة', seoTitle: 'عن الدكتورة فايزة علي ناصر الوصابي | ذمار', desc: 'تعرّفي على الدكتورة فايزة علي ناصر الوصابي، استشارية أمراض وجراحة النساء والتوليد والعقم في ذمار، ومؤهلاتها ونهجها في رعاية صحة المرأة والحمل والخصوبة.', body: about() },
  { url: '/services/', title: 'الخدمات الطبية', desc: 'استشارات النساء والتوليد في عيادة الدكتورة فايزة الوصابي بذمار: متابعة الحمل، صحة المرأة، تأخر الإنجاب، السونار والفحوصات المساندة. تعرّفي على تفاصيل كل خدمة.', body: servicesPage() },
  ...services.map(s => ({ url: '/services/' + s.id + '/', title: s.name, desc: s.desc + ' في عيادة الدكتورة فايزة الوصابي بذمار. تعرّفي على خطوات الاستشارة والتحضير للزيارة وطرق التواصل.', body: detail(s), service: s })),
  { url: '/guides/', title: 'التوعية الصحية', desc: 'مقالات صحية مبسطة عن الحمل وصحة المرأة وتأخر الإنجاب.', body: guides() },
  ...articles.map(a => ({ url: '/guides/' + a.id + '/', title: a.title, desc: a.desc, body: article(a), article: a })),
  { url: '/faq/', title: 'الأسئلة الشائعة', desc: 'إجابات عن دوام العيادة وموقعها وخدماتها وطرق التواصل.', body: faqPage() },
  { url: '/contact/', title: 'التواصل والموقع', desc: 'تواصلي مع عيادة الدكتورة فايزة الوصابي على 785600066. ذمار، شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي. الدوام السبت–الخميس صباحًا ومساءً.', body: contact() }
];

const pageTitle = p => p.seoTitle || p.title + ' | ' + site.short + ' في ذمار';
const socialImage = p => p.url === '/about/' ? '/assets/clinic-about-hero.webp'
  : p.url === '/contact/' ? '/assets/clinic-contact-hero.webp'
  : p.article ? '/assets/generated/' + p.article.image : '/assets/clinic-social-card.png';
const pageTrail = p => [
  { name: 'الرئيسية', url: '/' },
  ...(p.service ? [{ name: 'الخدمات الطبية', url: '/services/' }] : p.article ? [{ name: 'التوعية الصحية', url: '/guides/' }] : []),
  { name: p.title, url: p.url }
];

function schemaFor(p) {
  const graph = [
    { '@type': 'MedicalClinic', '@id': site.url + '/#clinic', name: site.name,
      url: site.url, telephone: '+967785600066',
      description: 'استشارات أمراض وجراحة النساء والتوليد والعقم في ذمار.',
      logo: site.url + '/assets/logo-horizontal-primary.png',
      image: site.url + '/assets/clinic-about-hero.webp',
      address: { '@type': 'PostalAddress', addressCountry: 'YE', addressLocality: 'ذمار', streetAddress: site.address },
      medicalSpecialty: ['Obstetric', 'Gynecologic'],
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '08:00', closes: '13:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '16:00', closes: '20:00' }
      ]
    },
    { '@type': 'Person', '@id': site.url + '/#doctor', name: 'الدكتورة فايزة علي ناصر الوصابي', jobTitle: 'استشارية أمراض وجراحة النساء والتوليد والعقم', worksFor: { '@id': site.url + '/#clinic' } },
    { '@type': 'WebSite', '@id': site.url + '/#website', name: site.short, url: site.url, inLanguage: 'ar', publisher: { '@id': site.url + '/#clinic' } },
    { '@type': p.url === '/about/' ? 'AboutPage' : p.url === '/contact/' ? 'ContactPage' : p.url === '/faq/' ? 'FAQPage' : 'WebPage', '@id': site.url + p.url + '#webpage', url: site.url + p.url, name: pageTitle(p), description: p.desc, isPartOf: { '@id': site.url + '/#website' }, about: { '@id': site.url + (p.url === '/about/' ? '/#doctor' : '/#clinic') }, inLanguage: 'ar', ...(p.url !== '/' ? { breadcrumb: { '@id': site.url + p.url + '#breadcrumb' } } : {}), ...(p.url === '/faq/' ? { mainEntity: faqs.map(([q,a]) => ({ '@type': 'Question', name:q, acceptedAnswer:{ '@type':'Answer', text:a } })) } : {}) }
  ];
  if (p.url !== '/') graph.push({ '@type': 'BreadcrumbList', '@id': site.url + p.url + '#breadcrumb', itemListElement: pageTrail(p).map((item,i) => ({ '@type':'ListItem', position:i+1, name:item.name, item:site.url+item.url })) });
  if (p.service) graph.push({ '@type': 'Service', '@id': site.url + p.url + '#service', name: p.service.name, description: p.service.desc, url: site.url + p.url, provider: { '@id': site.url + '/#clinic' }, areaServed: { '@type': 'City', name: 'ذمار' }, mainEntityOfPage: { '@id': site.url + p.url + '#webpage' } });
  if (p.article) graph.push({ '@type': 'Article', headline: p.article.title, description: p.article.desc, image: site.url + '/assets/generated/' + p.article.image, publisher: { '@id': site.url + '/#clinic' }, mainEntityOfPage: site.url + p.url });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function html(p) {
  const title = pageTitle(p);
  const noindex = p.url === '/404/';
  const canonical = noindex
    ? '<meta name="robots" content="noindex,follow">'
    : '<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="' + site.url + p.url + '">';
  const ogType = p.article ? 'article' : 'website';
  const ogImage = site.url + socialImage(p);
  const ogImageAlt = p.url === '/about/' ? 'شعار واسم الدكتورة فايزة الوصابي على جدار العيادة'
    : p.url === '/contact/' ? 'لوحة عيادة الدكتورة فايزة الوصابي على واجهة المبنى'
    : p.article ? p.article.title : 'عيادة الدكتورة فايزة الوصابي — رعاية متخصصة لصحة المرأة في ذمار';
  return '<!doctype html><html lang="ar" dir="rtl"><head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="theme-color" content="#0C495C">' +
    '<title>' + title + '</title>' +
    '<meta name="description" content="' + p.desc + '">' +
    canonical +
    '<meta property="og:locale" content="ar_YE">' +
    '<meta property="og:site_name" content="' + site.short + '">' +
    '<meta property="og:type" content="' + ogType + '">' +
    '<meta property="og:title" content="' + title + '">' +
    '<meta property="og:description" content="' + p.desc + '">' +
    '<meta property="og:url" content="' + site.url + p.url + '">' +
    '<meta property="og:image" content="' + ogImage + '">' +
    (ogImage.endsWith('/clinic-social-card.png') ? '<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">' : '') +
    '<meta property="og:image:alt" content="' + ogImageAlt + '">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + title + '">' +
    '<meta name="twitter:description" content="' + p.desc + '">' +
    '<meta name="twitter:image" content="' + ogImage + '">' +
    '<meta name="twitter:image:alt" content="' + ogImageAlt + '">' +
    '<link rel="icon" href="/assets/symbol-primary.png">' +
    '<link rel="preload" as="font" href="/assets/fonts/ibm-plex-sans-arabic-400.woff2" type="font/woff2" crossorigin>' +
    (noindex ? '' : '<link rel="preload" as="image" href="/assets/logo-horizontal-480.webp" fetchpriority="high">') +
    '<link rel="stylesheet" href="/styles/site.css">' +
    '<script type="application/ld+json">' + schemaFor(p) + '</script>' +
    '<script src="/scripts/site.js" defer></script></head><body id="page-top" tabindex="-1">' +
    (noindex ? '' : header(p.url)) +
    '<main id="main">' + p.body + '</main>' +
    (noindex ? '' : footer()) +
    '<a class="back-to-top" href="#page-top" aria-label="العودة إلى أعلى الصفحة" data-back-to-top hidden>'+ico('arrow')+'</a>' +
    '</body></html>';
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const p of pages) { const file = path.join(OUT, p.url === '/' ? 'index.html' : p.url.slice(1) + 'index.html'); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html(p), 'utf8'); }
const fullCss=fs.readFileSync(path.join(ROOT,'src','styles.css'),'utf8');
const optimizedCss=(await transform(fullCss,{loader:'css',minify:true,target:'es2020'})).code;
const optimizedJs=(await transform(fs.readFileSync(path.join(ROOT,'src','client.js'),'utf8'),{loader:'js',minify:true,target:'es2019'})).code;
fs.mkdirSync(path.join(OUT,'styles'),{recursive:true});
fs.mkdirSync(path.join(OUT,'scripts'),{recursive:true});
fs.writeFileSync(path.join(OUT,'styles','site.css'),optimizedCss,'utf8');
fs.writeFileSync(path.join(OUT,'scripts','site.js'),optimizedJs,'utf8');
console.log('Asset bundling (CSS minified, JS minified):',JSON.stringify({cssBeforeBytes:Buffer.byteLength(fullCss),cssAfterBytes:Buffer.byteLength(optimizedCss),jsAfterBytes:Buffer.byteLength(optimizedJs)}));
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
execFileSync(process.execPath,[path.join(ROOT,'../tools/build_social_card.mjs')],{stdio:'inherit'});
fs.writeFileSync(path.join(OUT, '404.html'), html({ url: '/404/', title: 'الصفحة غير موجودة', desc: 'الرابط غير موجود.', body: '<section class="clinic-notfound"><div class="clinic-notfound__inner"><img src="/assets/symbol-primary.png" width="72" height="72" alt=""><span class="clinic-notfound__code">404</span><h1>الصفحة غير موجودة</h1>' + link('/', 'العودة للرئيسية', 'solid','arrow') + '</div></section>' }));
/* Images are transformed at build time, never in the visitor's browser. */
const assetsOut=path.join(OUT,'assets');
const rawLogo=path.join(assetsOut,'logo-horizontal-primary.png');
const rawSymbol=path.join(assetsOut,'symbol-primary.png');
const imageBudget=[];
const convert=async(input,output,width,quality=76)=>{
 const info=await sharp(input).metadata();
 await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality,effort:5}).toFile(output);
 imageBudget.push({asset:path.relative(assetsOut,output),beforeBytes:fs.statSync(input).size,afterBytes:fs.statSync(output).size});
 return info;
};
await convert(rawLogo,path.join(assetsOut,'logo-horizontal-480.webp'),480,78);
await convert(rawSymbol,path.join(assetsOut,'symbol-128.webp'),128,80);
await sharp(rawSymbol).resize({width:64,height:64,fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).png({compressionLevel:9}).toFile(path.join(assetsOut,'favicon-64.png'));
// The original and responsive files share one source of dimensions and descriptors.
const responsive=new Map();
const photosDir=path.join(assetsOut,'generated');
const photos=fs.readdirSync(photosDir).filter(n=>n.endsWith('.webp')&&!/-\d+\.webp$/.test(n)).map(n=>'generated/'+n);
photos.push('clinic-contact-hero.webp','clinic-about-hero.webp');
for(const filename of photos){
 const input=path.join(assetsOut,filename);
 const info=await sharp(input).metadata();
 // Re-encode display originals too; source artwork remains untouched in assets/.
 fs.writeFileSync(input,await sharp(input).webp({quality:72,effort:5}).toBuffer());
 const formats=[];
 for(const width of [360,480,720,960,1200]){
  if(info.width <= width)continue;
  const name=filename.replace(/\.webp$/,`-${width}.webp`);
  await convert(path.join(ROOT,'assets',filename),path.join(assetsOut,name),width,70);
  formats.push({name,width});
 }
 formats.push({name:filename,width:info.width});
 responsive.set('/assets/'+filename,{formats,width:info.width,height:info.height});
}
const imageSizes={
 home:'(max-width: 680px) calc(100vw - 76px), (max-width: 1204px) calc(47vw - 55px), 510px',
 inner:'(max-width: 680px) calc(100vw - 44px), (max-width: 1204px) calc(44vw - 51px), 480px',
 services:'(max-width: 680px) calc(100vw - 84px), (max-width: 1204px) calc(42vw - 45px), 460px',
 contact:'(max-width: 680px) calc(100vw - 44px), (max-width: 1204px) calc(74vw - 33px), 858px'
};
const htmlTargets=[...pages.map(p=>path.join(OUT,p.url==='/'?'index.html':p.url.slice(1)+'index.html')),path.join(OUT,'404.html')];
for(const target of htmlTargets){
 let document=fs.readFileSync(target,'utf8');
 document=document.replaceAll('src="/assets/logo-horizontal-primary.png"','src="/assets/logo-horizontal-480.webp"');
 document=document.replaceAll('src="/assets/symbol-primary.png"','src="/assets/symbol-128.webp"');
 document=document.replaceAll('rel="icon" href="/assets/symbol-primary.png"','rel="icon" type="image/png" href="/assets/favicon-64.png"');
 document=document.replace(/<img\b[^>]*>/g,tag=>{
  const source=tag.match(/\bsrc="([^"]+)"/)?.[1];
  const photo=responsive.get(source);
  if(!photo)return tag.includes('decoding=')?tag:tag.replace('<img ','<img decoding="async" ');
  const slot=tag.match(/data-image-slot="([^"]+)"/)?.[1];
  const isIndex=target===path.join(OUT,'guides','index.html');
  const sizes=imageSizes[slot]||(isIndex
   ?'(max-width: 600px) 105px, (max-width: 1204px) calc(50vw - 30px), 574px'
   :'(max-width: 600px) 110px, (max-width: 880px) calc(50vw - 30px), (max-width: 1204px) calc(33.33vw - 27px), 374px');
  const selected=photo.formats.find(x=>x.width>=960)||photo.formats.at(-1);
  const srcset=photo.formats.map(x=>'/assets/'+x.name+' '+x.width+'w').join(', ');
  const clean=tag.replace(/\s(?:src|srcset|sizes|width|height|decoding)="[^"]*"/g,'');
  return clean.replace('<img ','<img src="/assets/'+selected.name+'" srcset="'+srcset+'" sizes="'+sizes+'" width="'+photo.width+'" height="'+photo.height+'" decoding="async" ');
 });
 // The preload and the image are emitted from the SAME resolved attributes.
 const hero=document.match(/<img\b[^>]*data-image-slot="[^"]+"[^>]*>/)?.[0];
 if(hero){
  const attr=name=>hero.match(new RegExp('\\b'+name+'="([^"]+)"'))?.[1];
  document=document.replace('</head>','<link rel="preload" as="image" href="'+attr('src')+'"'+(attr('srcset')?' imagesrcset="'+attr('srcset')+'" imagesizes="'+attr('sizes')+'"':'')+' fetchpriority="high"></head>');
 }
 document=document.replace('<h1>الدكتورة فايزة علي ناصر الوصابي</h1>','<h1 class="clinic-doctor-name"><span>الدكتورة فايزة</span> <span>علي ناصر الوصابي</span></h1>');
 fs.writeFileSync(target,document,'utf8');
}
console.log('Optimized media:',JSON.stringify(imageBudget));

// Content-addressed files can be cached for a year without stale UI after releases.
// Stable aliases remain revalidated for shared image links and older page visits.
const fingerprint=new Map();
const versionAsset=relative=>{
 if(fingerprint.has(relative))return fingerprint.get(relative);
 const file=path.join(OUT,relative.slice(1));
 const bytes=fs.readFileSync(file);
 const digest=createHash('sha256').update(bytes).digest('hex').slice(0,12);
 const versioned='/static/'+digest+relative;
 const output=path.join(OUT,versioned.slice(1));
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,bytes);
 fingerprint.set(relative,versioned);return versioned;
};
const reference=/(\/(?:assets|styles|scripts)\/[a-zA-Z0-9_./-]+\.(?:webp|png|svg|woff2|css|js))/g;
const cssFile=path.join(OUT,'styles','site.css');
const [pruned]=await new PurgeCSS().purge({
 content:[...htmlTargets,{raw:fs.readFileSync(path.join(ROOT,'src','client.js'),'utf8'),extension:'js'}],
 css:[{raw:optimizedCss}],
 safelist:{standard:['open',/^back-to-top$/,/^clinic-image-/,/^clinic-in-view$/]},
 keyframes:false,fontFace:false
});
const finalCss=(await transform(pruned.css,{loader:'css',minify:true,target:'es2020'})).code;
console.log('CSS used by current routes:',JSON.stringify({beforeBytes:Buffer.byteLength(optimizedCss),afterBytes:Buffer.byteLength(finalCss)}));
fs.writeFileSync(cssFile,finalCss.replace(reference,url=>versionAsset(url)));
for(const target of htmlTargets){
 const content=fs.readFileSync(target,'utf8').replace(reference,(url,matched,offset,whole)=>{
  // Keep absolute canonical social-image URLs stable; version browser resources.
  if(whole.slice(Math.max(0,offset-30),offset).endsWith(site.url))return url;
  return versionAsset(url);
 });
 fs.writeFileSync(target,content);
}

fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + site.url + '/sitemap.xml\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(p => '<url><loc>' + site.url + p.url + '</loc></url>').join('') + '</urlset>');
console.log('Built', pages.length, 'routes.');
