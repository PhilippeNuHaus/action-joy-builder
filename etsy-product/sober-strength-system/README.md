# The Sober Strength System

A digital product built for sale on Etsy: a 12-week strength program periodized to the
first 90 days without alcohol, plus a formula-driven tracker and a launch kit.

Everything here is generated from source — edit the source, run `./build.sh`, get new files.

## Layout

```
src/
  program.html            The 30-page program. Source of truth for the main PDF.
  start-here.html         2-page download/print instructions sheet.
  make_tracker.py         Generates the .xlsx tracker (openpyxl).
  make_listing_images.py  Generates the designed listing images (slides 01-05).
  make_preview_images.py  Generates listing images composited from real page renders
                          (slides 06-08) — the flat-lay and the page features.
build/                    Generated. The three files you upload to Etsy.
build/listing-images/     Generated. Eight 2000x2000 images, upload in filename order.
ETSY-LISTING.md           Title, tags, description, pricing rationale, shot list.
ETSY-SETUP-CHECKLIST.md   Field-by-field walkthrough in Etsy's own form order.
build.sh                  Rebuilds the PDFs and the tracker.
```

## Building

```bash
./build.sh                           # program PDF + start-here PDF + tracker
python3 src/make_listing_images.py   # designed slides 01-05
python3 src/make_preview_images.py   # composited slides 06-08
```

`make_preview_images.py` re-renders the whole program and slices it into page images, so
the flat-lay and page features can never drift out of sync with the actual document.

Requirements: Python 3 with `openpyxl` and `pillow`, and a Chromium binary. The scripts
default to the Playwright Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
override with `CHROME=/path/to/chrome`.

## What ships to the buyer

Upload exactly these three files to the Etsy listing:

| File | Size | What it is |
|---|---|---|
| `Sober-Strength-System-Program.pdf` | ~830 KB | 30 pages, US Letter, print-ready |
| `Sober-Strength-Tracker.xlsx` | ~38 KB | Editable tracker with live formulas |
| `START-HERE-Read-Me-First.pdf` | ~140 KB | 2 pages, how to open and print |

## Rendering notes

Worth knowing before you change the build:

- **PDFs are rendered by Chromium's `--print-to-pdf`.** Page geometry comes from
  `@page { size: 8.5in 11in; margin: 0 }` plus a `.page` block of the same size. Verified
  output is 612×792pt, exactly US Letter.
- **Fonts are system-only** (Liberation Sans for headings and tables, Bitstream Charter for
  prose). No webfonts, so the build needs no network and the PDFs embed cleanly.
- **Pages must not overflow.** `.page` is `overflow:hidden`, so content past 11in silently
  clips the footer. Check with:

  ```bash
  # injects a script that reports scrollHeight - clientHeight for every .page
  # see the measurement snippet in the commit history if you need it again
  ```

  Both source documents currently measure zero overflow on every page.
- **Listing images**: authored at 1000×1000 and painted at 2× via a CSS transform. Neither
  `--force-device-scale-factor` nor CSS `zoom` fills the viewport correctly in this
  Chromium build, and headless reserves ~87px of the requested window height, so the script
  renders tall and crops back to exactly 2000×2000.

## Content notes

The product's differentiator is that training load is matched to the early-sobriety
recovery arc rather than assuming constant recovery capacity. If you edit the program,
keep these intact — they are what separate it from commodity listings:

- The three-phase structure tied to days 1–28 / 29–56 / 57–90
- The Green / Amber / Red morning check-in and the Red Session
- The trigger-window scheduling method
- The Substitution Ladder
- The sober-day column on every training log

## Safety and claims

The program carries a medical-safety notice, a helpline number, and a disclaimer on the
inside pages, in the Start Here sheet, in the tracker, and in the listing copy. **Do not
remove these.** Alcohol withdrawal can be medically dangerous, and the product is
positioned as training programming rather than treatment. `ETSY-LISTING.md` explains the
claim boundaries to stay inside.

Research figures cited in the PDF (24–38% reduction in muscle protein synthesis) come from
published work on alcohol and post-exercise myofibrillar protein synthesis; sources are
listed on page 30 of the program.
