#!/usr/bin/env python3
"""Generates Etsy listing images at 2000x2000 from HTML, using the local Chromium.

Slides are authored at 1000x1000 and painted at 2x with a CSS transform into a
2000x2000 viewport. Text stays vector-sharp because the scale happens at paint time.
"""

import os
import shutil
import subprocess
import tempfile

CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "build", "listing-images")

SIZE = 2000
# Headless Chromium reserves a strip of the requested window height and pads the
# screenshot with white. Render taller than needed, then crop back to exact size.
VIEWPORT_SLACK = 200

BASE = """
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:2000px;height:2000px;overflow:hidden;background:#fff}
  body{font-family:"Bitstream Charter","Liberation Serif",Georgia,serif;
       -webkit-print-color-adjust:exact}
  /* Authored at 1000px, painted 2x. transform is used rather than zoom or
     --force-device-scale-factor: both under-fill the viewport in this Chromium. */
  .s{width:1000px;height:1000px;padding:78px;display:flex;flex-direction:column;
     position:relative;transform:scale(2);transform-origin:0 0}
  .sans{font-family:"Liberation Sans","DejaVu Sans",Arial,sans-serif}
  .eyebrow{font-family:"Liberation Sans",Arial,sans-serif;font-size:19px;font-weight:bold;
           letter-spacing:.2em;text-transform:uppercase}
  .bar{height:8px;width:190px;background:#C2410C;margin:26px 0 30px}
  h1{font-family:"Liberation Sans",Arial,sans-serif;font-weight:bold;text-transform:uppercase;
     letter-spacing:-.02em;line-height:.94}
  h2{font-family:"Liberation Sans",Arial,sans-serif;font-weight:bold;text-transform:uppercase;
     letter-spacing:-.01em;line-height:1.02;font-size:64px;color:#12161C}
  p{line-height:1.45}
</style></head><body>%s</body></html>
"""

