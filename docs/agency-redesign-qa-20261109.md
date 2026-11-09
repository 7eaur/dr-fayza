# Agency Design Suite — QA report (branch-only)

**Branch:** `design/agency-suite-fayza-20261109`  
**Status:** implementation ready for visual inspection, not merged.  
**Baseline:** `main@7266fb5`.

## Implementation evidence
- Master skill router and all four reference files installed in `.agents/skills/agency-design-and-copy-suite/`.
- Created a separate editorial CSS layer: `website/src/agency.css`.
- Updated homepage, doctor profile, services listing, contact page, guide index, FAQ.
- Preserved 6 service detail pages, 4 guide article pages, diagnostics, 404, footer and SEO generation.
- Removed developer-facing notes about missing map links and internal asset readiness from visitor-facing UI.
- Kept official contact `785600066`, city and street, Saturday–Thursday hours and 24-hour childbirth reception scope.
- Production branch `main` not changed.

## Automated evidence (Vercel Preview for commit 28bb970)
```text
Built 17 routes.
Verified 17 static pages and 37 total output files.
Agency design checks passed: Arabic RTL, imagery, SEO, tokens and CSS.
Build Completed in /vercel/output [1s].
Deployment completed.
```

Static tests cover route count, page title, description, one H1, internal links/assets, HTML `lang=ar` / `dir=rtl`, imported CSS, OG image tag, image alt attribute, absence of retired phone, and design token / responsive-media presence.

## Color contract (calculated using sRGB/WCAG relative luminance)
- White text on action dark-teal `#12685D`: 6.64:1.
- White text on brand petroleum `#0C495C`: 9.89:1.
- Muted body text `#526B71` on white: 5.68:1.
- White on raw turquoise `#45A18E`: 3.11:1 **not** suitable for normal-sized body text; used as accent rather than default CTA background.

## NOT VERIFIED — manual and visual
- Actual browser screenshots at 360, 390, 768, 1280, 1440 CSS px.
- Keyboard, touch, focus order, VoiceOver/TalkBack, screen zoom and reduced-motion manual behavior.
- Real-world LCP, CLS, INP, image cropping across physical devices.
- External phone and WhatsApp service response.
- Exact preview rendering: Vercel preview protection is enabled; generic web fetch cannot access it. Review through authenticated project access.

## Next manual review matrix
| Page / view | Phone | Tablet | Desktop | Keyboard |
|---|---|---|---|---|
| Homepage hero + needs | Pending | Pending | Pending | Pending |
| Services & detail pages | Pending | Pending | Pending | Pending |
| Doctor profile | Pending | Pending | Pending | Pending |
| Contact & hours | Pending | Pending | Pending | Pending |
| Guides, article, FAQ, 404 | Pending | Pending | Pending | Pending |

## Release gate
Do **not** promote to production until visual and interaction QA is complete and explicitly approved.

## مراجعة الجودة الإضافية — 2026-11-09
- إصلاح عنوان الهيرو ليذكر مجالات التخصص مباشرة، وتقليل النص الظاهر على الصورة إلى «صورة توضيحية».
- جعل صور الزخرفة الداخلية `alt=""` مع `aria-hidden` بدلاً من تكرار وصف غير مفيد لقارئات الشاشة.
- مشاركة الصفحات الرسمية بالشعار المعتمد؛ المقالات بصورها التوضيحية المناسبة، مع تمييز `og:type=article` للمقالات.
- حذف نسبة تأليف المقالات إلى الطبيبة في البيانات المنظمة لأن مراجعتها/تأليفها غير موثق؛ إبقاء العيادة جهة نشر فقط.
- صفحة 404 أصبحت `noindex` بلا canonical غير موجود.
- تبسيط رسالة واتساب الافتراضية وعدم مطالبة الزائرة باسمها في النص المبدئي.
- تم تفعيل استثناء وصول عام لرابط معاينة الفرع المستقر على Vercel دون تعطيل حماية بقية المعاينات.
