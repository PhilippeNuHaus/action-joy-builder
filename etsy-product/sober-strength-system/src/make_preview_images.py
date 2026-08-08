#!/usr/bin/env python3
"""Builds listing images composited from real renders of the program pages.

These are not mockups — every page shown is the actual rendered document, so the
listing cannot drift out of sync with what the buyer receives.
"""

import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "build", "listing-images")

PAGE_W, PAGE_H = 816, 1056
PAGES = 30
SIZE = 2000

INK = (18, 22, 28)
ACCENT = (194, 65, 12)
WHITE = (255, 255, 255)
GREY = (154, 162, 174)

FONT_DIR = "/usr/share/fonts/truetype/liberation"
BOLD = os.path.join(FONT_DIR, "LiberationSans-Bold.ttf")
REG = os.path.join(FONT_DIR, "LiberationSans-Regular.ttf")


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def render_all_pages():
    """Screenshot the whole program in one pass and slice it into page images."""
    tmp = tempfile.mkdtemp()
    shot = os.path.join(tmp, "full.png")
    subprocess.run(
        [CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
         f"--window-size={PAGE_W},{PAGE_H * PAGES}", f"--screenshot={shot}",
         f"file://{os.path.join(HERE, 'program.html')}"],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    full = Image.open(shot).convert("RGB")
    return [full.crop((0, i * PAGE_H, PAGE_W, (i + 1) * PAGE_H)) for i in range(PAGES)]


def flat_lay(pages):
    """6x5 grid of every page — the 'you get a lot' shot."""
    canvas = Image.new("RGB", (SIZE, SIZE), INK)
    d = ImageDraw.Draw(canvas)

    d.text((150, 132), "EVERY PAGE", font=font(BOLD, 96), fill=WHITE)
    d.rectangle([150, 262, 470, 272], fill=ACCENT)
    d.text((150, 306), "30 pages. 11 workouts. 12 weeks of logs.",
           font=font(REG, 44), fill=GREY)

    cols, rows, gap = 6, 5, 22
    y0 = 400
    # Size the tiles from the available *height* — driving off width overflows the canvas.
    th = (SIZE - y0 - 70 - gap * (rows - 1)) // rows
    tw = int(th * PAGE_W / PAGE_H)
    x0 = (SIZE - (tw * cols + gap * (cols - 1))) // 2

    for i, pg in enumerate(pages):
        r, c = divmod(i, cols)
        x = x0 + c * (tw + gap)
        y = y0 + r * (th + gap)
        canvas.paste(pg.resize((tw, th), Image.LANCZOS), (x, y))
        d.rectangle([x, y, x + tw - 1, y + th - 1], outline=(44, 51, 63), width=2)
    return canvas


def page_feature(page, eyebrow, title, caption):
    """One real page, large, on a dark card."""
    canvas = Image.new("RGB", (SIZE, SIZE), INK)
    d = ImageDraw.Draw(canvas)

    d.text((150, 128), eyebrow, font=font(BOLD, 38), fill=ACCENT)
    d.text((150, 196), title, font=font(BOLD, 82), fill=WHITE)

    th = 1180
    tw = int(th * PAGE_W / PAGE_H)
    x = (SIZE - tw) // 2
    y = 356
    d.rectangle([x - 10, y - 10, x + tw + 10, y + th + 10], fill=(44, 51, 63))
    canvas.paste(page.resize((tw, th), Image.LANCZOS), (x, y))

    d.text((150, y + th + 78), caption, font=font(REG, 42), fill=GREY)
    return canvas


def main():
    os.makedirs(OUT, exist_ok=True)
    pages = render_all_pages()

    jobs = [
        ("06-every-page", flat_lay(pages)),
        # Page 17 is Upper A; page 29 is the substitution index. Indices are 0-based.
        ("07-workout", page_feature(
            pages[16], "INSIDE THE PROGRAM", "Every session, written out",
            "Sets, reps, effort target and a coaching cue for every exercise.")),
        ("08-substitutions", page_feature(
            pages[28], "WORKS ANYWHERE", "Full gym or a spare room",
            "22 exercises, each with a machine, dumbbell and bodyweight-only option.")),
    ]
    for name, img in jobs:
        path = os.path.join(OUT, f"{name}.png")
        img.save(path)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