SLIDES = {
    # 1 — main image. Must survive being 200px wide on a phone.
    "01-main": """
<div class="s" style="background:#12161C;color:#fff;justify-content:center">
  <div class="eyebrow" style="color:#8A929E">12-Week Strength Program</div>
  <div class="bar"></div>
  <h1 style="font-size:112px;color:#fff">The<br>Sober<br><span style="color:#C2410C">Strength</span><br>System</h1>
  <p style="font-size:31px;color:#C9CDD6;margin-top:34px;max-width:770px">
    Built for the first 90 days alcohol&#8209;free — periodized to the recovery
    your body is actually doing.</p>
  <div style="margin-top:auto;display:flex;gap:14px">
    <div style="flex:1;background:#1C222B;padding:20px 18px">
      <div class="sans" style="font-size:15px;letter-spacing:.14em;color:#C2410C">PHASE 01</div>
      <div class="sans" style="font-size:23px;font-weight:bold;color:#fff;margin-top:6px">The Anchor</div></div>
    <div style="flex:1;background:#1C222B;padding:20px 18px">
      <div class="sans" style="font-size:15px;letter-spacing:.14em;color:#C2410C">PHASE 02</div>
      <div class="sans" style="font-size:23px;font-weight:bold;color:#fff;margin-top:6px">The Build</div></div>
    <div style="flex:1;background:#1C222B;padding:20px 18px">
      <div class="sans" style="font-size:15px;letter-spacing:.14em;color:#C2410C">PHASE 03</div>
      <div class="sans" style="font-size:23px;font-weight:bold;color:#fff;margin-top:6px">The Claim</div></div>
  </div>
</div>""",

    # 2 — the argument for the product's existence.
    "02-why": """
<div class="s" style="background:#fff">
  <div class="eyebrow" style="color:#C2410C">Why most programs fail here</div>
  <div class="bar"></div>
  <h2 style="font-size:60px">Your recovery<br>isn't flat.<br>Neither is this.</h2>
  <svg viewBox="0 0 760 250" width="100%" style="margin-top:34px">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B91C1C"/><stop offset="45%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#15803D"/></linearGradient></defs>
    <rect x="40" y="10" width="240" height="190" fill="#B91C1C" opacity=".06"/>
    <rect x="280" y="10" width="240" height="190" fill="#B45309" opacity=".06"/>
    <rect x="520" y="10" width="240" height="190" fill="#15803D" opacity=".06"/>
    <line x1="40" y1="200" x2="760" y2="200" stroke="#12161C" stroke-width="2"/>
    <path d="M40,172 C110,190 160,188 220,168 C290,144 320,132 380,104
             C450,72 500,58 560,48 C640,34 700,28 758,25"
          fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round"/>
    <text x="160" y="226" font-family="Liberation Sans" font-size="17" font-weight="bold"
          fill="#B91C1C" text-anchor="middle">DAYS 1–28</text>
    <text x="400" y="226" font-family="Liberation Sans" font-size="17" font-weight="bold"
          fill="#B45309" text-anchor="middle">DAYS 29–56</text>
    <text x="640" y="226" font-family="Liberation Sans" font-size="17" font-weight="bold"
          fill="#15803D" text-anchor="middle">DAYS 57–90</text>
  </svg>
  <p style="font-size:27px;color:#3D4552;margin-top:auto">
    Volume stays low while your sleep is still broken, then climbs as your recovery
    comes back. That is the whole idea.</p>
</div>""",

    # 3 — the mechanic buyers can picture themselves using.
    "03-system": """
<div class="s" style="background:#fff">
  <div class="eyebrow" style="color:#C2410C">Sixty seconds every morning</div>
  <div class="bar"></div>
  <h2 style="font-size:58px">The check-in<br>picks your session</h2>
  <div style="display:flex;gap:16px;margin-top:40px">
    <div style="flex:1;background:#F4F4F5;border-top:9px solid #15803D;padding:26px 22px">
      <div class="sans" style="font-size:29px;font-weight:bold;color:#15803D;letter-spacing:.06em">GREEN</div>
      <p style="font-size:21px;color:#3D4552;margin-top:14px">Slept fine, craving quiet.
         Run the session exactly as written.</p></div>
    <div style="flex:1;background:#F4F4F5;border-top:9px solid #B45309;padding:26px 22px">
      <div class="sans" style="font-size:29px;font-weight:bold;color:#B45309;letter-spacing:.06em">AMBER</div>
      <p style="font-size:21px;color:#3D4552;margin-top:14px">Broken sleep or a noticeable
         craving. Drop the last set, cap the effort.</p></div>
    <div style="flex:1;background:#F4F4F5;border-top:9px solid #B91C1C;padding:26px 22px">
      <div class="sans" style="font-size:29px;font-weight:bold;color:#B91C1C;letter-spacing:.06em">RED</div>
      <p style="font-size:21px;color:#3D4552;margin-top:14px">Barely slept, craving loud.
         A 20-minute session that still counts as a win.</p></div>
  </div>
  <p style="font-size:26px;color:#12161C;margin-top:auto;border-left:6px solid #C2410C;padding-left:24px">
    So you never have to negotiate with yourself at six in the evening.</p>
</div>""",

    # 4 — the value stack.
    "04-included": """
<div class="s" style="background:#12161C;color:#fff">
  <div class="eyebrow" style="color:#8A929E">Instant download</div>
  <div class="bar"></div>
  <h1 style="font-size:74px;color:#fff">What you get</h1>
  <div style="margin-top:44px">
    <div style="display:flex;gap:24px;padding:22px 0;border-bottom:1px solid #2C333F">
      <div class="sans" style="font-size:40px;font-weight:bold;color:#C2410C;width:118px">30<span style="font-size:20px">pg</span></div>
      <div><div class="sans" style="font-size:26px;font-weight:bold">The program PDF</div>
      <p style="font-size:21px;color:#9AA2AE;margin-top:6px">11 full workouts, 12 weeks of logs,
         print-ready</p></div></div>
    <div style="display:flex;gap:24px;padding:22px 0;border-bottom:1px solid #2C333F">
      <div class="sans" style="font-size:40px;font-weight:bold;color:#C2410C;width:118px">XLSX</div>
      <div><div class="sans" style="font-size:26px;font-weight:bold">The editable tracker</div>
      <p style="font-size:21px;color:#9AA2AE;margin-top:6px">Auto status, auto 1RM, live dashboard</p></div></div>
    <div style="display:flex;gap:24px;padding:22px 0;border-bottom:1px solid #2C333F">
      <div class="sans" style="font-size:40px;font-weight:bold;color:#C2410C;width:118px">22</div>
      <div><div class="sans" style="font-size:26px;font-weight:bold">Exercise substitutions</div>
      <p style="font-size:21px;color:#9AA2AE;margin-top:6px">Full gym, home gym, or bodyweight only</p></div></div>
    <div style="display:flex;gap:24px;padding:22px 0">
      <div class="sans" style="font-size:40px;font-weight:bold;color:#C2410C;width:118px">3</div>
      <div><div class="sans" style="font-size:26px;font-weight:bold">Tools you won't find elsewhere</div>
      <p style="font-size:21px;color:#9AA2AE;margin-top:6px">Check-in system, trigger window, substitution ladder</p></div></div>
  </div>
</div>""",
}


def crop_to_square(path):
    """Trim the rendered PNG to exactly SIZE x SIZE."""
    from PIL import Image

    with Image.open(path) as im:
        if im.size == (SIZE, SIZE):
            return
        im.crop((0, 0, SIZE, SIZE)).save(path)


def main():
    if not os.path.exists(CHROME):
        raise SystemExit(f"Chromium not found at {CHROME} — set CHROME=/path/to/chrome")
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp()
    try:
        for name, body in SLIDES.items():
            html_path = os.path.join(tmp, f"{name}.html")
            with open(html_path, "w") as fh:
                fh.write(BASE % body)
            png = os.path.join(OUT, f"{name}.png")
            subprocess.run(
                [CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                 f"--window-size={SIZE},{SIZE + VIEWPORT_SLACK}",
                 f"--screenshot={png}", f"file://{html_path}"],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            crop_to_square(png)
            print(f"Wrote {png}")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
