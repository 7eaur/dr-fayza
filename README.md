<div align="center">

<img src="website/assets/logo-horizontal-primary.png" alt="عيادة الدكتورة فايزة الوصابي" width="250" />

# عيادة الدكتورة فايزة | Dr. Fayza Clinic

**موقع عيادة الدكتورة فايزة علي ناصر الوصابي في ذمار، للتعريف بخدمات النساء والتوليد والعقم، والتواصل والوصول إلى العيادة.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**[🌐 زيارة الموقع](https://dr-fayza.vercel.app/)**

</div>

---

## 📱 Screenshots | صور المشروع

<div align="center">
<img src="docs/screenshots/desktop.webp" alt="الموقع على الكمبيوتر" width="850" />
<br /><br />
<img src="docs/screenshots/mobile.webp" alt="الموقع على الهاتف" width="300" />
</div>

---

## ✨ Key Features | المميزات الرئيسية

- **التعريف بالدكتورة:** التخصص والمؤهلات ونهج رعاية صحة المرأة.
- **الخدمات الطبية:** ست صفحات تفصيلية للحمل وصحة المرأة والخصوبة والسونار والولادة والاستشارات التجميلية.
- **التوعية الصحية:** سبعة مقالات وإجابات للأسئلة الشائعة والتحضير للزيارة.
- **التواصل والوصول:** اتصال وواتساب وعنوان العيادة ومخطط الوصول وساعات العمل.
- **تجربة عربية:** تصميم RTL متجاوب، قائمة للهاتف وزر للعودة للأعلى.
- **تحميل خفيف:** صفحات ثابتة وصور متجاوبة وتحميل مؤجل وخطوط وأيقونات محلية.
- **البحث والمشاركة:** بيانات الصفحات والعيادة والخدمات، وخريطة الموقع وصور مشاركة الروابط.

---

## 🛠️ Tech Stack | التقنيات

| الجانب | التقنيات |
|---|---|
| **Frontend** | HTML، CSS، JavaScript |
| **Build** | Node.js، esbuild، Sharp، PurgeCSS |
| **Quality** | Playwright، Axe، Chromium، WebKit |
| **Deployment** | Vercel، GitHub Actions |

---

## 📂 Project Structure | هيكل المشروع

- `website/`: قوالب الصفحات ومحتواها والتنسيق والتفاعل والأصول.
- `docs/`: معلومات العيادة ودليل التطوير وصور الموقع.
- `brand/`: الشعار والهوية وملفاتها الأصلية.
- `tools/`: توليد أصول الهوية.
- `campaigns/` و`content/`: مواد الحملة والمحتوى الاجتماعي.

---

## 🚀 Getting Started | التشغيل المحلي

**المتطلبات:** Node.js 22 أو أحدث وnpm.

```bash
git clone https://github.com/7eaur/dr-fayza.git
cd dr-fayza
npm ci --prefix website
npm run build --prefix website
cd website
node scripts/audit-server.mjs
```

افتح `http://127.0.0.1:8000` في المتصفح. تفاصيل البنية والتحقق في [دليل التطوير](docs/DEVELOPMENT.md).

---

## 👨‍💻 Developer | المطور

**Eng. Elyas Al Shaebi — المهندس إلياس الشعيبي**

📱 **Phone / WhatsApp:** [+967 775 377 979](https://wa.me/967775377979)

[GitHub](https://github.com/7eaur)
