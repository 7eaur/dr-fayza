import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { transform } from 'esbuild';

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

// Map search uses the known address only; it does not claim a verified business pin.
const mapsSearch = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(site.address);
const whatsappFor = (topic) => 'https://wa.me/967785600066?text=' +
  encodeURIComponent('مرحبًا، أود الاستفسار عن ' + topic + ' والوقت المناسب للزيارة.');

const services = [
  { id: 'pregnancy', name: 'متابعة الحمل', icon: 'baby', art: 'pregnancy', desc: 'متابعة مراحل الحمل وفهم الفحوصات والاستفسارات المناسبة لكل مرحلة.', intro: 'تختلف احتياجات الحمل من سيدة لأخرى. تبدأ المتابعة بمراجعة التاريخ الصحي وعمر الحمل ثم توضيح ما يلزم من تقييم ومتابعة.', benefits: ['مراجعة التاريخ الصحي وعوامل الخطورة', 'متابعة الحمل بحسب المرحلة والحالة', 'مناقشة الأعراض والاستفسارات', 'الاستعداد للولادة بخطوات واضحة'], who: 'للسيدات الحوامل أو من يخططن للحمل ويرغبن في استشارة متخصصة.', tip: 'أحضري تقاريرك السابقة وقائمة الأدوية إن وُجدت.' },
  { id: 'womens-health', name: 'صحة المرأة وأمراض النساء', icon: 'heart', art: 'womens', desc: 'استشارات لاضطرابات الدورة وصحة المرأة وتنظيم الأسرة ومناقشة الفحوصات المناسبة.', intro: 'يساعد وصف الأعراض ومدتها والتاريخ الصحي على بناء استشارة أوضح وتحديد الفحوصات المناسبة عند الحاجة.', benefits: ['مناقشة اضطرابات الدورة والأعراض غير المعتادة', 'مراجعة العوامل الهرمونية والتاريخ الصحي عند الحاجة', 'الاستشارة حول تنظيم الأسرة', 'توضيح متى قد تفيد الفحوصات أو الاستشارة الجراحية وفق التقييم'], who: 'لمن تحتاج إلى تقييم أو متابعة نسائية بحسب الأعراض والحالة.', tip: 'دوّني الأعراض ومدتها وأي فحوصات أو علاجات سابقة.' },
  { id: 'fertility', name: 'تأخر الحمل والعقم', icon: 'sparkles', art: 'fertility', desc: 'تقييم أسباب تأخر الإنجاب ومراجعة الفحوصات وخيارات المتابعة.', intro: 'تأخر الحمل قد يرتبط بعوامل متعددة لدى أحد الزوجين أو كليهما. تبدأ الزيارة بمراجعة التاريخ الصحي والإنجابي دون افتراض سبب مسبق.', benefits: ['مراجعة مدة محاولة الحمل والتاريخ الصحي', 'قراءة الفحوصات السابقة عند توفرها', 'مناقشة خطوات التقييم المناسبة', 'شرح خيارات الرعاية أو الإحالة عند الحاجة'], who: 'للأزواج الراغبين في فهم الخطوة الأولى عند تأخر الحمل.', tip: 'من المفيد حضور الزوجين أو إحضار المعلومات والفحوصات المتاحة.' },
  { id: 'ultrasound', name: 'السونار والتصوير الطبي', icon: 'scan', art: 'diagnostics', desc: 'التصوير بالموجات فوق الصوتية دعمًا لتقييم الحمل وبعض الحالات النسائية.', intro: 'السونار وسيلة مساعدة في التقييم، ويحدد الطبيب نوع الفحص وتوقيته بحسب الأعراض والمرحلة والحالة.', benefits: ['التصوير بحسب التوصية الطبية', 'دعم متابعة الحمل', 'مراجعة التقارير السابقة', 'توضيح معنى النتائج والخطوة التالية'], who: 'لمن توصي الطبيبة لها بفحص تصويري ضمن خطة التقييم.', tip: 'اسألي عن نوع الفحص المتاح وتعليمات التحضير قبل الحضور.' },
  { id: 'maternity', name: 'استقبال حالات الولادة', icon: 'clock', art: 'motherhood', desc: 'استقبال حالات الولادة على مدار 24 ساعة تحت إشراف كادر طبي متخصص.', intro: 'استقبال حالات الولادة على مدار 24 ساعة منفصل عن مواعيد عمل العيادة. اتصلي قبل الحضور لتأكيد مكان الاستقبال وطريقة الوصول.', benefits: ['استقبال حالات الولادة على مدار 24 ساعة', 'إشراف كادر طبي متخصص', 'تأكيد مكان استقبال الحالة بالاتصال', 'توجيه الحالة بحسب وضعها الطبي'], who: 'للاستفسار عن استقبال حالات الولادة وطريقة الوصول.', tip: 'في الحالة الطارئة توجهي إلى أقرب طوارئ قادرة على تقديم الرعاية، واتصلي لتأكيد جهة الاستقبال.' },
  { id: 'cosmetic', name: 'الاستشارات التجميلية النسائية', icon: 'flower', art: 'womens', desc: 'استشارة وتقييم الاحتياجات المرتبطة بالتجميل النسائي قبل اتخاذ أي إجراء.', intro: 'تبدأ الاستشارة بفهم الاحتياج ومناقشة الملاءمة الطبية والتوقعات والبدائل والمخاطر المحتملة.', benefits: ['تقييم الاحتياج بشكل فردي', 'مناقشة الخيارات والبدائل', 'توضيح التوقعات الواقعية', 'تحديد المتابعة المناسبة'], who: 'لمن ترغب في مناقشة احتياج تجميلي نسائي مع الطبيبة.', tip: 'توفر بعض الإجراءات والتقنيات يحتاج إلى تأكيد مباشر قبل الحضور.' }
];

