"""Generate PWA icon set for MSN Bundle Tracking. Run once: python scripts/gen-icons.py"""
from PIL import Image, ImageDraw
import math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)

AMBER = (245, 158, 11, 255)      # #f59e0b theme color
AMBER_DARK = (217, 119, 6, 255)  # shading
NAVY = (11, 15, 26, 255)         # #0b0f1a background color
WHITE = (255, 255, 255, 255)


def rounded_rect(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def draw_box_glyph(draw, cx, cy, size, fg, fg_dark):
    """Simple isometric parcel/box glyph centered at (cx, cy)."""
    h = size * 0.55  # half-width of top face
    top = [
        (cx, cy - h),
        (cx + h, cy - h * 0.55),
        (cx, cy - h * 0.1),
        (cx - h, cy - h * 0.55),
    ]
    left = [
        (cx - h, cy - h * 0.55),
        (cx, cy - h * 0.1),
        (cx, cy + h * 0.9),
        (cx - h, cy + h * 0.35),
    ]
    right = [
        (cx + h, cy - h * 0.55),
        (cx, cy - h * 0.1),
        (cx, cy + h * 0.9),
        (cx + h, cy + h * 0.35),
    ]
    draw.polygon(top, fill=fg)
    draw.polygon(left, fill=fg_dark)
    draw.polygon(right, fill=(int(fg_dark[0]*0.85), int(fg_dark[1]*0.85), int(fg_dark[2]*0.85), 255))

    # tape line down the middle of the top face
    draw.line([(cx, cy - h), (cx, cy - h * 0.1)], fill=fg_dark, width=max(2, int(size * 0.03)))
    # tape line down the front seam
    draw.line([(cx, cy - h * 0.1), (cx, cy + h * 0.9)], fill=(NAVY[0], NAVY[1], NAVY[2], 60), width=max(2, int(size * 0.02)))


def make_icon(px, path, maskable=False, bg=AMBER, pad_ratio=None):
    img = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if maskable:
        # Maskable icons need full-bleed background with safe-zone content (~80%)
        draw.rectangle([0, 0, px, px], fill=bg)
        glyph_size = px * 0.36
    else:
        radius = px * 0.22
        pad = 0 if pad_ratio is None else int(px * pad_ratio)
        rounded_rect(draw, [pad, pad, px - pad, px - pad], radius, bg)
        glyph_size = px * 0.34

    draw_box_glyph(draw, px / 2, px / 2 + px * 0.03, glyph_size, WHITE, (235, 235, 235, 255))
    img.save(path)


def make_apple_touch_icon(px, path):
    # Apple touch icons should be fully opaque (no transparency), rounded corners applied by iOS itself
    img = Image.new("RGBA", (px, px), AMBER)
    draw = ImageDraw.Draw(img)
    draw_box_glyph(draw, px / 2, px / 2 + px * 0.03, px * 0.36, WHITE, (235, 235, 235, 255))
    img.convert("RGB").save(path)


make_icon(192, os.path.join(OUT, "icon-192.png"))
make_icon(512, os.path.join(OUT, "icon-512.png"))
make_icon(192, os.path.join(OUT, "icon-192-maskable.png"), maskable=True)
make_icon(512, os.path.join(OUT, "icon-512-maskable.png"), maskable=True)
make_apple_touch_icon(180, os.path.join(OUT, "apple-touch-icon.png"))
make_icon(32, os.path.join(OUT, "favicon-32.png"))
make_icon(16, os.path.join(OUT, "favicon-16.png"))

# .ico with multiple sizes for classic favicon support
sizes = [16, 32, 48]
favicon_img = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
draw = ImageDraw.Draw(favicon_img)
rounded_rect(draw, [0, 0, 48, 48], 48 * 0.22, AMBER)
draw_box_glyph(draw, 24, 24 + 48 * 0.03, 48 * 0.26, WHITE, (235, 235, 235, 255))
favicon_img.save(os.path.join(OUT, "..", "favicon.ico"), sizes=[(s, s) for s in sizes])

print("Icons generated in", os.path.abspath(OUT))
