# Restructure homepage around a persistent contact form (Wicks pattern, Blakespear edition)

Mirrors the proven Wicks layout: form lives in a sticky right-side sidebar on desktop and inline on mobile/tablet. The standalone Take Action page is removed, and the verified-address gate is replaced with a soft city allowlist for State Senate District 38.

## Files to delete
- `src/pages/TakeAction.tsx`

## Files to create
1. **`src/lib/district-map.ts`** — SD-38 city allowlist
   - `ALL_CITIES` (title-cased, sorted, used for `<datalist>`)
   - `BLAKESPEAR_CITIES` (lowercased) — Carlsbad, Coronado, Dana Point, Del Mar, Encinitas, Imperial Beach, La Jolla, Laguna Niguel, Oceanside, San Clemente, San Diego, San Juan Capistrano, Solana Beach (plus any obvious unincorporated areas in SD-38)
   - `normalizeCity(city)` — lowercase, trim, strip ZIPs, strip `, CA` / `, California`, strip punctuation, collapse whitespace
   - `lookupDistricts(city)` returning `{ inBlakespearDistrict, recognized }` (single-recipient — no Arreguín-style dual-send)

2. **`src/components/TypewriterGlow.tsx`** — copy of Wicks' component verbatim (props: `text`, `typeSpeed`, `eraseSpeed`, `pauseAfterType`, `pauseAfterErase`). Glowing primary text with blinking caret.

3. **`src/components/OtherWaysToHelp.tsx`** — compact card with:
   - Mail link → `senator.blakespear@senate.ca.gov`
   - Phone link → `(916) 651-6038`
   - Facebook (clipboard caption + sharer popup), X intent, LinkedIn share
   - Reuses `SHARE_URL`, `SHARE_MESSAGE`, `FACEBOOK_CAPTION` constants from current `TakeAction.tsx` (`https://righttoknow-blakespear.org`, existing copy)
   - Sonner `toast.success("Caption copied! Opening Facebook…")`

## Files to edit

### `src/components/SenatorContactForm.tsx`
- Drop `verifiedAddress` / `sessionStorage("verified_address")` flow and the verified-constituent banner.
- Add `city` to Zod schema: `z.string().min(1, "City/Town is required")`.
- Render city as `<Input list="district-cities" placeholder="e.g. Encinitas" />` with a `<datalist id="district-cities">` populated from `ALL_CITIES`.
- Watch `firstName`, `lastName`, `city`. Compute `cityEntered`, `cityDistricts`, `outOfDistrict`.
- Define `OUT_OF_DISTRICT_MESSAGE = "Sorry — this campaign is for SD-38 constituents only. Your city isn't in the district."`
- Above the Send button render (only when `cityEntered`):
  - red `text-destructive font-semibold text-center` with `OUT_OF_DISTRICT_MESSAGE` if out of district
  - otherwise gold `text-primary font-semibold text-center`: `"Your letter will be sent to Senator Blakespear."`
- Disable Send button when `submitting || outOfDistrict`. Re-check `lookupDistricts` in `onSubmit`; toast & return on miss.
- Persist `firstName, lastName, email, city` to `localStorage` key `rtk_form_data`; rehydrate as defaults.
- Auto-append `\n${firstName} ${lastName}` after `Sincerely,` via the same `useEffect` regex pattern as Wicks.
- DB insert: store `city` in existing `address` column, `zip: null`, keep `source: campaignSource || "direct"`.
- Send loop: per-recipient `supabase.functions.invoke("send-transactional-email", …)` for `senator.blakespear@senate.ca.gov` AND `philippe@nuhausdm.com` (BCC), each with its own `idempotencyKey`. Then send `take-action-confirmation` to user. No Arreguín branch, no `sent_to_arreguin` column.

### `src/pages/Index.tsx` — two-column layout
- Wrap in `lg:grid lg:grid-cols-[1fr_420px] 2xl:grid-cols-[2fr_1fr]`.
- Add `pulseForm` state + `pulse-form` window event listener; toggles `scale-[1.03] transition-transform duration-300` for ~600ms on both columns.
- **Left column (`min-w-0`):**
  - `<HeroSection />`
  - `<AlliesStrip />` wrapped in `lg:hidden`
  - Mobile/tablet inline form block `id="contact-form"` (`lg:hidden` + `pulseClass`): caution stripe → container with heading `Send Your Message to <TypewriterGlow text="Senator Blakespear" />` → `<SenatorContactForm />` → `<OtherWaysToHelp />` → caution stripe
  - `<AlliesStrip />` wrapped in `hidden lg:block`
  - desktop-only caution stripe (`hidden lg:block caution-stripe h-3`)
  - `<CeqaExplainer />`, stripe, `<ItsAlreadyHappening />`, stripe, `<AdvancedManufacturing />`, stripe, `<CtaBanner />`
- **Right column (`hidden lg:block border-l border-border` + `id="contact-form-desktop"`):**
  - `sticky top-20 p-6 pt-2 max-h-[calc(100vh-5rem)] overflow-y-auto` + `pulseClass`
  - same heading + form + OtherWaysToHelp

### `src/components/HeroSection.tsx`
- Remove `DistrictCheckDialog` import, state, and dialog render.
- Add `scrollToForm()` that finds `#contact-form` or `#contact-form-desktop`, smooth-scrolls, then dispatches `pulse-form` after 400ms.
- Wrap CTA button in `lg:hidden` (desktop already shows the sidebar form).
- Keep all hero copy, image, gradient, badge, fonts unchanged.

### `src/components/SiteHeader.tsx`
- Remove `DistrictCheckDialog` import, `dialogOpen` state, dialog render.
- Replace both Take Action buttons (desktop nav + mobile nav) and the existing dialog-triggering Send Message button with a single `Send Message` button (desktop) and one mobile-nav equivalent that calls a `goToForm()` helper. Helper: if not on `/`, `navigate("/")` then on next tick scroll to `#contact-form` / `#contact-form-desktop` and dispatch `pulse-form`; otherwise scroll + pulse directly. Drop the standalone "Take Action" link entirely.

### `src/components/CtaBanner.tsx`
- Remove `DistrictCheckDialog` import/state/render.
- CTA button now calls a local `scrollToForm()` (same body as in HeroSection) instead of opening the dialog.

### `src/components/SiteFooter.tsx`
- Remove the `Quick Links` `<Link to="/take-action">Take Action</Link>` entry (leave `Home`).

### `src/App.tsx`
- Drop the `TakeAction` import and the `<Route path="/take-action" …/>` route.

## What does NOT change
- Email templates, edge functions, DB schema — all unchanged. Single-recipient send only.
- `DistrictCheckDialog.tsx` stays in the repo (no longer triggered).
- All other components, colors, fonts, copy, and section ordering stay the same.

## Result
- Persistent "Send Your Message to Senator Blakespear" sidebar with typewriter glow on desktop & ultra-wide (always ~1/3 of the screen).
- iPhone/iPad: hero CTA smooth-scrolls to the inline form and zooms it in.
- Desktop: hero CTA pulses the already-visible sidebar form.
- City field with autocomplete: out-of-district shows red warning + disabled button; in-district shows gold confirmation.
- `/take-action` route is gone everywhere.