const faqs = [
  ['ما أوقات دوام العيادة؟', site.hours],
  ['هل استقبال حالات الولادة متاح 24 ساعة؟', 'نعم، استقبال حالات الولادة مُعلن عنه على مدار 24 ساعة تحت إشراف كادر طبي متخصص. اتصلي لتأكيد مكان الاستقبال قبل الحضور.'],
  ['أين تقع العيادة؟', site.address + ' يُرجى الاتصال عند الحاجة إلى إرشادات دقيقة للوصول.'],
  ['كيف أستفسر عن موعد أو خدمة؟', 'يمكنك الاتصال أو مراسلة واتساب على الرقم ' + site.phone + '. وللتأكد من الموعد، يُرجى التواصل مباشرة مع العيادة.'],
  ['هل يمكن إحضار فحوصات سابقة؟', 'نعم، إحضار التقارير والتحاليل السابقة وقائمة الأدوية يساعد على جعل الاستشارة أكثر وضوحًا.'],
  ['هل كل الخدمات متاحة طوال اليوم؟', 'لا. استقبال حالات الولادة فقط مُعلن عنه 24 ساعة، أما بقية خدمات العيادة فتحتاج إلى الالتزام بالساعات أو التأكيد بالاتصال.'],
  ['هل تقدم المقالات تشخيصًا للحالة؟', 'لا. المقالات للتثقيف العام ولا تغني عن الفحص أو الاستشارة الطبية المناسبة للحالة.'],
  ['كيف أستعد لزيارتي الأولى؟', 'دوّني أسئلتك والأعراض ومدتها، وأحضري الفحوصات والتقارير السابقة وأسماء الأدوية إن وجدت. قد تختلف التحضيرات بحسب نوع الخدمة.'],
  ['هل أستطيع السؤال عن الفحوصات المخبرية أو السونار؟', 'نعم، يمكنك التواصل للتأكد من نوع الفحص وتوفره وتعليمات التحضير ومكان إجرائه قبل الحضور.']
];

