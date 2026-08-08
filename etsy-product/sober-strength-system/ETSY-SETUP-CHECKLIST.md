# Etsy Setup — Do This In Order

Field-by-field, in the order Etsy's form actually presents them. Every block marked
**PASTE** is copy-paste ready. Budget about 30 minutes end to end.

The files you upload live in `build/`. The images live in `build/listing-images/`.

---

## Part A — Shop-level

Your shop is **MenchyUSA**, which already exists — so most of the usual setup is done.
Three things still worth checking before you list:

| Step | What to do |
|---|---|
| A1 | `Settings → Policies` — confirm you have a **digital items** policy. If the shop has only ever sold physical goods, this will be missing. State that instant downloads are non-refundable and that you will fix any file problem on request. Without it, your first refund request has no policy behind it. |
| A2 | `Shop Manager → Listings → Sections` — create a section for this product (e.g. `Fitness Programs`). Sections are how one shop carries more than one kind of product without the storefront reading as random. |
| A3 | Confirm `Finances → Payment settings` is current. Already done if the shop has taken orders. |

**One thing to decide first — see the note at the bottom of this file about shop fit.**

---

## Part B — Create the listing

`Shop Manager → Listings → Add a listing`

### B1. Photos

Upload in exactly this order — Etsy uses the first as the thumbnail, and it drives most of
the click decision.

| Slot | File |
|---|---|
| 1 | `listing-images/01-main.png` |
| 2 | `listing-images/02-why.png` |
| 3 | `listing-images/06-every-page.png` |
| 4 | `listing-images/03-system.png` |
| 5 | `listing-images/07-workout.png` |
| 6 | `listing-images/05-tracker.png` |
| 7 | `listing-images/08-substitutions.png` |
| 8 | `listing-images/04-included.png` |

All eight are 2000×2000, comfortably above Etsy's 2000px recommendation. Leave slots 9–10
empty for now, or add a screen recording of the PDF scrolling later — video lifts
conversion more than a ninth still image.

### B2. Title

**PASTE:**

```
Sober Strength System | 12 Week Workout Plan for Sobriety, Alcohol Free Fitness Program, Printable Gym PDF + Editable Tracker
```

### B3. About this listing

| Field | Answer |
|---|---|
| Who made it? | **I did** |
| What is it? | **A finished product** |
| When did you make it? | **Made to order** (correct for digital files you supply on purchase) |

### B4. Category

Type `digital prints` into the category box and pick **Digital Prints**. If you would
rather sit in the fitness aisle, `Books, Movies & Music → Books → Fitness` also works —
but Digital Prints has more digital-download buyer traffic.

### B5. Type

**Digital.** This is the switch that turns on the file-upload box in B9. Get it wrong and
Etsy will ask you for shipping profiles.

### B6. Description

Paste the full description block from **`ETSY-LISTING.md` section 3**. It is long and
formatted with dividers; paste it whole rather than retyping.

The first two lines are what shows above the fold and what Google indexes — do not move
them below the fold.

### B7. Tags

Thirteen tags, one at a time. **PASTE** each:

```
sober fitness
sober curious
alcohol free
sobriety tracker
workout plan pdf
gym workout plan
12 week program
muscle building
strength training
recovery fitness
printable planner
fitness journal
sobriety gift
```

**Materials** (optional field, still indexed):

```
PDF
XLSX
Digital Download
```

### B8. Price and quantity

| Field | Value |
|---|---|
| Price | `22.00` |
| Quantity | `999` (digital listings do not deplete, but a number is required) |
| SKU | `SSS-12WK-001` |

Then, after publishing: `Marketing → Sales and discounts → Run a sale` → **30% off**, all
listings, 30 days. That surfaces `$15.40` with a sale badge. See `ETSY-LISTING.md` section
4 for why this beats simply listing at $15.

### B9. Digital files

Upload all three from `build/`:

```
Sober-Strength-System-Program.pdf     (~830 KB)
Sober-Strength-Tracker.xlsx           (~38 KB)
START-HERE-Read-Me-First.pdf          (~140 KB)
```

Etsy allows 5 files at 20MB each. You are using 3 files totalling roughly 1MB, so there is
plenty of headroom if you add a bonus file later.

Order matters less than naming — the `START-HERE` prefix makes it sort first alphabetically
in the buyer's download list, which is deliberate.

### B10. Personalisation

**Off.** There is nothing to personalise and leaving it on invites messages you then have
to answer.

### B11. Publish

Etsy charges $0.20 per listing. Then check the live listing on your phone — specifically
whether the main image title is readable at thumbnail size. That is the single check worth
doing before you spend anything on promotion.

---

## Part C — First week

| When | Do |
|---|---|
| Day 0 | Publish. Turn on the 30% sale. |
| Day 0 | Buy your own listing if you want to verify the download flow end to end. Etsy allows this and it is the only way to see exactly what the buyer sees. It costs you the listing fee plus transaction fee. |
| Day 1–7 | Do not touch the listing. Etsy's search takes days to place a new listing, and editing resets some of that signal. |
| Day 7 | Check `Stats` for impressions vs visits. Low impressions means a tags/title problem. Decent impressions but few visits means a main-image problem. Visits but no sales means a price or description problem. Those three diagnoses need three different fixes — do not guess. |
| Day 30 | If conversion is holding, test the alternate title from `ETSY-LISTING.md` section 1. Change one variable at a time. |

---

## Before you start — does this belong in MenchyUSA?

I could not load your shop to see what it currently sells, so this is a question rather than
advice.

Etsy weighs shop-level signals when it decides who to show a listing to. A shop whose
existing listings sit in a different category gives the algorithm a weaker read on a new
one, and browse traffic arriving for your other products will not convert on this.

- **If MenchyUSA already sells fitness, wellness, planners or digital downloads** — list it
  here. Put it in its own section (A2) and carry on.
- **If MenchyUSA sells something unrelated** — listing here still works and costs $0.20, so
  it is a perfectly reasonable way to test demand. But if it sells, move it to a dedicated
  shop rather than growing a split-identity storefront. Sober fitness is a niche where
  buyers look at who they are buying from.

Either way, do not let this stall the launch. Test it here first.

## What I could not do for you

I could not create this listing directly. There is no Etsy connector available in this
environment, and `etsy.com` is blocked by the network egress proxy, so nothing running here
can reach Etsy at all. Publishing also requires being signed into your account, which is
yours to hold rather than mine.

Everything above is the part I could do: the copy is final, the images are generated, and
the files are built and verified. The remaining work is paste-and-click.
