import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');
const site = {
  name: 'عيادة الدكتورة فايزة علي ناصر الوصابي',
  short: 'عيادة الدكتورة فايزة',
  phone: '785600066',
  call: 'tel:+967785600066',
  whatsapp: 'https://wa.me/967785600066?text=' + encodeURIComponent('مرحبًا، أود الاستفسار عن خدمات العيادة والوقت المناسب للزيارة.'),
  url: 'https://dr-fayza.vercel.app',
  address: 'ذمار — شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي',
  hours: 'السبت إلى الخميس، 8 صباحًا–1 ظهرًا، و4 عصرًا–8 مساءً.'
};

const services = [
  { id: 'pregnancy', name: 'متابعة الحمل', icon: 'baby', art: 'pregnancy', desc: 'متابعة مراحل الحمل وفهم الفحوصات والاستفسارات المناسبة لكل مرحلة.', intro: 'تختلف احتياجات الحمل من سيدة لأخرى. تبدأ المتابعة بمراجعة التاريخ الصحي وعمر الحمل ثم توضيح ما يلزم من تقييم ومتابعة.', benefits: ['مراجعة التاريخ الصحي وعوامل الخطورة', 'متابعة الحمل بحسب المرحلة والحالة', 'مناقشة الأعراض والاستفسارات', 'الاستعداد للولادة بخطوات واضحة'], who: 'للسيدات الحوامل أو من يخططن للحمل ويرغبن في استشارة متخصصة.', tip: 'أحضري تقاريرك السابقة وقائمة الأدوية إن وُجدت.' },
  { id: 'womens-health', name: 'صحة المرأة وأمراض النساء', icon: 'heart', art: 'womens', desc: 'تقييم ومتابعة اضطرابات الدورة والأعراض النسائية وتنظيم الأسرة.', intro: 'يساعد وصف الأعراض ومدتها والتاريخ الصحي على بناء استشارة أوضح وتحديد الفحوصات المناسبة عند الحاجة.', benefits: ['مناقشة اضطرابات الدورة والأعراض غير المعتادة', 'تقييم التاريخ الصحي والأدوية', 'الاستشارة حول تنظيم الأسرة', 'شرح الخطوات التالية بلغة واضحة'], who: 'لمن تحتاج إلى تقييم أو متابعة نسائية بحسب الأعراض والحالة.', tip: 'دوّني الأعراض ومدتها وأي فحوصات أو علاجات سابقة.' },
  { id: 'fertility', name: 'تأخر الحمل والعقم', icon: 'sparkles', art: 'fertility', desc: 'تقييم أسباب تأخر الإنجاب ومراجعة الفحوصات وخيارات المتابعة.', intro: 'تأخر الحمل قد يرتبط بعوامل متعددة لدى أحد الزوجين أو كليهما. تبدأ الزيارة بمراجعة التاريخ الصحي والإنجابي دون افتراض سبب مسبق.', benefits: ['مراجعة مدة محاولة الحمل والتاريخ الصحي', 'قراءة الفحوصات السابقة عند توفرها', 'مناقشة خطوات التقييم المناسبة', 'شرح خيارات الرعاية أو الإحالة عند الحاجة'], who: 'للأزواج الراغبين في فهم الخطوة الأولى عند تأخر الحمل.', tip: 'من المفيد حضور الزوجين أو إحضار المعلومات والفحوصات المتاحة.' },
  { id: 'ultrasound', name: 'السونار والتصوير الطبي', icon: 'scan', art: 'diagnostics', desc: 'التصوير بالموجات فوق الصوتية دعمًا لتقييم الحمل وبعض الحالات النسائية.', intro: 'السونار وسيلة مساعدة في التقييم، ويحدد الطبيب نوع الفحص وتوقيته بحسب الأعراض والمرحلة والحالة.', benefits: ['التصوير بحسب التوصية الطبية', 'دعم متابعة الحمل', 'مراجعة التقارير السابقة', 'توضيح معنى النتائج والخطوة التالية'], who: 'لمن توصي الطبيبة لها بفحص تصويري ضمن خطة التقييم.', tip: 'اسألي عن نوع الفحص المتاح وتعليمات التحضير قبل الحضور.' },
  { id: 'maternity', name: 'استقبال حالات الولادة', icon: 'clock', art: 'motherhood', desc: 'استقبال حالات الولادة على مدار 24 ساعة تحت إشراف كادر طبي متخصص.', intro: 'استقبال حالات الولادة على مدار 24 ساعة منفصل عن ساعات الدوام الاعتيادي للعيادة. اتصلي قبل الحضور لتأكيد مكان الاستقبال وطريقة الوصول.', benefits: ['استقبال حالات الولادة على مدار 24 ساعة', 'إشراف كادر طبي متخصص', 'تأكيد مكان استقبال الحالة بالاتصال', 'توجيه الحالة بحسب وضعها الطبي'], who: 'للاستفسار عن استقبال حالات الولادة وطريقة الوصول.', tip: 'في الحالة الطارئة توجهي إلى أقرب طوارئ قادرة على تقديم الرعاية، واتصلي لتأكيد جهة الاستقبال.' },
  { id: 'cosmetic', name: 'الاستشارات التجميلية النسائية', icon: 'flower', art: 'womens', desc: 'استشارة وتقييم الاحتياجات المرتبطة بالتجميل النسائي قبل اتخاذ أي إجراء.', intro: 'تبدأ الاستشارة بفهم الاحتياج ومناقشة الملاءمة الطبية والتوقعات والبدائل والمخاطر المحتملة.', benefits: ['تقييم الاحتياج بشكل فردي', 'مناقشة الخيارات والبدائل', 'توضيح التوقعات الواقعية', 'تحديد المتابعة المناسبة'], who: 'لمن ترغب في مناقشة احتياج تجميلي نسائي مع الطبيبة.', tip: 'توفر بعض الإجراءات والتقنيات يحتاج إلى تأكيد مباشر قبل الحضور.' }
];