const articles = [
  { id: 'cycle-changes', title: 'تغيرات الدورة الشهرية: متى تحتاج إلى تقييم؟', category: 'صحة المرأة', image: 'womens-consultation.webp', desc: 'فهم أسباب الاهتمام بالتغيرات غير المعتادة وكيفية وصفها في الاستشارة.', parts: [
    ['ما الذي يتغير؟','قد تختلف مدة الدورة أو كمية النزف أو الألم من فترة لأخرى. بعض الاختلافات شائع، لكن التغير المستمر أو الشديد يستحق التقييم، خاصة إذا أثر على الحياة اليومية.'],
    ['ماذا تسجلين؟','سجلي تاريخ بداية الدورة ومدتها، وطبيعة النزف، والألم المصاحب، وأي أدوية أو تغيرات صحية حديثة.'],
    ['متى لا تنتظرين؟','النزف الغزير جدًا أو المصحوب بدوخة شديدة أو إغماء، أو الألم الحاد المفاجئ يستدعي رعاية عاجلة.'],
    ['ما الذي تتوقعينه من الاستشارة؟','قد تناقش الطبيبة التاريخ الصحي والحاجة إلى فحص أو تحاليل أو تصوير وفق الأعراض، ولا يمكن معرفة السبب من انتظام الدورة وحده.']
  ] },
  { id: 'pregnancy-warning-signs', title: 'علامات خلال الحمل لا ينبغي تجاهلها', category: 'الحمل والأمومة', image: 'pregnancy-care.webp', desc: 'أعراض تستدعي التواصل السريع أو التوجه للرعاية العاجلة.', parts: [
    ['لماذا تختلف الأعراض؟','قد ترافق الحمل تغيرات معتادة، لكن لا ينبغي اعتبار كل ألم أو نزف طبيعيًا دون تقييم.'],
    ['أعراض تحتاج عناية عاجلة','النزف الغزير، ألم البطن الشديد، صعوبة التنفس، فقدان الوعي، الصداع الشديد المصحوب بتغير الرؤية، أو انخفاض حركة الجنين على نحو مقلق تستدعي تقييمًا عاجلاً.'],
    ['ماذا تفعلين؟','اتجهي إلى الجهة القادرة على تقديم الرعاية العاجلة، ولا تنتظري جواب رسالة نصية عند وجود علامات خطورة.'],
    ['استفيدي من المتابعة','اسألي طبيبتك في كل مرحلة عن علامات الإنذار المناسبة لعمر الحمل وحالتك.']
  ] },
  { id: 'fertility-timing', title: 'تأخر الحمل: متى يبدأ التقييم وما الذي يشمله؟', category: 'تأخر الإنجاب', image: 'fertility-support.webp', desc: 'إرشاد عام لموعد طلب المشورة والخطوات الأساسية للتقييم.', parts: [
    ['التوقيت يعتمد على العمر والتاريخ الطبي','يُنصح عمومًا ببدء التقييم بعد 12 شهرًا من محاولة الحمل المنتظمة دون نجاح لمن هن دون 35 عامًا، وبعد 6 أشهر لمن هن في سن 35 عامًا أو أكبر. وقد يكون التقييم المبكر مناسبًا عند وجود عوامل خطورة.'],
    ['الطرفان جزء من التقييم','قد يتطلب الأمر تقييم صحة المرأة والرجل ومراجعة التاريخ الصحي والإنجابي بدل افتراض السبب مسبقًا.'],
    ['ليس كل فحص مناسبًا للجميع','تحدد الطبيبة ترتيب الفحوصات وأهميتها بحسب الأعراض والفحص والتاريخ الطبي، مع مراعاة النتائج السابقة.'],
    ['اجعلي الاستشارة عملية','احضري ما لديك من تقارير واكتبي أسئلتك عن سبب كل فحص وتوقيت متابعة النتائج.']
  ] },

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
 '<div class="clinic-services-hero__image"><img src="/assets/generated/pregnancy-care.webp" width="960" height="540" alt="صورة توضيحية عامة للرعاية الطبية النسائية، وليست تصويرًا للعيادة" decoding="async" fetchpriority="high"></div>'+
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
 '<p>هذه مجالات واردة في المواد التعريفية للعيادة. نوع العملية ومدى ملاءمتها ومكان إجرائها يحدده التقييم الطبي، ويجب التأكد من توفرها مباشرة مع العيادة.</p>'+
 link(whatsappFor('الاستشارات والتدخلات الجراحية النسائية'),'استفسري عن إجراء جراحي','line','message')+'</div>'+
 '<ul class="clinic-surgery__list">'+surgicalTopics.map(x=>'<li>'+ico('check')+'<span>'+x+'</span></li>').join('')+'</ul>'+
 '</div></section>';
}

const card = (s) => '<a class="card" href="/services/' + s.id + '/"><span class="card-ic">' + ico(s.icon) + '</span><h3>' + s.name + '</h3><p>' + s.desc + '</p><span class="more">اعرفي التفاصيل ' + ico('arrow') + '</span></a>';
const faq = (items) => '<div class="faq-list">' + items.map(([q, a], i) => '<details ' + (i === 0 ? 'open' : '') + '><summary>' + q + ico('arrow') + '</summary><p>' + a + '</p></details>').join('') + '</div>';
const articleTile = (a) => '<article class="tile"><div class="tile-visual"><img src="/assets/generated/' + a.image + '" alt="صورة تحريرية عن ' + a.category + '" width="960" height="720" loading="lazy"></div><div class="tile-body"><small>' + a.category + '</small><h3>' + a.title + '</h3><p>' + a.desc + '</p><a href="/guides/' + a.id + '/">اقرئي المقال ' + ico('arrow') + '</a></div></article>';

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
const innerHero = (kicker,title,desc,asset='hero-mother-care.webp',mode='image') =>
 '<section class="clinic-inner-hero"><div class="container clinic-inner-hero__grid">'+
 '<div class="clinic-inner-hero__copy"><nav class="breadcrumbs" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>'+kicker+'</span></nav><span class="kicker">'+kicker+'</span><h1>'+title+'</h1><p>'+desc+'</p></div>'+
 '<div class="clinic-inner-hero__visual"><img src="'+(mode==='svg'?'/assets/illustrations/'+asset+'.svg':'/assets/generated/'+asset)+'" alt="'+(mode==='svg'?'رسم توضيحي':'صورة تحريرية توضيحية عامة، وليست صورة لمقر العيادة أو الطبيبة')+'" width="960" height="540" loading="eager" decoding="async"></div>'+
 '</div></section>';
