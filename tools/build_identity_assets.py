#!/usr/bin/env python3
"""Build brand identity use-assets from the checked-in original PNGs.

The original PNGs/AI/PDF under brand/source/original/ are never overwritten.
Generated assets are raster derivatives. Logo geometry is not redrawn.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "brand/source/original"
BRAND = ROOT / "brand"

VARIANTS = {
    "02": ("primary-color", "primary/logo-primary-vertical-color.png"),
    "03": ("alt-teal-light", "alternate/logo-alternate-teal-light.png"),
    "04": ("alt-light-teal", "alternate/logo-alternate-light-teal.png"),
    "05": ("mono-black", "monochrome/logo-monochrome-black.png"),
}

def save(im, relative):
    dest = BRAND / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest)
    print("saved", dest.relative_to(ROOT))
    return dest

def trim(im, pad=14):
    im = im.convert("RGBA")
    bounds = im.getchannel("A").getbbox()
    if not bounds:
        return im
    left, top, right, bottom = bounds
    return im.crop((max(0, left-pad), max(0, top-pad),
                    min(im.width, right+pad), min(im.height, bottom+pad)))

def source(number):
    name = f"هوية كاملة-{number}.png"
    path = SRC / name
    if not path.exists():
        raise SystemExit(f"Missing original {path}")
    return Image.open(path).convert("RGBA")

def phase_logos():
    for number, (slug, rel) in VARIANTS.items():
        im = source(number)
        save(trim(im), f"logos/{rel}")
        # Source PNG has a clean empty interval between emblem and Arabic logotype.
        save(trim(im.crop((0, 2140, im.width, im.height))),
             f"logos/alternate/wordmark-{slug}.png")

    # Horizontal lockups are a NEW composition of unchanged original symbol and wordmark.
    for number, suffix in [("02","primary"), ("04","dark-background")]:
        im = source(number)
        emblem = trim(im.crop((0, 0, im.width, 2140)), pad=0)
        wordmark = trim(im.crop((0, 2140, im.width, im.height)), pad=0)
        canvas = Image.new("RGBA", (1720, 480), (0, 0, 0, 0))
        em = ImageOps.contain(emblem, (430, 430), Image.Resampling.LANCZOS)
        wr = ImageOps.contain(wordmark, (1150, 310), Image.Resampling.LANCZOS)
        canvas.alpha_composite(em, (36+(430-em.width)//2, (480-em.height)//2))
        canvas.alpha_composite(wr, (520+(1150-wr.width)//2, (480-wr.height)//2))
        save(trim(canvas, 16), f"logos/secondary/logo-horizontal-{suffix}.png")

def phase_symbol():
    for number, (slug, _) in VARIANTS.items():
        im = source(number)
        symbol = trim(im.crop((0, 0, im.width, 2140)))
        save(symbol, f"symbols/symbol-{slug}.png")

def phase_icons():
    primary = Image.open(BRAND/"symbols/symbol-primary-color.png").convert("RGBA")
    reverse = Image.open(BRAND/"symbols/symbol-alt-light-teal.png").convert("RGBA")

    square = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    sym = ImageOps.contain(primary, (830, 830), Image.Resampling.LANCZOS)
    square.alpha_composite(sym, ((1024-sym.width)//2, (1024-sym.height)//2))
    save(square, "icons/icon-symbol-transparent-1024.png")

    # Reversed variant is used on dark teal to avoid dark-on-dark invisibility.
    card = Image.new("RGBA", (1024, 1024), (0, 71, 91, 255))
    r = ImageOps.contain(reverse, (800, 800), Image.Resampling.LANCZOS)
    card.alpha_composite(r, ((1024-r.width)//2, (1024-r.height)//2))
    save(card, "icons/icon-app-square-1024.png")

    for size in (512, 192, 48, 32):
        save(card.resize((size, size), Image.Resampling.LANCZOS),
             f"icons/favicon-{size}.png")

def phase_pattern():
    board = Image.open(SRC/"هوية كاملة-01.jpg").convert("RGB")
    # Exact area in the original board containing its geometric outline.
    # The top-left motif is intentionally cropped by the original board edge.
    from PIL import ImageFilter
    tile = board.crop((0, 0, 940, 1480)).convert("RGBA")
    data = []
    for r, g, b, a in tile.getdata():
        # The original graphic sits on a uniform #00475B teal background.
        # Remove it, keeping the mint outline; image is JPEG so allow noise.
        strength = max(0, min(255, int((g-88)*3.2)))
        if r < 17 and g < 95:
            strength = 0
        if strength < 15:
            strength = 0
        data.append((r, g, b, strength))
    tile.putdata(data)
    save(trim(tile, 0), "patterns/geometric-motif-outline.png")

    # Composable background tile from cropped motif, suitable for 2D use.
    canvas = Image.new("RGBA", (1600, 1600), (0, 0, 0, 0))
    sub = ImageOps.contain(tile, (780, 1200), Image.Resampling.LANCZOS)
    canvas.alpha_composite(sub, (0, 0))
    s2 = sub.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    canvas.alpha_composite(s2, (820, 400))
    save(canvas, "patterns/geometric-background-transparent-1600.png")

def phase_docs():
    colors = {
        "primary-dark-teal": "#00475B",
        "secondary-mint": "#50B291",
        "pale-mint": "#E9F4F1",
        "monochrome-black": "#000000",
    }
    dest = BRAND/"colors"
    dest.mkdir(parents=True, exist_ok=True)
    (dest/"colors.json").write_text(json.dumps(colors, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    (dest/"tokens.css").write_text(":root {\n"+ "".join(
        f"  --dr-fayza-{k}: {v};\n" for k, v in colors.items()
    )+"}\n", encoding="utf-8")
    (dest/"colors.md").write_text(
        "# الألوان الرسمية من ملفات الهوية الأصلية\n\n"
        "| الاسم | HEX | الاستخدام |\n|---|---|---|\n"
        "| بترولي | `#00475B` | أساسي للشعار والعناصر |\n"
        "| أخضر نعناعي | `#50B291` | تفاصيل الشعار والعناوين |\n"
        "| أخضر فاتح | `#E9F4F1` | الخلفيات ونسخ الشعار المعكوسة |\n"
        "| أسود | `#000000` | نسخة أحادية |\n\n"
        "هذه الأكواد عُيّنت من ملفات الشعار PNG الأصلية؛ أما لوحة ألوان تطوير الموقع "
        "السابقة فتُعامل كاقتراح تطبيقي منفصل ولا تُبدِّل أكواد الشعار.\n",
        encoding="utf-8",
    )
    fonts = BRAND/"typography"
    fonts.mkdir(parents=True, exist_ok=True)
    (fonts/"fonts-used.md").write_text(
        "# الخطوط المستخدمة في الهوية الأصلية\n\n"
        "المصدر: `brand/source/original/هوية كاملة Report.txt`.\n\n"
        "| الاستخدام | العائلة | ملف الخط الموجود في جذر المستودع |\n"
        "|---|---|---|\n"
        "| العناوين | Noor Bold | [AGCBold.ttf](../../AGCBold.ttf) |\n"
        "| النصوص العربية | Noor Regular | [AGCRegular.ttf](../../AGCRegular.ttf) |\n"
        "| النصوص الإنجليزية المساندة | Myriad Pro Regular | [MyriadPro-Regular.otf](../../MyriadPro-Regular.otf) |\n"
        "| بديل لاتيني مرفق | Swis721 BT Roman | [tt0003m.ttf](../../tt0003m.ttf) |\n\n"
        "أسماء الخطوط من تقرير Illustrator؛ يجب التحقق من أسماء العائلات المضمّنة "
        "في ملفات TTF/OTF وتراخيص إعادة توزيعها قبل استخدامها في موقع عام.\n"
        "لا حاجة لتكرار رفع ملفات الخطوط؛ فهي موجودة بالفعل في جذر المستودع.\n",
        encoding="utf-8",
    )
    documentation = BRAND/"docs"
    documentation.mkdir(parents=True, exist_ok=True)
    (documentation/"IDENTITY_ASSETS_README.md").write_text(
        "# حزمة تثبيت هوية عيادة الدكتورة فايزة\n\n"
        "- `brand/source/original/`: ملفات AI/PDF/JPG/PNG المرجعية الأصلية، **لا تُعدّل**.\n"
        "- `brand/logos/primary/`: الشعار العمودي الأساسي.\n"
        "- `brand/logos/alternate/`: نسخ بديلة وWordmark عربية مقصوصة من المصدر.\n"
        "- `brand/logos/secondary/`: تكوين أفقي جديد من عناصر الشعار الأصلية.\n"
        "- `brand/logos/monochrome/`: النسخة السوداء الأحادية.\n"
        "- `brand/symbols/`: شعار الأم والطفل وحده، بخلفية PNG شفافة.\n"
        "- `brand/icons/`: أيقونات مربعة وfavicon بأحجام مختلفة.\n"
        "- `brand/patterns/`: النمط الهندسي قصاصات من لوحة المصدر.\n"
        "- `brand/colors/`: ألوان الشعار الرسمية + CSS/JSON.\n"
        "- `brand/typography/`: أسماء وأدوار الخطوط وروابط ملفاتها الموجودة أصلًا.\n\n"
        "## الدقة والمصدر\n"
        "قصاصات PNG مشتقة دون تغيير في الرسم الأصلي، والتكوينات الأفقية تصميم تركيبي "
        "من الرمز والكتابة الأصليين؛ النمط الهندسي فصلٌ بصري من لوحة JPG وليس "
        "إخراجًا متجهيًا دقيقًا من Illustrator. للأعمال الطباعية الاحترافية ارجع "
        "إلى `هوية كاملة.ai` والـ PDF الأصلي.\n"
        "## الألوان والخطوط\n"
        "تظل الألوان الرسمية للشعار #00475B و#50B291 و#E9F4F1. "
        "Noor Bold للعناوين وNoor Regular للنص العربي؛ تحقق من تراخيص نشر ملفات الخطوط.\n",
        encoding="utf-8",
    )
    files = sorted(
        p for p in BRAND.rglob("*") if p.is_file()
        and ("source/original" not in str(p))
        and not p.name.startswith(".")
    )
    contents = "# جرد الأصول الجاهزة\n\n| المسار | الحجم بالبايت | SHA-256 |\n|---|---:|---|\n"
    for p in files:
        if p.name == "INVENTORY.md" and p.parent == documentation:
            continue
        digest = hashlib.sha256(p.read_bytes()).hexdigest()
        contents += f"| `{p.relative_to(ROOT)}` | {p.stat().st_size} | `{digest}` |\n"
    (documentation/"INVENTORY.md").write_text(contents, encoding="utf-8")

PHASES = {
    "logos": phase_logos,
    "symbols": phase_symbol,
    "icons": phase_icons,
    "patterns": phase_pattern,
    "docs": phase_docs,
}
if __name__ == "__main__":
    phase = sys.argv[1] if len(sys.argv) > 1 else "all"
    if phase == "all":
        for func in PHASES.values():
            func()
    else:
        PHASES[phase]()