const faqs = [
  ['ما أوقات دوام العيادة؟', site.hours],
  ['هل استقبال حالات الولادة متاح 24 ساعة؟', 'نعم، استقبال حالات الولادة مُعلن عنه على مدار 24 ساعة تحت إشراف كادر طبي متخصص. اتصلي لتأكيد مكان الاستقبال قبل الحضور.'],
  ['أين تقع العيادة؟', site.address + ' يُرجى الاتصال عند الحاجة إلى إرشادات دقيقة للوصول.'],
  ['كيف أستفسر عن موعد أو خدمة؟', 'يمكنك الاتصال أو مراسلة واتساب على الرقم ' + site.phone + '. وللتأكد من الموعد، يُرجى التواصل مباشرة مع العيادة.'],
  ['هل يمكن إحضار فحوصات سابقة؟', 'نعم، إحضار التقارير والتحاليل السابقة وقائمة الأدوية يساعد على جعل الاستشارة أكثر وضوحًا.'],
  ['هل كل الخدمات متاحة طوال اليوم؟', 'لا. استقبال حالات الولادة فقط مُعلن عنه 24 ساعة، أما الدوام الاعتيادي وبقية الخدمات فتحتاج إلى الالتزام بالساعات أو التأكيد بالاتصال.'],
  ['هل تقدم المقالات تشخيصًا للحالة؟', 'لا. المقالات للتثقيف العام ولا تغني عن الفحص أو الاستشارة الطبية المناسبة للحالة.']
];

const articles = [
  { id: 'pregnancy-care', title: 'متابعة الحمل: لماذا تختلف الزيارات من مرحلة لأخرى؟', category: 'الحمل والأمومة', image: 'pregnancy-care.webp', desc: 'فهم مبسط لفكرة المتابعة المنتظمة وما الذي يفيدك في كل زيارة.', parts: [
    ['المتابعة ليست جدولًا واحدًا للجميع', 'يُحدد توقيت الزيارات ونوع الفحوصات بحسب عمر الحمل والحالة الصحية والتاريخ الطبي. لذلك لا يناسب جدول سيدة بالضرورة سيدة أخرى، وتبقى الطبيبة هي الأقدر على تحديد ما يلزم بعد التقييم.'],
    ['ما الذي يفيدك قبل الموعد؟', 'اكتبي الأعراض أو الأسئلة التي تريدين مناقشتها، وأحضري نتائج الفحوصات السابقة وقائمة الأدوية أو المكملات إن وُجدت. هذه التفاصيل تساعد على استشارة منظمة وتقلل نسيان المعلومات المهمة.'],
    ['متى تطلبين مساعدة عاجلة؟', 'النزف الشديد، الألم الحاد، صعوبة التنفس، الإغماء، أو أي عرض مفاجئ ومقلق يستدعي طلب الرعاية العاجلة. لا تنتظري المقالات أو الرسائل إذا شعرتِ أن الحالة طارئة.'],
    ['الخلاصة', 'الهدف من المتابعة هو مراقبة صحة الأم والجنين، واكتشاف ما يحتاج إلى اهتمام، وشرح الخطوة التالية بوضوح.']
  ] },
  { id: 'womens-visit', title: 'كيف تستعدين للاستشارة النسائية؟', category: 'صحة المرأة', image: 'womens-consultation.webp', desc: 'خطوات بسيطة تساعدك على عرض الأعراض والحصول على استشارة أكثر فائدة.', parts: [
    ['سجلي الأعراض بوضوح', 'دوّني مكان الألم أو طبيعة العرض ومدته وما إذا كان يتكرر أو يرتبط بالدورة الشهرية. لا تحتاجين إلى استخدام مصطلحات طبية؛ الوصف الطبيعي والدقيق مفيد.'],
    ['أحضري المعلومات المهمة', 'جهزي التقارير السابقة وأسماء الأدوية والتحاليل وصورة من أي وصفة أو نتيجة متوفرة. إذا كان العرض مرتبطًا بالدورة، اذكري تاريخ آخر دورة تقريبًا.'],
    ['حضّري أسئلتك', 'اسألي: ما الاحتمالات التي نحتاج إلى تقييمها؟ هل أحتاج إلى فحص أو تحليل؟ ما الخطوة التالية؟ ومتى أعود للمراجعة؟ فهمك للخطة جزء مهم من الرعاية.'],
    ['متى لا تؤجلين الزيارة؟', 'إذا كان العرض شديدًا أو مفاجئًا أو مصحوبًا بنزف غير معتاد أو حرارة أو دوخة شديدة، اطلبي تقييمًا طبيًا عاجلًا بحسب شدة الحالة.']
  ] },
  { id: 'fertility-consultation', title: 'الزيارة الأولى عند تأخر الحمل: كيف تبدأ رحلة التقييم؟', category: 'تأخر الإنجاب', image: 'fertility-support.webp', desc: 'ماذا تناقشين في البداية، ولماذا لا ينبغي افتراض السبب قبل التقييم؟', parts: [
    ['ابدؤوا بالمعلومات لا باللوم', 'تأخر الحمل قد يرتبط بعوامل مختلفة لدى المرأة أو الرجل أو كليهما. يبدأ التقييم الجيد بالاستماع إلى التاريخ الصحي والإنجابي للزوجين، لا بافتراض أن المسؤولية تقع على طرف واحد.'],
    ['ما المعلومات التي تفيد؟', 'مدة محاولة الحمل، انتظام الدورة، أي حمل سابق، عمليات أو التهابات سابقة، الأدوية، والفحوصات السابقة. كل معلومة تساعد على اختيار الخطوة المناسبة بدل تكرار فحوصات غير ضرورية.'],
    ['الفحوصات ليست متشابهة للجميع', 'تحدد الطبيبة الحاجة إلى الفحوصات ونوعها وفق القصة الصحية والفحص. قد تحتاج الخطة إلى مراجعة نتائج سابقة أو استكمال تقييم أحد الزوجين أو كليهما.'],
    ['توقعي خطة واقعية', 'لا يمكن ضمان نتيجة أو تحديد سبب نهائي من رسالة قصيرة. الفائدة من الزيارة هي فهم الاحتمالات، معرفة ما يلزم، والاتفاق على خطوة متابعة واضحة.']
  ] },
  { id: 'ultrasound-guide', title: 'السونار أثناء الحمل: ما الذي يساعد على توضيحه؟', category: 'الفحوصات', image: 'hero-mother-care.webp', desc: 'معلومات عامة عن دور التصوير بالموجات فوق الصوتية وحدوده.', parts: [
    ['السونار وسيلة مساعدة', 'يستخدم التصوير بالموجات فوق الصوتية لدعم تقييم الحمل وبعض الحالات النسائية. نوع الفحص وتوقيته يعتمدان على المرحلة والأعراض وما تراه الطبيبة مناسبًا.'],
    ['النتيجة تحتاج إلى سياق', 'لا تُفسر صورة أو قياس منفردًا بعيدًا عن عمر الحمل والتاريخ الصحي والفحص السريري. اسألي الطبيبة عن معنى النتيجة وما إذا كانت تحتاج إلى متابعة.'],
    ['قبل الحضور', 'تأكدي من نوع الفحص المطلوب وتعليمات التحضير وتوفره في الموعد. بعض التقنيات أو الأجهزة تحتاج إلى تأكيد مباشر قبل الحضور.']
  ] }
];