function pageHead(kicker,title,sub,art='motherhood',variant='') {
 const assets={motherhood:'hero-mother-care.webp',pregnancy:'pregnancy-care.webp',womens:'womens-consultation.webp',fertility:'fertility-support.webp',diagnostics:'diagnostics'};
 const asset=assets[art]||'hero-mother-care.webp';
 return innerHero(kicker,title,sub,asset,art==='diagnostics'?'svg':'image');
}
function values() {
  return '<section class="section values-section"><div class="container"><div class="heading"><span class="kicker">طريقة الرعاية</span><h2>معلومات أوضح، وقرار أهدأ</h2><p>نشرح ما نعرفه، نوضح ما يحتاج إلى تقييم، ولا نستبدل الاستشارة الطبية بتخمينات عامة.</p></div><div class="values-grid"><article class="value-item"><span class="value-icon">' + ico('message') + '</span><div><h3>نستمع أولًا</h3><p>وصفك للأعراض وتاريخك الصحي جزء أساسي من فهم الحالة.</p></div></article><article class="value-item"><span class="value-icon">' + ico('shield') + '</span><div><h3>نحترم الخصوصية</h3><p>نحافظ على لغة محترمة ومعلومات مسؤولة دون مبالغة أو وعود.</p></div></article><article class="value-item"><span class="value-icon">' + ico('arrow') + '</span><div><h3>نوضح الخطوة التالية</h3><p>تخرجين من الزيارة وأنت تعرفين ما يلزم متابعته أو السؤال عنه.</p></div></article></div></div></section>';
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
      ['الوصول والاستقبال', 'استقبال حالات الولادة معلن على مدار اليوم، لكن من المهم الاتصال مسبقًا لتأكيد مكان الاستقبال والاستعدادات العملية، وعدم تأخير الطوارئ في انتظار رد على رسالة.']
    ],
    questions: ['إلى أين أتوجه عند بدء المخاض؟', 'ما الأوراق والتقارير التي أحضرها؟', 'ما العلامات التي تستدعي الذهاب فورًا؟']
  },
  cosmetic: {
    opening: 'الاستشارة التجميلية النسائية موضوع طبي شخصي، وقد تتعلق بأعراض وظيفية أو آثار ولادة أو رغبة في فهم الخيارات المتاحة. تبدأ الاستشارة بالنقاش حول الاحتياج الحقيقي والتوقعات والفائدة والضرر المحتمل.',
    sections: [
      ['التقييم أولًا', 'تُراجع الشكوى والتاريخ الطبي، ويُناقش ما إذا كان المطلوب علاج عرض وظيفي، أو تقييم تغير بعد الولادة، أو استفسارًا تجميليًا بحتًا.'],
      ['الخيارات والمخاطر', 'لا يناسب كل إجراء كل حالة؛ وقد تكون بعض التقنيات محدودة الأدلة أو تتطلب متابعة خاصة. لذلك يجب توضيح الفوائد المحتملة والمخاطر والبدائل وتكلفة الإجراء قبل الموافقة.'],
      ['قرار دون استعجال', 'يمكنك طلب وقت للتفكير، وفهم خطة التعافي والمتابعة، وطرح أي سؤال يتعلق بالخصوصية أو التوقعات الواقعية. وتوفر الإجراء نفسه يحتاج إلى تأكيد مع العيادة.']
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
    '<div class="clinic-hero__visual"><img src="/assets/generated/hero-mother-care.webp" alt="صورة تحريرية توضيحية للرعاية النسائية وليست صورة للطبيبة أو المقر" width="2560" height="1440" fetchpriority="high" decoding="async"></div>'+
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
    '<small class="clinic-visit__map-note">رابط الخرائط يبحث عن العنوان، ويُرجى الاتصال لتأكيد جهة الوصول.</small></div>'+
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
    innerHero('عن الدكتورة','الدكتورة فايزة علي ناصر الوصابي','استشارية أمراض وجراحة النساء والتوليد والعقم؛ رعاية تشمل صحة المرأة ومتابعة الحمل والخصوبة، مع اهتمام بالتقييم الواضح لكل حالة.','womens-consultation.webp'),
    '<section class="section"><div class="container agency-profile__grid"><article class="agency-profile__story"><span class="kicker">النهج المهني</span><h2>الاهتمام بالتفاصيل يصنع فرقًا في فهم الحالة</h2><p>لكل مراجعة تاريخ صحي وظروف مختلفة. تبدأ الاستشارة بفهم الشكوى وأهداف الزيارة، ثم ربط الأعراض والتقارير المتاحة بخيارات الفحص والمتابعة. وتبقى الأسئلة جزءًا طبيعيًا من الحوار الطبي، سواء كانت الزيارة لأول مرة أو ضمن متابعة مستمرة.</p><p>تشمل مجالات الاهتمام صحة المرأة والحمل والولادة وتأخر الإنجاب والاستشارات النسائية التجميلية، مع توجيه كل حالة إلى التقييم المناسب بدل افتراض أن الحل واحد للجميع.</p></article><aside class="agency-profile__credentials"><span class="kicker">التأهيل المهني</span><h2>المؤهلات</h2><ul class="check-list"><li>'+ico('check')+'دكتوراه زمالة عربية (الأردن)</li><li>'+ico('check')+'دكتوراه زمالة يمنية</li><li>'+ico('check')+'دبلوم تجميل نسائي</li><li>'+ico('check')+'دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul></aside></div></section>',
    '<section class="agency-mission" aria-labelledby="agency-mission-title"><div class="container"><div class="agency-section-head"><div><span class="kicker">ما نطمح إليه</span><h2 id="agency-mission-title">رؤيتنا ورسالتنا</h2><p>توجه تحريري للعيادة يضع احتياجات المرأة وفهمها للخيارات الطبية في المقدمة.</p></div></div><div class="agency-mission__grid"><article><span>01 / الرؤية</span><h3>رعاية نسائية أقرب إلى احتياجات كل امرأة</h3><p>أن تكون العيادة وجهة معروفة في ذمار للاستشارة النسائية المتخصصة، حيث تجد المرأة مساحة لطرح أسئلتها، وفهم خياراتها، ومتابعة صحتها بوعي في كل مرحلة من حياتها.</p></article><article><span>02 / الرسالة</span><h3>الجمع بين التخصص والوضوح والاحترام</h3><p>نسعى إلى تقديم رعاية واستشارات في أمراض النساء والولادة والخصوبة، تقوم على الإنصات والتقييم المناسب وتوضيح خطوات المتابعة، مع احترام الخصوصية والاختلافات الفردية بين المراجعات.</p></article></div></div></section>',
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
 ultrasound: ['سونار متابعة الحمل والحوض بحسب التوصية الطبية','التصوير رباعي الأبعاد 4D مذكور في مواد العيادة، ويحتاج تأكيد توفر الجهاز قبل الحضور'],
 maternity: ['الاستفسار عن الولادة الطبيعية والولادة القيصرية وفق الحالة','استقبال حالات الولادة على مدار 24 ساعة فقط، مع تأكيد جهة الاستقبال مسبقًا'],
 cosmetic: ['تقييم احتياجات التجميل النسائي وآثار الولادة','مناقشة علاج سلس البول الإجهادي والخيارات المناسبة','تقنيات الليزر وPRP مذكورة في مواد العيادة السابقة، وتحتاج لتأكيد التوفر والملاءمة قبل الحضور']
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
 '<div class="clinic-detail-overview__topics clinic-detail-overview__topics--scope"><h3>موضوعات وخدمات مرتبطة</h3><ul class="clinic-detail-overview__scope">'+highlights+'</ul><p class="clinic-detail-overview__scope-note">إجراء الفحوصات أو العمليات وتوفر التقنيات ومكان تقديمها يحدَّد بعد التقييم ويُؤكَّد مباشرة مع العيادة.</p></div>'+
 '<div class="clinic-detail-overview__audience"><strong>لمن قد تناسب؟</strong><p>'+s.who+'</p></div></article>'+
 '<aside class="clinic-detail-contact"><span class="clinic-detail-contact__icon">'+ico(s.icon)+'</span><span class="kicker">التواصل المباشر</span><h2>هل لديكِ استفسار عن '+s.name+'؟</h2>'+
 '<p>اسألي عن توفر الخدمة وموعد الزيارة المناسب دون إرسال معلومات طبية حساسة.</p>'+
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
 '<article class="clinic-diagnostics__card"><span class="clinic-diagnostics__icon">'+ico('scan')+'</span><h3>التصوير الطبي عندما يلزم</h3><p>السونار لدعم متابعة الحمل وبعض حالات أمراض النساء. جهاز 4D مذكور في المواد التعريفية، ويُرجى تأكيد توفره عند التواصل.</p>'+
 '<a href="/services/ultrasound/">تفاصيل السونار '+ico('arrow')+'</a></article>'+
 '</div><p class="clinic-diagnostics__note">'+ico('check')+' اسألي: هل الفحص متاح؟ هل يحتاج تحضيرًا؟ وكيف تستلمين النتيجة؟</p>'+
 '</div></section>';
}

function guides() {
  return [
    innerHero('التوعية الصحية','معلومات تساعدكِ على فهم صحتكِ','مقالات مبسطة عن الحمل وصحة المرأة وتأخر الإنجاب، لتجهيزي أسئلتك قبل الاستشارة.','fertility-support.webp'),
    "<section class=\"section agency-article-index\"><div class=\"container\"><div class=\"note agency-article-index__notice\">إذا كنتِ تعانين من أعراض شديدة أو مفاجئة، اطلبي تقييمًا طبيًا عاجلًا ولا تنتظري الرد على الرسائل.</div><div class=\"tiles\">",
    articles.map(articleTile).join(''),
    "</div></div></section>",
    cta('لديكِ استفسار عن المتابعة؟')
  ].join('');
}
function article(a) { return innerHero(a.category,a.title,a.desc,a.image) + '<article class="section clinic-article"><div class="container article-layout"><div class="article-main"><div class="note">هذه معلومات تثقيفية عامة وليست تشخيصًا أو خطة علاج شخصية.</div>' + a.parts.map(([h, p]) => '<h2>' + h + '</h2><p>' + p + '</p>').join('') + '<p class="article-signoff">إذا كانت لديك حالة أو أعراض مقلقة، تواصلي مع الطبيبة لتحديد ما يلزم من تقييم ومتابعة.</p><a class="text-link" href="/guides/">عودة إلى التوعية الصحية ' + ico('arrow') + '</a></div><aside class="article-aside"><span class="kicker">هل لديك سؤال؟</span><h3>خذي المعلومة إلى استشارة مناسبة</h3><p>المقال يشرح الفكرة العامة، أما القرار الطبي فيعتمد على حالتك وتاريخك الصحي.</p>' + link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message') + '</aside></div></article>'; }
function faqPage() {
  return [
    innerHero('الأسئلة الشائعة','كل ما يهمك قبل الزيارة','إجابات واضحة عن التواصل والدوام والخدمات والموقع والتحضير للاستشارة.','motherhood','svg'),
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
      <img class="clinic-contact-hero__image" src="/assets/clinic-contact-hero.webp"
           srcset="/assets/clinic-contact-hero-720.webp 720w, /assets/clinic-contact-hero.webp 1440w"
           sizes="(max-width: 680px) 100vw, 1100px" width="1440" height="810"
           loading="eager" fetchpriority="high" decoding="async"
           alt="لوحة عيادة الدكتورة فايزة الوصابي على واجهة المبنى">
      <div class="clinic-contact-hero__copy" dir="rtl">
        <nav class="breadcrumbs" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>التواصل</span></nav>
        <span class="kicker">تواصلي معنا</span>
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
        <figcaption>مخطط إرشادي للتعرف على معالم الطريق، وليس موقعًا مثبتًا في الخرائط. يُرجى الاتصال لتأكيد جهة الوصول.
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
    `</div><p class="agency-contact__privacy">لا ترسلي صورًا أو معلومات طبية حساسة إلا عبر قناة تنصح بها العيادة.</p>
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
          <p>تحت إشراف كادر طبي متخصص؛ يرجى الاتصال لتأكيد مكان الاستقبال. لا يعني ذلك توفر بقية خدمات العيادة طوال اليوم.</p>
        </div>`,
    link(site.call, 'اتصلي للتأكيد', 'white', 'phone'),
    `</div></section>`
  ].join('');
}

const pages = [
  { url: '/', title: 'الرئيسية', desc: 'عيادة الدكتورة فايزة الوصابي في ذمار؛ استشارات النساء والتوليد ومتابعة الحمل وتأخر الإنجاب.', body: home() },
  { url: '/about/', title: 'عن الدكتورة', desc: 'تعرفي على الدكتورة فايزة الوصابي وتخصصها ومجالات الاستشارة.', body: about() },
  { url: '/services/', title: 'الخدمات الطبية', desc: 'خدمات النساء والتوليد ومتابعة الحمل وصحة المرأة وتأخر الإنجاب والسونار.', body: servicesPage() },
  ...services.map(s => ({ url: '/services/' + s.id + '/', title: s.name, desc: s.desc, body: detail(s) })),
  { url: '/guides/', title: 'التوعية الصحية', desc: 'مقالات صحية مبسطة عن الحمل وصحة المرأة وتأخر الإنجاب.', body: guides() },
  ...articles.map(a => ({ url: '/guides/' + a.id + '/', title: a.title, desc: a.desc, body: article(a), article: a })),
  { url: '/faq/', title: 'الأسئلة الشائعة', desc: 'إجابات عن دوام العيادة وموقعها وخدماتها وطرق التواصل.', body: faqPage() },
  { url: '/contact/', title: 'التواصل والموقع', desc: 'رقم واتساب عيادة الدكتورة فايزة وعنوانها ومواعيد الدوام.', body: contact() }
];

function schemaFor(p) {
  const graph = [
    { '@type': 'MedicalClinic', '@id': site.url + '/#clinic', name: site.name,
      url: site.url, telephone: '+967785600066',
      address: { '@type': 'PostalAddress', addressCountry: 'YE', addressLocality: 'ذمار', streetAddress: site.address },
      medicalSpecialty: ['Obstetric', 'Gynecologic'],
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '08:00', closes: '13:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '16:00', closes: '20:00' }
      ]
    },
    { '@type': 'Person', '@id': site.url + '/#doctor', name: 'الدكتورة فايزة علي ناصر الوصابي', jobTitle: 'استشارية أمراض وجراحة النساء والتوليد والعقم', worksFor: { '@id': site.url + '/#clinic' } },
    { '@type': 'WebSite', '@id': site.url + '/#website', name: site.short, url: site.url, inLanguage: 'ar', publisher: { '@id': site.url + '/#clinic' } },
    { '@type': 'WebPage', '@id': site.url + p.url + '#webpage', url: site.url + p.url, name: p.title + ' | ' + site.short, isPartOf: { '@id': site.url + '/#website' }, about: { '@id': site.url + '/#clinic' }, inLanguage: 'ar' }
  ];
  if (p.url !== '/') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'الرئيسية', item: site.url }, { '@type': 'ListItem', position: 2, name: p.title, item: site.url + p.url }] });
  if (p.url === '/faq/') graph.push({ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  if (p.article) graph.push({ '@type': 'Article', headline: p.article.title, description: p.article.desc, image: site.url + '/assets/generated/' + p.article.image, publisher: { '@id': site.url + '/#clinic' }, mainEntityOfPage: site.url + p.url });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* First-visit signature reveal, using the unchanged official clinic logo. */
function logoIntro() {
 return '<div class="clinic-brand-intro" data-clinic-brand-intro aria-hidden="true">'+
 '<div class="clinic-brand-intro__mark">'+
 '<img class="clinic-brand-intro__layer clinic-brand-intro__layer--symbol" src="/assets/logo-horizontal-480.webp" width="480" height="143" alt="" decoding="async">'+
 '<img class="clinic-brand-intro__layer clinic-brand-intro__layer--name" src="/assets/logo-horizontal-480.webp" width="480" height="143" alt="" decoding="async">'+
 '<img class="clinic-brand-intro__layer clinic-brand-intro__layer--finished" src="/assets/logo-horizontal-480.webp" width="480" height="143" alt="" decoding="async">'+
 '<span class="clinic-brand-intro__line" aria-hidden="true"></span>'+
 '</div></div>';
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
  const introBootstrap = noindex ? '' : '<script>(()=>{try{if(localStorage.getItem("dr-fayza-intro-v1")==="seen")return;}catch(e){}if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;const net=navigator.connection||navigator.mozConnection||navigator.webkitConnection;if(net&&(net.saveData||["slow-2g","2g"].includes(net.effectiveType)))return;document.documentElement.classList.add("clinic-intro-pending");})();</script>';
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
    (p.url === '/' ? '<link rel="preload" as="image" href="/assets/generated/hero-mother-care-960.webp" imagesrcset="/assets/generated/hero-mother-care-480.webp 480w, /assets/generated/hero-mother-care-960.webp 960w, /assets/generated/hero-mother-care.webp 2560w" imagesizes="(max-width: 680px) 100vw, 1100px">' : '') +
    (noindex ? '' : '<link rel="preload" as="image" href="/assets/logo-horizontal-480.webp" fetchpriority="high">') +
    introBootstrap +
    '<link rel="stylesheet" href="/styles/agency.css">' +
    '<script type="application/ld+json">' + schemaFor(p) + '</script>' +
    '<script src="/scripts/site.js" defer></script></head><body>' +
    (noindex ? '' : logoIntro()) +
    (noindex ? '' : header(p.url)) +
    '<main id="main">' + p.body + '</main>' +
    (noindex ? '' : footer()) +
    '</body></html>';
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const p of pages) { const file = path.join(OUT, p.url === '/' ? 'index.html' : p.url.slice(1) + 'index.html'); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html(p), 'utf8'); }
const fullCss=fs.readFileSync(path.join(ROOT,'src','styles.css'),'utf8')+'\n'+fs.readFileSync(path.join(ROOT,'src','agency.css'),'utf8');
const optimizedCss=(await transform(fullCss,{loader:'css',minify:true,target:'es2020'})).code;
const optimizedJs=(await transform(fs.readFileSync(path.join(ROOT,'src','client.js'),'utf8'),{loader:'js',minify:true,target:'es2019'})).code;
fs.mkdirSync(path.join(OUT,'styles'),{recursive:true});
fs.mkdirSync(path.join(OUT,'scripts'),{recursive:true});
fs.writeFileSync(path.join(OUT,'styles','agency.css'),optimizedCss,'utf8');
fs.writeFileSync(path.join(OUT,'scripts','site.js'),optimizedJs,'utf8');
console.log('Asset bundling (CSS combined/minified, JS minified):',JSON.stringify({cssBeforeBytes:Buffer.byteLength(fullCss),cssAfterBytes:Buffer.byteLength(optimizedCss),jsAfterBytes:Buffer.byteLength(optimizedJs)}));
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
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
// Contact-only imagery stays local. The small hero variant avoids a large download on phones.
await convert(path.join(assetsOut,'clinic-contact-hero.webp'),path.join(assetsOut,'clinic-contact-hero-720.webp'),720,68);
const responsive=new Map();
const photosDir=path.join(assetsOut,'generated');
for(const filename of fs.readdirSync(photosDir).filter(n=>n.endsWith('.webp')&&!/-\d+\.webp$/.test(n))){
 const input=path.join(photosDir,filename);
 const info=await sharp(input).metadata();
 const formats=[];
 for(const width of [480,960]){
  if(info.width <= width)continue;
  const name=filename.replace(/\.webp$/,`-${width}.webp`);
  await convert(input,path.join(photosDir,name),width,70);
  formats.push({name,width});
 }
 formats.push({name:filename,width:info.width});
 responsive.set(filename,formats);
}
const htmlTargets=[...pages.map(p=>path.join(OUT,p.url==='/'?'index.html':p.url.slice(1)+'index.html')),path.join(OUT,'404.html')];
for(const target of htmlTargets){
 let document=fs.readFileSync(target,'utf8');
 document=document.replaceAll('src="/assets/logo-horizontal-primary.png"','src="/assets/logo-horizontal-480.webp"');
 document=document.replaceAll('src="/assets/symbol-primary.png"','src="/assets/symbol-128.webp"');
 document=document.replaceAll('rel="icon" href="/assets/symbol-primary.png"','rel="icon" type="image/png" href="/assets/favicon-64.png"');
 for(const [filename,formats] of responsive){
  const pattern='src="/assets/generated/'+filename+'"';
  const selected=formats.find(x=>x.width>=960)||formats[formats.length-1];
  const srcset=formats.map(x=>'/assets/generated/'+x.name+' '+x.width+'w').join(', ');
  document=document.replaceAll(pattern,'src="/assets/generated/'+selected.name+'" srcset="'+srcset+'" sizes="(max-width: 680px) 100vw, (max-width: 1100px) 75vw, 1100px"');
 }
 fs.writeFileSync(target,document,'utf8');
}
console.log('Optimized media:',JSON.stringify(imageBudget));

fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + site.url + '/sitemap.xml\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(p => '<url><loc>' + site.url + p.url + '</loc></url>').join('') + '</urlset>');
console.log('Built', pages.length, 'routes.');
