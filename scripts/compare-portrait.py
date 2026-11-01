"""Compare the rendered liquid portrait against the source image.

Run after `node scripts/capture-canvas.mjs`:

    python compare-portrait.py

Reports mean absolute error and the fraction of subject pixels that actually
carry ink, which is the number that matters for "does the rest state still read
as the photo".
"""

from __future__ import annotations

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANVAS = os.path.join(ROOT, "screenshots", "canvas-only.png")
SOURCE = os.path.join(ROOT, "public", "images", "adinda-hero.webp")

canvas = Image.open(CANVAS).convert("RGBA")
W, H = canvas.size

flat = Image.new("RGB", (W, H), (255, 255, 255))
flat.paste(canvas, (0, 0), canvas)
drawn = flat.load()

src = Image.open(SOURCE).convert("RGBA")
ratio = src.width / src.height
w, h = W, H
if ratio > W / H:
    h = int(W / ratio)
else:
    w = int(H * ratio)
src_small = src.resize((w, h), Image.LANCZOS)

ref = Image.new("RGB", (W, H), (255, 255, 255))
ref.paste(src_small, ((W - w) // 2, H - h), src_small)
reference = ref.load()

total = W * H
diff_sum = 0
subject = 0
subject_inked = 0
alpha_inked = 0

for y in range(H):
    for x in range(W):
        ar, ag, ab = drawn[x, y]
        rr, rg, rb = reference[x, y]
        diff_sum += ((ar - rr) ** 2 + (ag - rg) ** 2 + (ab - rb) ** 2) ** 0.5

        ref_is_bg = rr > 246 and rg > 246 and rb > 246
        if not ref_is_bg:
            subject += 1
            if abs(ar - 255) + abs(ag - 255) + abs(ab - 255) > 24:
                subject_inked += 1
        if canvas.getpixel((x, y))[3] > 16:
            alpha_inked += 1

mae = diff_sum / total
print(f"canvas              : {W}x{H}")
print(f"mean absolute error : {mae:.2f} / 255")
print(f"fidelity            : {100 - mae / 4.41:.1f}%")
print(f"subject pixels      : {subject}")
print(f"subject inked       : {subject_inked} ({100 * subject_inked / max(1, subject):.1f}%)")
print(f"non-transparent px  : {alpha_inked} ({100 * alpha_inked / total:.1f}%)")