const icons = { menu: 'M4 6h16M4 12h16M4 18h16', close: 'M5 5l14 14M19 5 5 19', heart: 'M20.8 4.6a5.6 5.6 0 0 0-7.9 0L12 5.5l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.5a5.6 5.6 0 0 0 0-7.9Z', clock: 'M12 7v5l4 2', pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z', phone: 'M21 16v4a2 2 0 0 1-2 2C10 21 3 14 2 5a2 2 0 0 1 2-2h4l2 5-2 2a15 15 0 0 0 6 6l2-2Z', message: 'M21 12a9 9 0 0 1-9 9 9 9 0 0 1-4-.9L3 21l1.5-4.3A9 9 0 1 1 21 12Z', arrow: 'M19 12H5m6-6-6 6 6 6', check: 'm4 12 5 5L20 6', scan: 'M3 4h18v15H3Zm5 12c3-8 7-8 10 0', baby: 'M9 4a3 3 0 0 1 6 0M12 7c-6 0-9 4-9 8s4 7 9 7 9-3 9-7-3-8-9-8Z', flower: 'M12 12C7 11 4 6 6 2c4 0 6 4 6 10Zm0 0c5-1 8-6 6-10-4 0-6 4-6 6 10Zm0 0v10', sparkles: 'm12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z', shield: 'M12 2 21 6v6c0 5-3 8-9 10-6-2-9-5-9-10V6Zm-4 10 3 3 5-6', file: 'M5 2h9l5 5v15H5Z M14 2v6h5 M9 13h6m-6 4h6', info: 'M12 11v6m0-10h.01' };
const ico = (key) => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (icons[key] || icons.heart) + '"/>' + (key === 'clock' ? '<circle cx="12" cy="12" r="9"/>' : '') + (key === 'pin' ? '<circle cx="12" cy="10" r="2.5"/>' : '') + (key === 'info' ? '<circle cx="12" cy="12" r="9"/>' : '') + '</svg>';
const link = (href, label, type = 'solid', icon = 'arrow') => '<a class="button button--' + type + '" href="' + href + '"' + (href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + ico(icon) + '</a>';
const nav = [['/', 'الرئيسية'], ['/about/', 'عن الدكتورة'], ['/services/', 'الخدمات'], ['/diagnostics/', 'الفحوصات'], ['/guides/', 'التوعية الصحية'], ['/faq/', 'الأسئلة الشائعة'], ['/contact/', 'التواصل']];
const heading = (kicker, title, sub = '') => '<div class="heading"><span class="kicker">' + kicker + '</span><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>';
const card = (s) => '<a class="card" href="/services/' + s.id + '/"><span class="card-ic">' + ico(s.icon) + '</span><h3>' + s.name + '</h3><p>' + s.desc + '</p><span class="more">اعرفي التفاصيل ' + ico('arrow') + '</span></a>';
const faq = (items) => '<div class="faq-list">' + items.map(([q, a], i) => '<details ' + (i === 0 ? 'open' : '') + '><summary>' + q + ico('arrow') + '</summary><p>' + a + '</p></details>').join('') + '</div>';
const articleTile = (a) => '<article class="tile"><div class="tile-visual"><img src="/assets/generated/' + a.image + '" alt="صورة تحريرية عن ' + a.category + '" width="960" height="720" loading="lazy"></div><div class="tile-body"><small>' + a.category + '</small><h3>' + a.title + '</h3><p>' + a.desc + '</p><a href="/guides/' + a.id + '/">اقرئي المقال ' + ico('arrow') + '</a></div></article>';

function header(url) {
  return '<a class="skip" href="#main">تخطي إلى المحتوى</a><div class="topbar"><div class="container topbar-inner"><span>' + ico('pin') + site.address + '</span><span>' + ico('clock') + 'السبت–الخميس · 8 ص–1 م، 4 م–8 م</span><a href="' + site.call + '">' + ico('phone') + site.phone + '</a></div></div><header class="header"><div class="container header-inner"><a class="logo" href="/" aria-label="الرئيسية"><img src="/assets/logo-horizontal-primary.png" alt="' + site.name + '" width="225" height="86"></a><nav class="nav" id="primary-nav" aria-label="القائمة الرئيسية">' + nav.map(([href, label]) => '<a href="' + href + '" ' + (url === href ? 'aria-current="page"' : '') + '>' + label + '</a>').join('') + '</nav><div class="header-actions"><a class="header-wa" href="' + site.whatsapp + '" target="_blank" rel="noopener noreferrer">' + ico('message') + '<span>اسألي عبر واتساب</span></a><button class="menu-toggle" id="menu-button" aria-expanded="false" aria-controls="primary-nav" aria-label="فتح القائمة">' + ico('menu') + '</button></div></div></header>';
}
function footer() {
  return '<footer class="footer"><div class="container footer-grid"><div><a href="/"><img src="/assets/logo-horizontal-dark.png" alt="' + site.name + '" width="225" height="86"></a><p>رعاية نسائية واضحة ومحترمة في ذمار، مع معلومات تساعدك على معرفة الخطوة التالية.</p></div><div><h3>معلومات الزيارة</h3><a href="' + site.call + '">' + ico('phone') + site.phone + '</a><span>' + ico('pin') + site.address + '</span><span>' + ico('clock') + site.hours + '</span></div><div><h3>روابط مفيدة</h3><a href="/services/">الخدمات الطبية</a><a href="/guides/">التوعية الصحية</a><a href="/faq/">الأسئلة الشائعة</a><a href="/contact/">التواصل والموقع</a></div></div><div class="container footer-meta"><span>© <span id="year">2026</span> ' + site.short + '</span><span>المحتوى للتثقيف ولا يغني عن الاستشارة الطبية</span></div></footer>';
}
function cta(title = 'هل تريدين معرفة الخطوة التالية؟') {
  return '<section class="cta"><div class="container cta-inner"><div><span class="kicker kicker-light">تواصلي قبل الزيارة</span><h2>' + title + '</h2><p>اسألي عن الخدمة المناسبة، الدوام، أو طريقة الوصول قبل الحضور.</p></div><div class="cta-actions">' + link(site.whatsapp, 'اسألي عبر واتساب', 'white', 'message') + link(site.call, 'اتصلي الآن', 'ghost', 'phone') + '</div></div></section>';
}
function pageHead(kicker, title, sub, art = 'motherhood', variant = '') {
  return '<section class="page-head ' + (variant ? 'page-head--' + variant : '') + '"><div class="container page-head-grid"><div><div class="breadcrumbs"><a href="/">الرئيسية</a><span>/</span><span>' + title + '</span></div><span class="kicker">' + kicker + '</span><h1>' + title + '</h1><p>' + sub + '</p></div><div class="page-art"><img src="/assets/illustrations/' + art + '.svg" alt="" aria-hidden="true" width="960" height="640" loading="lazy"></div></div></section>';
}
function values() {
  return '<section class="section values-section"><div class="container"><div class="heading"><span class="kicker">طريقة الرعاية</span><h2>معلومات أوضح، وقرار أهدأ</h2><p>نشرح ما نعرفه، نوضح ما يحتاج إلى تقييم، ولا نستبدل الاستشارة الطبية بتخمينات عامة.</p></div><div class="values-grid"><article class="value-item"><span class="value-icon">' + ico('message') + '</span><div><h3>نستمع أولًا</h3><p>وصفك للأعراض وتاريخك الصحي جزء أساسي من فهم الحالة.</p></div></article><article class="value-item"><span class="value-icon">' + ico('shield') + '</span><div><h3>نحترم الخصوصية</h3><p>نحافظ على لغة محترمة ومعلومات مسؤولة دون مبالغة أو وعود.</p></div></article><article class="value-item"><span class="value-icon">' + ico('arrow') + '</span><div><h3>نوضح الخطوة التالية</h3><p>تخرجين من الزيارة وأنت تعرفين ما يلزم متابعته أو السؤال عنه.</p></div></article></div></div></section>';
}
function home() {
  return [
    "<section class=\"agency-hero\" aria-labelledby=\"agency-hero-title\"><div class=\"container agency-hero__top\"><div class=\"agency-hero__intro\"><span class=\"agency-hero__eyebrow\"><span class=\"agency-hero__dot\" aria-hidden=\"true\"></span>عيادة الدكتورة فايزة الوصابي <span aria-hidden=\"true\">•</span> ذمار</span><h1 id=\"agency-hero-title\">رعاية متخصصة لصحة المرأة <span>والحمل وتأخر الإنجاب.</span></h1><p class=\"agency-hero__lead\">استشارات في أمراض النساء والتوليد، ومتابعة الحمل وتأخر الإنجاب، مع توضيح خطوات التقييم والمتابعة المناسبة لكل حالة.</p><div class=\"agency-hero__actions\">",
    link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message'),
    link('/services/', 'تعرّفي على الخدمات', 'line', 'arrow'),
    "</div><p class=\"agency-hero__micro\">للاستفسار عن توفر الخدمة وموعد الزيارة، تواصلي مع العيادة مباشرة.</p></div><aside class=\"agency-hero__aside\" aria-label=\"معلومات الزيارة\"><span class=\"agency-hero__aside-icon\">",
    ico('clock'),
    "</span><span class=\"agency-hero__aside-kicker\">مواعيد العيادة</span><strong>السبت – الخميس</strong><p>8:00 صباحًا – 1:00 ظهرًا<br>4:00 عصرًا – 8:00 مساءً</p><a href=\"/contact/\">العنوان ووسائل التواصل ",
    ico('arrow'),
    "</a></aside></div><div class=\"container agency-hero__media\"><figure class=\"agency-hero__figure\"><img src=\"/assets/generated/hero-mother-care.webp\" alt=\"صورة توضيحية عامة للرعاية النسائية وليست صورة للمقر أو للطبيبة\" width=\"2560\" height=\"1440\" fetchpriority=\"high\" decoding=\"async\"><figcaption>صورة توضيحية</figcaption></figure><div class=\"agency-hero__image-label\" aria-label=\"مجالات العيادة\"><span>صحة المرأة</span><span aria-hidden=\"true\">•</span><span>الحمل والولادة</span><span aria-hidden=\"true\">•</span><span>تأخر الإنجاب</span></div></div></section>",
    "<section class=\"agency-needs\" aria-labelledby=\"agency-needs-title\"><div class=\"container agency-needs__inner\"><div class=\"agency-needs__intro\"><span class=\"kicker\">ابدئي من احتياجكِ</span><h2 id=\"agency-needs-title\">ما الذي تبحثين عنه؟</h2></div><div class=\"agency-needs__grid\"><a href=\"/services/pregnancy/\"><span class=\"agency-needs__icon\">",
    ico('baby'),
    "</span><strong>متابعة الحمل</strong>",
    ico('arrow'),
    "</a><a href=\"/services/womens-health/\"><span class=\"agency-needs__icon\">",
    ico('heart'),
    "</span><strong>صحة المرأة</strong>",
    ico('arrow'),
    "</a><a href=\"/services/fertility/\"><span class=\"agency-needs__icon\">",
    ico('sparkles'),
    "</span><strong>تأخر الإنجاب</strong>",
    ico('arrow'),
    "</a><a href=\"/contact/\"><span class=\"agency-needs__icon\">",
    ico('pin'),
    "</span><strong>الزيارة والموقع</strong>",
    ico('arrow'),
    "</a></div></div></section>",
    "<section class=\"section agency-services\" aria-labelledby=\"agency-services-title\"><div class=\"container\"><div class=\"agency-section-head\"><div><span class=\"kicker\">الخدمات الطبية</span><h2 id=\"agency-services-title\">لكل مرحلة من صحتكِ، استشارة تناسب احتياجكِ</h2><p>تعرّفي على مجالات الاستشارة، وتواصلي للتأكد من تفاصيل الخدمة قبل الحضور.</p></div><a class=\"agency-text-link\" href=\"/services/\">جميع الخدمات ",
    ico('arrow'),
    "</a></div><div class=\"cards agency-services__cards\">",
    services.map(card).join(''),
    "</div></div></section>",
    "<section class=\"section agency-doctor\" aria-labelledby=\"agency-doctor-title\"><div class=\"container agency-doctor__grid\"><div class=\"agency-doctor__content\"><span class=\"kicker\">عن الدكتورة</span><h2 id=\"agency-doctor-title\">تعرفي على الطبيبة التي ستستمع إلى أسئلتكِ</h2><p>الدكتورة فايزة علي ناصر الوصابي، استشارية أمراض وجراحة النساء والتوليد والعقم. تجمع مجالات تأهيلها بين الرعاية النسائية، ومتابعة الحمل، وطب الإنجاب والإخصاب المساعد.</p><p>تبدأ الاستشارة بفهم التاريخ الصحي والشكوى، ثم مناقشة ما يلزم تقييمه والمتابعة المناسبة.</p>",
    link('/about/', 'المزيد عن الدكتورة', 'line', 'arrow'),
    "</div><aside class=\"agency-doctor__credentials\" aria-label=\"التخصص والمؤهلات\"><div class=\"agency-doctor__symbol\"><img src=\"/assets/symbol-primary.png\" width=\"140\" height=\"140\" alt=\"\" loading=\"lazy\"></div><span class=\"agency-doctor__label\">التخصص المهني</span><h3>أمراض وجراحة النساء والتوليد والعقم</h3><ul><li>دكتوراه زمالة عربية (الأردن)</li><li>دكتوراه زمالة يمنية</li><li>دبلوم تجميل نسائي</li><li>دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul></aside></div></section>",
    "<section class=\"agency-birth\" aria-labelledby=\"agency-birth-title\"><div class=\"container agency-birth__inner\"><span class=\"agency-birth__icon\">",
    ico('clock'),
    "</span><div><span class=\"agency-birth__kicker\">معلومات عن استقبال الولادة</span><h2 id=\"agency-birth-title\">استقبال حالات الولادة على مدار 24 ساعة</h2><p>تحت إشراف كادر طبي متخصص. يرجى الاتصال لتأكيد موقع الاستقبال قبل الحضور؛ هذه الخدمة منفصلة عن دوام بقية العيادة.</p></div>",
    link(site.call, 'اتصلي للتأكيد', 'white', 'phone'),
    "</div></section>",
    values(),
    "<section class=\"section agency-guides\" aria-labelledby=\"agency-guides-title\"><div class=\"container\"><div class=\"agency-section-head\"><div><span class=\"kicker\">التوعية الصحية</span><h2 id=\"agency-guides-title\">معلومات تساعدكِ على التحضير لزيارتكِ</h2><p>مقالات توعوية عامة عن الحمل وصحة المرأة وتأخر الإنجاب، ولا تغني عن الاستشارة والتقييم الطبي.</p></div><a class=\"agency-text-link\" href=\"/guides/\">جميع المقالات ",
    ico('arrow'),
    "</a></div><div class=\"tiles\">",
    articles.slice(0,3).map(articleTile).join(''),
    "</div></div></section>",
    "<section class=\"section agency-visit\" aria-labelledby=\"agency-visit-title\"><div class=\"container agency-visit__grid\"><div class=\"agency-visit__address\"><span class=\"kicker\">زيارة العيادة</span><h2 id=\"agency-visit-title\">ننتظركِ في ذمار</h2><p>ذمار، شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي.</p><div class=\"agency-visit__detail\"><span>",
    ico('clock'),
    "</span><div><strong>الدوام الاعتيادي</strong><p>السبت إلى الخميس، 8 ص–1 م و4 م–8 م.</p></div></div><div class=\"agency-visit__actions\">",
    link(site.call, 'اتصلي بالعيادة', 'solid', 'phone'),
    link('/contact/', 'تفاصيل الوصول', 'line', 'pin'),
    "</div></div><div class=\"agency-visit__faq\"><span class=\"kicker\">أسئلة قبل الزيارة</span><h3>إجابات لأكثر الاستفسارات شيوعًا</h3>",
    faq(faqs.slice(0,4)),
    "</div></div></section>"
  ].join('');
}
function about() {
  return [
    "<section class=\"agency-profile\"><div class=\"container agency-profile__intro\"><div class=\"breadcrumbs\"><a href=\"/\">الرئيسية</a><span aria-hidden=\"true\">/</span><span>عن الدكتورة</span></div><span class=\"kicker\">التعريف بالدكتورة</span><h1>الدكتورة فايزة علي ناصر الوصابي</h1><p class=\"agency-profile__lead\">استشارية أمراض وجراحة النساء والتوليد والعقم</p><p>رعاية متخصصة لصحة المرأة ومتابعة الحمل وتأخر الإنجاب، تبدأ بالإنصات للتفاصيل وفهم خطوات التقييم المناسبة.</p></div></section><section class=\"section\"><div class=\"container agency-profile__grid\"><article class=\"agency-profile__story\"><span class=\"kicker\">مجالات الرعاية</span><h2>استشارة واضحة تراعي اختلاف كل حالة</h2><p>تختلف احتياجات السيدات بين متابعة الحمل، والأعراض النسائية، وتقييم تأخر الإنجاب. تعتمد الاستشارة على المعلومات الصحية والفحوصات المناسبة للحالة، وليس على افتراض تشخيص مسبق.</p><div class=\"chips\"><span>متابعة الحمل</span><span>صحة المرأة</span><span>تأخر الإنجاب والعقم</span></div></article><aside class=\"agency-profile__credentials\"><span class=\"kicker\">التأهيل المهني</span><h2>المؤهلات</h2><ul class=\"check-list\"><li>",
    ico('check'),
    "دكتوراه زمالة عربية (الأردن)</li><li>",
    ico('check'),
    "دكتوراه زمالة يمنية</li><li>",
    ico('check'),
    "دبلوم تجميل نسائي</li><li>",
    ico('check'),
    "دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul><small></small></aside></div></section>",
    values(),
    "<section class=\"section agency-guides\"><div class=\"container\">",
    heading('مجالات الاستشارة', 'خدمات مخصصة لصحة المرأة', 'اطلعي على مجال الخدمة ثم تواصلي لتأكيد التفاصيل المناسبة.'),
    "<div class=\"cards\">",
    services.slice(0,3).map(card).join(''),
    "</div></div></section>",
    cta('هل لديكِ سؤال قبل الزيارة؟')
  ].join('');
}
function servicesPage() {
  return [
    "<section class=\"agency-page-intro\"><div class=\"container\"><div class=\"breadcrumbs\"><a href=\"/\">الرئيسية</a><span aria-hidden=\"true\">/</span><span>الخدمات</span></div><span class=\"kicker\">الخدمات الطبية</span><h1>استشارات ورعاية لصحة المرأة</h1><p>من متابعة الحمل إلى أمراض النساء وتأخر الإنجاب، تعرّفي على الخدمة التي تودين السؤال عنها. تُحدد خطة التقييم وفق الحالة بعد الاستشارة.</p></div></section>",
    "<section class=\"section agency-services-page\"><div class=\"container\"><div class=\"agency-section-head\"><div><span class=\"kicker\">مجالات الاستشارة</span><h2>ابدئي من احتياجكِ</h2><p>افتحي تفاصيل أي خدمة لمعرفة الخطوات العامة وما يمكنكِ التحضير له قبل الزيارة.</p></div></div><div class=\"cards agency-services__cards\">",
    services.map(card).join(''),
    "</div><p class=\"agency-services-page__note\">نوع الإجراء أو الفحص وتوفره يُؤكدان بالتواصل مع العيادة قبل الحضور، وفق الاحتياج الطبي.</p></div></section>",
    cta('هل تحتاجين إلى استفسار عن خدمة محددة؟')
  ].join('');
}
function detail(s) { return pageHead('خدمات العيادة', s.name, s.desc, s.art) + '<section class="section"><div class="container detail"><article class="prose"><span class="kicker">فهم الخدمة</span><h2>كيف تبدأ المتابعة؟</h2><p>' + s.intro + '</p><h2>ما الذي قد تتضمنه الزيارة؟</h2><ul class="feature-list">' + s.benefits.map(x => '<li>' + ico('check') + x + '</li>').join('') + '</ul><h2>لمن قد تناسب الاستشارة؟</h2><p>' + s.who + '</p><div class="note"><strong>قبل الزيارة: </strong>' + s.tip + '</div></article><aside><div class="panel"><span class="kicker">اسألي قبل الحضور</span><h2>هل هذه الخدمة مناسبة لك؟</h2><p>أرسلي سؤالك عبر واتساب أو اتصلي لمعرفة التفاصيل المتاحة والوقت المناسب.</p>' + link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message') + link(site.call, 'اتصلي بالعيادة', 'line', 'phone') + '</div><div class="panel pale"><h3>الدوام الاعتيادي</h3><p>' + site.hours + '</p></div></aside></div></section><section class="section alt"><div class="container">' + heading('قد تهمك أيضًا', 'خدمات مرتبطة') + '<div class="cards">' + services.filter(x => x.id !== s.id).slice(0, 3).map(card).join('') + '</div></div></section>' + cta(); }
function diagnostics() { return pageHead('الفحوصات الطبية', 'الفحوصات والسونار', 'الفحوصات وسائل مساعدة في التقييم، ويحدد نوعها وتوقيتها بحسب الأعراض والحالة.', 'diagnostics') + '<section class="section"><div class="container diagnostic-layout"><div class="prose"><span class="kicker">تقييم بحسب الحالة</span><h2>الفحص المناسب يبدأ باستشارة مناسبة</h2><p>قد تساعد الفحوصات المخبرية والتصوير بالموجات فوق الصوتية في تقييم بعض الحالات النسائية ومتابعة الحمل. لا يلزم كل فحص لكل سيدة، وتحدد الطبيبة ما يناسب بعد مراجعة المعلومات الطبية.</p><ul class="feature-list"><li>' + ico('check') + 'مناقشة الحاجة إلى الفحص</li><li>' + ico('check') + 'مراجعة التقارير والنتائج السابقة</li><li>' + ico('check') + 'توضيح التحضير والخطوة التالية</li></ul>' + link(site.whatsapp, 'اسألي عن الفحوصات المتاحة', 'solid', 'message') + '</div><div class="page-art large"><img src="/assets/illustrations/diagnostics.svg" alt="رسم توضيحي للتشخيص الطبي" loading="lazy"></div></div><div class="container note">تفاصيل الأجهزة والفحوصات المتاحة حاليًا ليست قائمة تشغيلية نهائية؛ يرجى التأكد قبل الحضور.</div></section>' + cta(); }
function guides() {
  return [
    "<section class=\"agency-page-intro\"><div class=\"container\"><div class=\"breadcrumbs\"><a href=\"/\">الرئيسية</a><span aria-hidden=\"true\">/</span><span>التوعية الصحية</span></div><span class=\"kicker\">التوعية الصحية</span><h1>معلومات مفهومة قبل زيارتكِ</h1><p>مقالات تثقيفية عامة عن الحمل وصحة المرأة وتأخر الإنجاب. خذي منها الأسئلة المفيدة لاستشارتكِ، وليس تشخيصًا لحالتكِ.</p></div></section><section class=\"section agency-article-index\"><div class=\"container\"><div class=\"note agency-article-index__notice\">إذا كنتِ تعانين من أعراض شديدة أو مفاجئة، اطلبي تقييمًا طبيًا عاجلًا ولا تنتظري الرد على الرسائل.</div><div class=\"tiles\">",
    articles.map(articleTile).join(''),
    "</div></div></section>",
    cta('لديكِ استفسار عن المتابعة؟')
  ].join('');
}
function article(a) { return pageHead(a.category, a.title, a.desc, 'motherhood', 'compact') + '<article class="section"><div class="container article-layout"><div class="article-main"><div class="article-cover"><img src="/assets/generated/' + a.image + '" alt="صورة تحريرية عامة عن ' + a.category + '" width="960" height="720" loading="eager"></div><div class="note">هذه معلومات تثقيفية عامة وليست تشخيصًا أو خطة علاج شخصية.</div>' + a.parts.map(([h, p]) => '<h2>' + h + '</h2><p>' + p + '</p>').join('') + '<p class="article-signoff">إذا كانت لديك حالة أو أعراض مقلقة، تواصلي مع الطبيبة لتحديد ما يلزم من تقييم ومتابعة.</p><a class="text-link" href="/guides/">عودة إلى التوعية الصحية ' + ico('arrow') + '</a></div><aside class="article-aside"><span class="kicker">هل لديك سؤال؟</span><h3>خذي المعلومة إلى استشارة مناسبة</h3><p>المقال يشرح الفكرة العامة، أما القرار الطبي فيعتمد على حالتك وتاريخك الصحي.</p>' + link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message') + '</aside></div></article>' + cta('هل تريدين مناقشة حالتك؟'); }
function faqPage() {
  return [
    "<section class=\"agency-page-intro\"><div class=\"container\"><div class=\"breadcrumbs\"><a href=\"/\">الرئيسية</a><span aria-hidden=\"true\">/</span><span>الأسئلة الشائعة</span></div><span class=\"kicker\">قبل الزيارة</span><h1>إجابات عن الأسئلة الشائعة</h1><p>المواعيد والخدمات والتواصل ومكان الوصول، تجدين أهم التفاصيل هنا.</p></div></section><section class=\"section agency-faq-page\"><div class=\"container agency-faq-page__grid\"><div>",
    faq(faqs),
    "</div><aside class=\"agency-faq-page__contact\"><span class=\"kicker\">هل لديكِ سؤال آخر؟</span><h2>تواصلي مع العيادة مباشرة</h2><p>يمكنكِ التأكد من الخدمة والوقت المناسب قبل الحضور.</p>",
    link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message'),
    link(site.call, 'اتصلي الآن', 'line', 'phone'),
    "</aside></div></section>"
  ].join('');
}
function contact() {
  return [
    "<section class=\"agency-page-intro\"><div class=\"container\"><div class=\"breadcrumbs\"><a href=\"/\">الرئيسية</a><span aria-hidden=\"true\">/</span><span>التواصل</span></div><span class=\"kicker\">الزيارة والتواصل</span><h1>نحن هنا للإجابة عن استفساركِ</h1><p>اسألي عن الخدمة أو وقت الزيارة، وتحققي من تفاصيل الوصول قبل الحضور.</p></div></section><section class=\"section agency-contact\"><div class=\"container agency-contact__grid\"><div><span class=\"kicker\">اتصال مباشر</span><h2>اختاري طريقة التواصل المناسبة لكِ</h2><p>للأسئلة عن الخدمات وتوفرها وتوقيت المراجعة، اتصلي أو أرسلي رسالة عبر واتساب.</p><div class=\"agency-contact__actions\">",
    link(site.call, 'اتصلي الآن · 785600066', 'solid', 'phone'),
    link(site.whatsapp, 'افتحي محادثة واتساب', 'line', 'message'),
    "</div><p class=\"agency-contact__privacy\">لا ترسلي صورًا أو معلومات طبية حساسة إلا عبر قناة تنصح بها العيادة.</p></div><aside class=\"agency-contact__hours\"><span class=\"agency-contact__small\">أوقات الدوام الاعتيادي</span><strong>السبت إلى الخميس</strong><dl><div><dt>الفترة الصباحية</dt><dd>8:00 ص – 1:00 م</dd></div><div><dt>الفترة المسائية</dt><dd>4:00 م – 8:00 م</dd></div></dl></aside></div></section><section class=\"agency-contact__location\"><div class=\"container agency-contact__location-inner\"><span class=\"agency-contact__place-icon\">",
    ico('pin'),
    "</span><div><span class=\"kicker\">العنوان</span><h2>تفضلي بزيارتنا في ذمار</h2><p>ذمار، شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي.</p><small>للتأكد من جهة الوصول ومكان استقبال الحالة، تواصلي مع العيادة قبل الحضور.</small></div>",
    link(site.call, 'استفسري عن الطريق', 'line', 'phone'),
    "</div></section><section class=\"agency-birth\"><div class=\"container agency-birth__inner\"><span class=\"agency-birth__icon\">",
    ico('clock'),
    "</span><div><span class=\"agency-birth__kicker\">استقبال حالات الولادة</span><h2>الاستقبال على مدار 24 ساعة</h2><p>تحت إشراف كادر طبي متخصص؛ يرجى الاتصال لتأكيد مكان الاستقبال. لا يعني ذلك توفر بقية خدمات العيادة طوال اليوم.</p></div>",
    link(site.call, 'اتصلي للتأكيد', 'white', 'phone'),
    "</div></section>"
  ].join('');
}
const pages = [
  { url: '/', title: 'الرئيسية', desc: 'عيادة الدكتورة فايزة الوصابي في ذمار؛ استشارات النساء والتوليد ومتابعة الحمل وتأخر الإنجاب.', body: home() },
  { url: '/about/', title: 'عن الدكتورة', desc: 'تعرفي على الدكتورة فايزة الوصابي وتخصصها ومجالات الاستشارة.', body: about() },
  { url: '/services/', title: 'الخدمات الطبية', desc: 'خدمات النساء والتوليد ومتابعة الحمل وصحة المرأة وتأخر الإنجاب والسونار.', body: servicesPage() },
  ...services.map(s => ({ url: '/services/' + s.id + '/', title: s.name, desc: s.desc, body: detail(s) })),
  { url: '/diagnostics/', title: 'الفحوصات والسونار', desc: 'معلومات عامة عن الفحوصات والتصوير الطبي ودورها في دعم التقييم.', body: diagnostics() },
  { url: '/guides/', title: 'التوعية الصحية', desc: 'مقالات صحية مبسطة عن الحمل وصحة المرأة وتأخر الإنجاب.', body: guides() },
  ...articles.map(a => ({ url: '/guides/' + a.id + '/', title: a.title, desc: a.desc, body: article(a), article: a })),
  { url: '/faq/', title: 'الأسئلة الشائعة', desc: 'إجابات عن دوام العيادة وموقعها وخدماتها وطرق التواصل.', body: faqPage() },
  { url: '/contact/', title: 'التواصل والموقع', desc: 'رقم واتساب عيادة الدكتورة فايزة وعنوانها ومواعيد الدوام.', body: contact() }
];

function schemaFor(p) {
  const graph = [
    { '@type': 'MedicalClinic', '@id': site.url + '/#clinic', name: site.name, url: site.url, telephone: '+967785600066', address: { '@type': 'PostalAddress', addressCountry: 'YE', addressLocality: 'ذمار', streetAddress: site.address }, medicalSpecialty: ['Obstetric', 'Gynecologic'] },
    { '@type': 'Person', '@id': site.url + '/#doctor', name: 'الدكتورة فايزة علي ناصر الوصابي', jobTitle: 'استشارية أمراض وجراحة النساء والتوليد والعقم', worksFor: { '@id': site.url + '/#clinic' } },
    { '@type': 'WebSite', '@id': site.url + '/#website', name: site.short, url: site.url, inLanguage: 'ar', publisher: { '@id': site.url + '/#clinic' } },
    { '@type': 'WebPage', '@id': site.url + p.url + '#webpage', url: site.url + p.url, name: p.title + ' | ' + site.short, isPartOf: { '@id': site.url + '/#website' }, about: { '@id': site.url + '/#clinic' }, inLanguage: 'ar' }
  ];
  if (p.url !== '/') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'الرئيسية', item: site.url }, { '@type': 'ListItem', position: 2, name: p.title, item: site.url + p.url }] });
  if (p.url === '/faq/') graph.push({ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  if (p.article) graph.push({ '@type': 'Article', headline: p.article.title, description: p.article.desc, image: site.url + '/assets/generated/' + p.article.image, publisher: { '@id': site.url + '/#clinic' }, mainEntityOfPage: site.url + p.url });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}
function html(p) {
  const title = p.title + ' | ' + site.short;
  const noindex = p.url === '/404/';
  const canonical = noindex
    ? '<meta name="robots" content="noindex,follow">'
    : '<link rel="canonical" href="' + site.url + p.url + '">';
  const ogType = p.article ? 'article' : 'website';
  const ogImage = p.article
    ? site.url + '/assets/generated/' + p.article.image
    : site.url + '/assets/logo-horizontal-primary.png';
  const ogImageAlt = p.article
    ? 'صورة توضيحية لمقال توعوي'
    : 'الشعار الرسمي لعيادة الدكتورة فايزة';
  return '<!doctype html><html lang="ar" dir="rtl"><head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="theme-color" content="#0C495C">' +
    '<title>' + title + '</title>' +
    '<meta name="description" content="' + p.desc + '">' +
    canonical +
    '<meta property="og:locale" content="ar_YE">' +
    '<meta property="og:type" content="' + ogType + '">' +
    '<meta property="og:title" content="' + title + '">' +
    '<meta property="og:description" content="' + p.desc + '">' +
    '<meta property="og:url" content="' + site.url + p.url + '">' +
    '<meta property="og:image" content="' + ogImage + '">' +
    '<meta property="og:image:alt" content="' + ogImageAlt + '">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<link rel="icon" href="/assets/symbol-primary.png">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">' +
    '<link rel="stylesheet" href="/styles/site.css">' +
    '<link rel="stylesheet" href="/styles/agency.css">' +
    '<script type="application/ld+json">' + schemaFor(p) + '</script>' +
    '<script src="/scripts/site.js" defer></script></head><body>' +
    header(p.url) +
    '<main id="main">' + p.body + '</main>' +
    footer() +
    '</body></html>';
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const p of pages) { const file = path.join(OUT, p.url === '/' ? 'index.html' : p.url.slice(1) + 'index.html'); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html(p), 'utf8'); }
for (const [src, dest] of [['styles.css', 'styles/site.css'], ['agency.css', 'styles/agency.css'], ['client.js', 'scripts/site.js']]) { fs.mkdirSync(path.dirname(path.join(OUT, dest)), { recursive: true }); fs.copyFileSync(path.join(ROOT, 'src', src), path.join(OUT, dest)); }
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, '404.html'), html({ url: '/404/', title: 'الصفحة غير موجودة', desc: 'الرابط غير موجود.', body: '<section class="section centered"><div class="container"><span class="kicker">404</span><h1>الصفحة غير موجودة</h1><p>يمكنك العودة إلى الرئيسية أو استعراض الخدمات.</p>' + link('/', 'العودة للرئيسية', 'solid') + '</div></section>' }));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + site.url + '/sitemap.xml\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(p => '<url><loc>' + site.url + p.url + '</loc></url>').join('') + '</urlset>');
console.log('Built', pages.length, 'routes.');
