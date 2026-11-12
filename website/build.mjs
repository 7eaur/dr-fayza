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

// Map search uses the known address only; it does not claim a verified business pin.
const mapsSearch = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(site.address);
const whatsappFor = (topic) => 'https://wa.me/967785600066?text=' +
  encodeURIComponent('مرحبًا، أود الاستفسار عن ' + topic + ' والوقت المناسب للزيارة.');

const services = [
  { id: 'pregnancy', name: 'متابعة الحمل', icon: 'baby', art: 'pregnancy', desc: 'متابعة مراحل الحمل وفهم الفحوصات والاستفسارات المناسبة لكل مرحلة.', intro: 'تختلف احتياجات الحمل من سيدة لأخرى. تبدأ المتابعة بمراجعة التاريخ الصحي وعمر الحمل ثم توضيح ما يلزم من تقييم ومتابعة.', benefits: ['مراجعة التاريخ الصحي وعوامل الخطورة', 'متابعة الحمل بحسب المرحلة والحالة', 'مناقشة الأعراض والاستفسارات', 'الاستعداد للولادة بخطوات واضحة'], who: 'للسيدات الحوامل أو من يخططن للحمل ويرغبن في استشارة متخصصة.', tip: 'أحضري تقاريرك السابقة وقائمة الأدوية إن وُجدت.' },
  { id: 'womens-health', name: 'صحة المرأة وأمراض النساء', icon: 'heart', art: 'womens', desc: 'استشارات لاضطرابات الدورة وصحة المرأة وتنظيم الأسرة ومناقشة الفحوصات المناسبة.', intro: 'يساعد وصف الأعراض ومدتها والتاريخ الصحي على بناء استشارة أوضح وتحديد الفحوصات المناسبة عند الحاجة.', benefits: ['مناقشة اضطرابات الدورة والأعراض غير المعتادة', 'مراجعة العوامل الهرمونية والتاريخ الصحي عند الحاجة', 'الاستشارة حول تنظيم الأسرة', 'توضيح متى قد تفيد الفحوصات أو الاستشارة الجراحية وفق التقييم'], who: 'لمن تحتاج إلى تقييم أو متابعة نسائية بحسب الأعراض والحالة.', tip: 'دوّني الأعراض ومدتها وأي فحوصات أو علاجات سابقة.' },
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

const icons = { menu: 'M4 6h16M4 12h16M4 18h16', close: 'M5 5l14 14M19 5 5 19', heart: 'M20.8 4.6a5.6 5.6 0 0 0-7.9 0L12 5.5l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.5a5.6 5.6 0 0 0 0-7.9Z', clock: 'M12 7v5l4 2', pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z', phone: 'M21 16v4a2 2 0 0 1-2 2C10 21 3 14 2 5a2 2 0 0 1 2-2h4l2 5-2 2a15 15 0 0 0 6 6l2-2Z', message: 'M21 12a9 9 0 0 1-9 9 9 9 0 0 1-4-.9L3 21l1.5-4.3A9 9 0 1 1 21 12Z', arrow: 'M19 12H5m6-6-6 6 6 6', check: 'm4 12 5 5L20 6', scan: 'M3 4h18v15H3Zm5 12c3-8 7-8 10 0', baby: 'M9 4a3 3 0 0 1 6 0M12 7c-6 0-9 4-9 8s4 7 9 7 9-3 9-7-3-8-9-8Z', flower: 'M12 12C7 11 4 6 6 2c4 0 6 4 6 10Zm0 0c5-1 8-6 6-10-4 0-6 4-6 6 10Zm0 0v10', sparkles: 'm12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z', shield: 'M12 2 21 6v6c0 5-3 8-9 10-6-2-9-5-9-10V6Zm-4 10 3 3 5-6', file: 'M5 2h9l5 5v15H5Z M14 2v6h5 M9 13h6m-6 4h6', info: 'M12 11v6m0-10h.01' };
const ico = (key) => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (icons[key] || icons.heart) + '"/>' + (key === 'clock' ? '<circle cx="12" cy="12" r="9"/>' : '') + (key === 'pin' ? '<circle cx="12" cy="10" r="2.5"/>' : '') + (key === 'info' ? '<circle cx="12" cy="12" r="9"/>' : '') + '</svg>';
const link = (href, label, type = 'solid', icon = 'arrow') => '<a class="button button--' + type + '" href="' + href + '"' + (href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + ico(icon) + '</a>';
const nav = [['/', 'الرئيسية'], ['/about/', 'عن الدكتورة'], ['/services/', 'الخدمات'], ['/diagnostics/', 'الفحوصات'], ['/guides/', 'التوعية الصحية'], ['/faq/', 'الأسئلة الشائعة'], ['/contact/', 'التواصل']];
const heading = (kicker, title, sub = '') => '<div class="heading"><span class="kicker">' + kicker + '</span><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>';
const card = (s) => '<a class="card" href="/services/' + s.id + '/"><span class="card-ic">' + ico(s.icon) + '</span><h3>' + s.name + '</h3><p>' + s.desc + '</p><span class="more">اعرفي التفاصيل ' + ico('arrow') + '</span></a>';
const faq = (items) => '<div class="faq-list">' + items.map(([q, a], i) => '<details ' + (i === 0 ? 'open' : '') + '><summary>' + q + ico('arrow') + '</summary><p>' + a + '</p></details>').join('') + '</div>';
const articleTile = (a) => '<article class="tile"><div class="tile-visual"><img src="/assets/generated/' + a.image + '" alt="صورة تحريرية عن ' + a.category + '" width="960" height="720" loading="lazy"></div><div class="tile-body"><small>' + a.category + '</small><h3>' + a.title + '</h3><p>' + a.desc + '</p><a href="/guides/' + a.id + '/">اقرئي المقال ' + ico('arrow') + '</a></div></article>';

function header(url) {
 return '<a class="skip" href="#main">تخطي إلى المحتوى</a><header class="header"><div class="container header-inner"><a class="logo" href="/" aria-label="الرئيسية"><img src="/assets/logo-horizontal-primary.png" alt="'+site.name+'" width="225" height="86"></a><nav class="nav" id="primary-nav" aria-label="القائمة الرئيسية">'+nav.map(([href,label])=>'<a href="'+href+'" '+(url===href?'aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav><div class="header-actions"><a class="header-wa" aria-label="تواصلي عبر واتساب" href="'+site.whatsapp+'" target="_blank" rel="noopener noreferrer">'+ico('message')+'<span>اسألي عبر واتساب</span></a><button class="menu-toggle" id="menu-button" aria-expanded="false" aria-controls="primary-nav" aria-label="فتح القائمة">'+ico('menu')+'</button></div></div></header>';
}
function footer() {
 const officialLinks = [
 ['/', 'الرئيسية'],['/about/','عن الدكتورة'],['/services/','الخدمات'],['/guides/','التوعية الصحية'],['/contact/','التواصل']
 ];
 const serviceLinks = [services[0],services[1],services[2],services[4]];
 return '<footer class="footer clinic-footer"><div class="container clinic-footer__grid">'+
 '<section class="clinic-footer__contact"><h2>تواصلي معنا</h2><a href="'+site.whatsapp+'" target="_blank" rel="noopener noreferrer">'+ico('message')+'<span>واتساب العيادة</span></a><a href="'+site.call+'">'+ico('phone')+'<span>'+site.phone+'</span></a><span class="clinic-footer__item">'+ico('pin')+'<span>'+site.address+'</span></span><a href="'+site.url+'" target="_blank" rel="noopener noreferrer">'+ico('globe')+'<span>'+site.url.replace(/^https:\/\//,'')+'</span></a></section>'+
 '<nav class="clinic-footer__links" aria-label="روابط سريعة"><h2>روابط سريعة</h2>'+officialLinks.map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join('')+'</nav>'+
 '<nav class="clinic-footer__links" aria-label="الخدمات الطبية"><h2>الخدمات الطبية</h2>'+serviceLinks.map(x=>'<a href="/services/'+x.id+'/">'+x.name+'</a>').join('')+'<a href="/diagnostics/">المختبر والفحوصات</a></nav>'+
 '<section class="clinic-footer__brand"><a href="/"><img src="/assets/logo-horizontal-primary.png" alt="'+site.name+'" width="225" height="86" loading="lazy"></a><h2 class="visually-hidden">'+site.short+'</h2><p>رعاية متخصصة لصحة المرأة ومتابعة الحمل وتأخر الإنجاب في ذمار.</p><p class="clinic-footer__hours">الدوام: السبت–الخميس<br>8 صباحًا–1 ظهرًا، 4 عصرًا–8 مساءً</p></section>'+
 '<div class="clinic-footer__meta"><p>جميع الحقوق محفوظة © <span id="year">2026</span> '+site.short+'</p><p><a href="/privacy/">سياسة الخصوصية</a> <span aria-hidden="true">·</span> تطوير <a href="https://www.wasl-tech.com" target="_blank" rel="noopener noreferrer">وصل تك</a></p></div></div></footer>';
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
function firstVisit() {
 const steps=[
 ['message','تواصلي معنا','اسألي عن وقت الزيارة والخدمة المناسبة.'],
 ['file','جهّزي معلوماتكِ','أحضري التقارير وأسماء الأدوية إن توفرت.'],
 ['heart','ابدئي الاستشارة','اشرحي الأعراض وأسئلتكِ لتحديد ما يلزم من تقييم.'],
 ['check','اعرفي خطوتكِ القادمة','استفسري عن المتابعة ومتى تحتاجين إلى مراجعة أخرى.']
 ];
 return '<section class="agency-first-visit clinic-process" aria-labelledby="agency-first-visit-title"><div class="container"><div class="clinic-process__heading"><span class="kicker">خطوات زيارتكِ</span><h2 id="agency-first-visit-title">كيف تبدأ رحلتكِ معنا؟</h2><p>من الاستفسار الأول حتى فهم خطة المتابعة، بخطوات بسيطة وواضحة.</p></div><ol class="clinic-process__timeline">'+steps.map(([icon,title,desc],i)=>'<li><span class="clinic-process__icon">'+ico(icon)+'</span><div><small>0'+(i+1)+'</small><h3>'+title+'</h3><p>'+desc+'</p></div></li>').join('')+'</ol></div></section>';
}
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
    "</div><a class=\"agency-services__diagnostics\" href=\"/diagnostics/\"><span class=\"agency-services__diagnostics-symbol\" aria-hidden=\"true\">",
    ico('scan'),
    "</span><span><strong>المختبر والفحوصات والسونار</strong><small>استفسري عن التحاليل والفحوصات والتصوير المتاح وفق حالتكِ قبل الزيارة.</small></span>",
    ico('arrow'),
    "</a></div></section>",
    "<section class=\"section agency-doctor\" aria-labelledby=\"agency-doctor-title\"><div class=\"container agency-doctor__grid\"><div class=\"agency-doctor__content\"><span class=\"kicker\">عن الدكتورة</span><h2 id=\"agency-doctor-title\">تعرفي على الطبيبة التي ستستمع إلى أسئلتكِ</h2><p>الدكتورة فايزة علي ناصر الوصابي، استشارية أمراض وجراحة النساء والتوليد والعقم. تجمع مجالات تأهيلها بين الرعاية النسائية، ومتابعة الحمل، وطب الإنجاب والإخصاب المساعد.</p><p>تبدأ الاستشارة بفهم التاريخ الصحي والشكوى، ثم مناقشة ما يلزم تقييمه والمتابعة المناسبة.</p>",
    link('/about/', 'المزيد عن الدكتورة', 'line', 'arrow'),
    "</div><aside class=\"agency-doctor__credentials\" aria-label=\"التخصص والمؤهلات\"><div class=\"agency-doctor__symbol\"><img src=\"/assets/symbol-primary.png\" width=\"140\" height=\"140\" alt=\"\" loading=\"lazy\"></div><span class=\"agency-doctor__label\">التخصص المهني</span><h3>أمراض وجراحة النساء والتوليد والعقم</h3><ul><li>دكتوراه زمالة عربية (الأردن)</li><li>دكتوراه زمالة يمنية</li><li>دبلوم تجميل نسائي</li><li>دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul></aside></div></section>",
    "<section class=\"agency-birth\" aria-labelledby=\"agency-birth-title\"><div class=\"container agency-birth__inner\"><span class=\"agency-birth__icon\">",
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
    "<section class=\"section agency-visit\" aria-labelledby=\"agency-visit-title\"><div class=\"container agency-visit__grid\"><div class=\"agency-visit__address\"><span class=\"kicker\">زيارة العيادة</span><h2 id=\"agency-visit-title\">ننتظركِ في ذمار</h2><p>ذمار، شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي.</p><div class=\"agency-visit__detail\"><span>",
    ico('clock'),
    "</span><div><strong>الدوام الاعتيادي</strong><p>السبت إلى الخميس، 8 ص–1 م و4 م–8 م.</p></div></div><div class=\"agency-visit__actions\">",
    link(site.call, 'اتصلي بالعيادة', 'solid', 'phone'),
    link(mapsSearch, 'ابحثي عن العنوان في الخرائط', 'line', 'pin'),
    "</div></div></div></section>"

  ].join('');
}
function about() {
  return [
    '<section class="agency-profile"><div class="container agency-profile__intro"><div class="breadcrumbs"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>عن الدكتورة</span></div><span class="kicker">التعريف بالدكتورة</span><h1>الدكتورة فايزة علي ناصر الوصابي</h1><p class="agency-profile__lead">استشارية أمراض وجراحة النساء والتوليد والعقم</p><p>مجال طبي يجمع بين متابعة رحلة الحمل، ورعاية صحة المرأة في مراحلها المختلفة، وفهم التحديات المتعلقة بالإنجاب. الهدف من هذه الصفحة أن تتعرفي على خلفية الطبيبة وطبيعة الرعاية التي تسعين إليها.</p></div></section>',
    '<section class="section"><div class="container agency-profile__grid"><article class="agency-profile__story"><span class="kicker">النهج المهني</span><h2>الاهتمام بالتفاصيل يصنع فرقًا في فهم الحالة</h2><p>لكل مراجعة تاريخ صحي وظروف مختلفة. تبدأ الاستشارة بفهم الشكوى وأهداف الزيارة، ثم ربط الأعراض والتقارير المتاحة بخيارات الفحص والمتابعة. وتبقى الأسئلة جزءًا طبيعيًا من الحوار الطبي، سواء كانت الزيارة لأول مرة أو ضمن متابعة مستمرة.</p><p>تشمل مجالات الاهتمام صحة المرأة والحمل والولادة وتأخر الإنجاب والاستشارات النسائية التجميلية، مع توجيه كل حالة إلى التقييم المناسب بدل افتراض أن الحل واحد للجميع.</p></article><aside class="agency-profile__credentials"><span class="kicker">التأهيل المهني</span><h2>المؤهلات</h2><ul class="check-list"><li>'+ico('check')+'دكتوراه زمالة عربية (الأردن)</li><li>'+ico('check')+'دكتوراه زمالة يمنية</li><li>'+ico('check')+'دبلوم تجميل نسائي</li><li>'+ico('check')+'دبلوم طب الإنجاب والإخصاب المساعد (IVF)</li></ul></aside></div></section>',
    '<section class="agency-mission" aria-labelledby="agency-mission-title"><div class="container"><div class="agency-section-head"><div><span class="kicker">ما نطمح إليه</span><h2 id="agency-mission-title">رؤيتنا ورسالتنا</h2><p>توجه تحريري للعيادة يضع احتياجات المرأة وفهمها للخيارات الطبية في المقدمة.</p></div></div><div class="agency-mission__grid"><article><span>01 / الرؤية</span><h3>رعاية نسائية أقرب إلى احتياجات كل امرأة</h3><p>أن تكون العيادة وجهة معروفة في ذمار للاستشارة النسائية المتخصصة، حيث تجد المرأة مساحة لطرح أسئلتها، وفهم خياراتها، ومتابعة صحتها بوعي في كل مرحلة من حياتها.</p></article><article><span>02 / الرسالة</span><h3>الجمع بين التخصص والوضوح والاحترام</h3><p>نسعى إلى تقديم رعاية واستشارات في أمراض النساء والولادة والخصوبة، تقوم على الإنصات والتقييم المناسب وتوضيح خطوات المتابعة، مع احترام الخصوصية والاختلافات الفردية بين المراجعات.</p></article></div></div></section>',
    editorialSection('القيم التي توجهنا','ما الذي يهمنا في تجربة المراجعة؟','ليست الزيارة مجرد قائمة فحوصات؛ بل تجربة تحتاج إلى تواصل وتفسير واهتمام.',[['الإنصات دون أحكام','نتعامل مع الأسئلة الحساسة والقلق والتردد باحترام، ونمنح الوصف الشخصي للأعراض قيمته.'],['قرارات مبنية على التقييم','نوضح ما قد يلزم من فحص أو متابعة بحسب الحالة، مع تجنب الوعود أو التعميم.'],['متابعة تفهمين هدفها','من حق المراجعة أن تعرف سبب الفحص، ومعنى النتيجة، ومتى يلزم الرجوع أو طلب المساعدة.']]),
    editorialSection('مراحل من حياة المرأة','احتياجات تتغير ورعاية تتطور','تختلف الأسئلة الصحية من سن إلى آخر، ولهذا لا تُختصر صحة المرأة في الحمل والولادة فقط.',[['الصحة النسائية اليومية','متابعة اضطرابات الدورة وآلام الحوض والأسئلة المتعلقة بالهرمونات وتنظيم الأسرة.'],['الحمل والأمومة','مراجعات الحمل والاستعداد للولادة، ومناقشة ما يتغير قبل الحمل وبعده.'],['الخصوبة والقرارات الشخصية','فهم أسباب تأخر الإنجاب أو مناقشة خيارات نسائية أخرى وفق الأهداف والحالة الصحية.']]),
    cta('هل ترغبين في معرفة الخدمة التي تناسب استفساركِ؟')
  ].join('');
}

function servicesPage() {
 return [
 '<section class="agency-page-intro"><div class="container"><div class="breadcrumbs"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>الخدمات</span></div><span class="kicker">مجالات الرعاية</span><h1>خدمات طبية ترافق المرأة في مراحل مختلفة</h1><p>من الأسئلة اليومية عن الدورة وصحة الحوض إلى متابعة الحمل والخصوبة، اختاري المجال الذي تبحثين عنه. تحتوي كل صفحة على شرح لما يمكن مناقشته وأسئلة تساعدك في التحضير.</p></div></section>',
 '<section class="section agency-services-page"><div class="container"><div class="cards agency-services__cards">'+services.map(card).join('')+'</div></div></section>',
 editorialSection('كيف تختارين الخدمة؟','ثلاثة أمور تساعدك على البدء','لا تحتاجين إلى معرفة اسم الفحص أو تشخيص الحالة قبل التواصل؛ ابدئي بوصف ما تحتاجينه.',[['حددي سبب الزيارة','هل لديك عرض جديد، أم متابعة سابقة، أم سؤال عن الحمل أو الإنجاب؟'],['جهزي ما لديك','التحاليل والتقارير والأدوية السابقة تساعد على تجنب تكرار التفاصيل.'],['اسألي عن الخطوة التالية','يمكنك الاستفسار عن توفر الخدمة والتحضير والتوقيت المناسب قبل الحضور.']]),
 '<section class="section alt"><div class="container">'+heading('خدمات مساندة','المختبر والسونار','الفحوصات تدعم القرار الطبي عندما تدعو الحاجة إليها؛ تابعي صفحة الفحوصات لمعرفة دورها وما الذي ينبغي سؤاله قبل إجرائها.')+link('/diagnostics/','تفاصيل الفحوصات والمختبر','line','arrow')+'</div></section>',
 cta('لستِ متأكدة من نوع الاستشارة؟')
 ].join('');
}

function detail(s) {
 const extra = careTopics[s.id];
 return pageHead('خدمات العيادة',s.name,s.desc,s.art,'compact')+
 '<section class="section"><div class="container detail"><article class="prose"><span class="kicker">عن هذا المجال</span><h2>ما الذي تعنيه هذه الخدمة؟</h2><p>'+extra.opening+'</p><p>'+s.intro+'</p><h2>موضوعات يمكن مناقشتها</h2><ul class="feature-list">'+s.benefits.map(x=>'<li>'+ico('check')+x+'</li>').join('')+'</ul><h2>لمن قد تناسب؟</h2><p>'+s.who+'</p></article><aside><div class="panel"><span class="kicker">استفسار مخصص</span><h2>اسألي عن '+s.name+'</h2><p>يمكنك التأكد من التفاصيل العملية وتوقيت المراجعة مع العيادة مباشرة.</p>'+link(whatsappFor(s.name),'تواصلي عبر واتساب','solid','message')+link(site.call,'اتصلي بالعيادة','line','phone')+'</div><div class="panel pale"><h3>معلومة قبل الزيارة</h3><p>'+s.tip+'</p></div></aside></div></section>'+
 editorialSection('داخل رحلة الرعاية','تفاصيل تهمكِ في '+s.name,'تختلف الخطة الطبية باختلاف التاريخ الصحي والفحص والنتائج، وهذه أبرز المحاور العامة التي تفيدك في فهم المجال.',extra.sections)+
 '<section class="section alt"><div class="container"><div class="heading"><span class="kicker">استعدي للاستشارة</span><h2>أسئلة مفيدة لطرحها</h2><p>احتفظي بالأسئلة التي تهمك وناقشيها أثناء الزيارة.</p></div><ul class="feature-list editorial-questions">'+extra.questions.map(q=>'<li>'+ico('check')+q+'</li>').join('')+'</ul></div></section>'+
 '<section class="section"><div class="container">'+heading('اقرئي أيضًا','مجالات أخرى قد تهمكِ')+'<div class="cards">'+services.filter(x=>x.id!==s.id).slice(0,2).map(card).join('')+'</div></div></section>';
}

function diagnostics() {
 return pageHead('الفحوصات المساندة','المختبر والسونار','الفحص المناسب يجيب عن سؤال طبي محدد؛ وتفسير النتيجة جزء من الاستشارة وليس مجرد رقم أو صورة.','diagnostics')+
 editorialSection('مختبر العيادة','ما الدور الذي تؤديه التحاليل؟','يوجد مختبر ضمن خدمات العيادة، ويمكن السؤال عن أنواع الفحوصات المتاحة وتعليمات التحضير وساعات استقبال العينات قبل الزيارة.',[['تحديد الحاجة إلى التحليل','قد تساعد بعض التحاليل على فهم أعراض نسائية أو متابعة جوانب من الحمل، لكن اختيارها يعتمد على تقييم الطبيبة.'],['التحضير وأخذ العينة','يختلف التحضير بحسب نوع الفحص؛ وقد يتطلب بعضها توقيتًا محددًا أو تعليمات مسبقة ينبغي التأكد منها.'],['فهم النتيجة','لا تكفي قراءة الرقم وحده؛ تُفسر النتائج بالرجوع إلى الأعراض والعمر والتاريخ الطبي والنتائج السابقة عند الحاجة.']])+
 editorialSection('التصوير بالموجات فوق الصوتية','السونار جزء من الصورة الطبية','قد يدعم السونار تقييم الحمل وأعضاء الحوض، لكن نوع الفحص وموعده يحددان وفق الهدف من إجرائه.',[['أثناء الحمل','يُستخدم التصوير للمساعدة في تقييم جوانب من الحمل بحسب مرحلته وما تتطلبه المتابعة.'],['في الحالات النسائية','قد يفيد تصوير الرحم والمبيضين ضمن تقييم بعض الأعراض، ويُناقش التقرير مع بقية المعلومات السريرية.'],['بعد الفحص','اسألي عن معنى النتيجة وموعد المراجعة، وما إذا كانت هناك حاجة إلى تقييم إضافي.']])+
 '<section class="section alt"><div class="container">'+heading('قبل إجراء الفحوصات','أشياء تستحق السؤال عنها','التأكد من التفاصيل مسبقًا يجعل زيارتك أكثر تنظيمًا.')+'<ul class="feature-list editorial-questions"><li>'+ico('check')+'هل الفحص متاح اليوم وما ساعات استقبال العينات؟</li><li>'+ico('check')+'هل توجد تعليمات صيام أو تحضير أو موعد محدد؟</li><li>'+ico('check')+'متى تُستلم النتيجة وكيف تناقشها الطبيبة؟</li></ul>'+link(site.whatsapp,'اسألي عن الفحوصات المتاحة','solid','message')+'</div></section>';
}

function guides() {
  return [
    "<section class=\"agency-page-intro\"><div class=\"container\"><div class=\"breadcrumbs\"><a href=\"/\">الرئيسية</a><span aria-hidden=\"true\">/</span><span>التوعية الصحية</span></div><span class=\"kicker\">التوعية الصحية</span><h1>معلومات مفهومة قبل زيارتكِ</h1><p>مقالات تثقيفية عامة عن الحمل وصحة المرأة وتأخر الإنجاب. خذي منها الأسئلة المفيدة لاستشارتكِ، وليس تشخيصًا لحالتكِ.</p></div></section><section class=\"section agency-article-index\"><div class=\"container\"><div class=\"note agency-article-index__notice\">إذا كنتِ تعانين من أعراض شديدة أو مفاجئة، اطلبي تقييمًا طبيًا عاجلًا ولا تنتظري الرد على الرسائل.</div><div class=\"tiles\">",
    articles.map(articleTile).join(''),
    "</div></div></section>",
    cta('لديكِ استفسار عن المتابعة؟')
  ].join('');
}
function article(a) { return pageHead(a.category, a.title, a.desc, 'motherhood', 'compact') + '<article class="section"><div class="container article-layout"><div class="article-main"><div class="article-cover"><img src="/assets/generated/' + a.image + '" alt="صورة تحريرية عامة عن ' + a.category + '" width="960" height="720" loading="eager"></div><div class="note">هذه معلومات تثقيفية عامة وليست تشخيصًا أو خطة علاج شخصية.</div>' + a.parts.map(([h, p]) => '<h2>' + h + '</h2><p>' + p + '</p>').join('') + '<p class="article-signoff">إذا كانت لديك حالة أو أعراض مقلقة، تواصلي مع الطبيبة لتحديد ما يلزم من تقييم ومتابعة.</p><a class="text-link" href="/guides/">عودة إلى التوعية الصحية ' + ico('arrow') + '</a></div><aside class="article-aside"><span class="kicker">هل لديك سؤال؟</span><h3>خذي المعلومة إلى استشارة مناسبة</h3><p>المقال يشرح الفكرة العامة، أما القرار الطبي فيعتمد على حالتك وتاريخك الصحي.</p>' + link(site.whatsapp, 'اسألي عبر واتساب', 'solid', 'message') + '</aside></div></article>'; }
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
    "</span><div><span class=\"kicker\">العنوان</span><h2>تفضلي بزيارتنا في ذمار</h2><p>ذمار، شارع صنعاء تعز، قبل جولة كمران، أمام بنك الكريمي.</p><small>يُفتح بحث بالعنوان في خرائط Google، وليس دبوساً مؤكداً. اتصلي بالعيادة لتأكيد جهة الوصول.</small></div>",
    link(mapsSearch, 'ابحثي عن العنوان في الخرائط', 'line', 'pin'),
    "</div></section><section class=\"agency-birth\"><div class=\"container agency-birth__inner\"><span class=\"agency-birth__icon\">",
    ico('clock'),
    "</span><div><span class=\"agency-birth__kicker\">استقبال حالات الولادة</span><h2>الاستقبال على مدار 24 ساعة</h2><p>تحت إشراف كادر طبي متخصص؛ يرجى الاتصال لتأكيد مكان الاستقبال. لا يعني ذلك توفر بقية خدمات العيادة طوال اليوم.</p></div>",
    link(site.call, 'اتصلي للتأكيد', 'white', 'phone'),
    "</div></section>"
  ].join('');
}
function privacyPage() {
  return '<section class="agency-page-intro"><div class="container"><div class="breadcrumbs"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span>الخصوصية</span></div><span class="kicker">معلومات شفافة</span><h1>الخصوصية واستخدام الموقع</h1><p>كيف يعمل هذا الموقع وما الذي يحدث عند استخدام وسائل التواصل الخارجية.</p></div></section>' +
    '<section class="section agency-privacy"><div class="container agency-privacy__content"><h2>تصفح الموقع</h2><p>الموقع يقدم معلومات عامة عن العيادة وخدماتها. لا يتضمن حالياً حسابات مستخدمين أو نماذج تطلب ملفات صحية أو معلومات مرضى.</p>' +
    '<h2>بيانات تقنية</h2><p>قد تعالج جهة الاستضافة بيانات تقنية لازمة لتقديم صفحات الموقع وحمايتها، مثل عنوان الإنترنت ومعلومات الطلب. تُحمّل الخطوط المعروضة عبر خدمات Google Fonts، وقد يتصل متصفحك بخوادمها.</p>' +
    '<h2>روابط الخدمات الخارجية</h2><p>عند اختيار واتساب أو الاتصال أو البحث عن العنوان في خرائط Google، تنتقلين إلى خدمة أخرى تخضع لشروطها وسياسة خصوصيتها. لا ترسلي معلومات صحية حساسة في رسائل عامة دون التأكد من قناة التواصل المناسبة مع العيادة.</p>' +
    '<h2>المقالات الطبية</h2><p>المقالات للتوعية العامة وليست بديلاً عن زيارة الطبيبة أو التشخيص أو العلاج الفردي.</p>' +
    '<h2>للاستفسارات</h2><p>لأي سؤال عن موقع العيادة أو وسيلة التواصل المناسبة، يمكنك الاتصال بالعيادة على الرقم <a href="' + site.call + '">' + site.phone + '</a>.</p>' +
    '<p class="agency-privacy__note">تُراجع هذه المعلومات عند إضافة أدوات قياس أو نماذج إلكترونية أو خدمات جديدة للموقع.</p></div></section>';
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
  { url: '/contact/', title: 'التواصل والموقع', desc: 'رقم واتساب عيادة الدكتورة فايزة وعنوانها ومواعيد الدوام.', body: contact() },
  { url: '/privacy/', title: 'الخصوصية', desc: 'معلومات عن خصوصية موقع عيادة الدكتورة فايزة وروابط التواصل الخارجية.', body: privacyPage() }
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
    (p.url === '/' ? '<link rel="preload" as="image" href="/assets/generated/hero-mother-care.webp">' : '') +
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
