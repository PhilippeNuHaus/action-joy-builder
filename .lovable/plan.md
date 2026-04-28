## Refactor to Wilson/Wicks Layout — Blakespear (SD-38)

### Confirm before I start
**SD-38 city list seed** — please confirm or edit:
Encinitas, Solana Beach, Del Mar, Carlsbad, Oceanside, Vista, San Marcos, Escondido, Rancho Santa Fe, Dana Point, San Clemente, San Juan Capistrano, Laguna Niguel, Laguna Beach, Aliso Viejo, Mission Viejo.

Note: SD-38 also includes **Camp Pendleton, Fallbrook, Bonsall, Rainbow** (north SD county unincorporated) and parts of coastal Orange County. I'll add these unless you say otherwise. Mission Viejo is **not** in SD-38 (it's SD-37) — I'll drop it unless you want it kept.

---

### Files deleted
- `src/pages/TakeAction.tsx`
- `src/components/DistrictCheckDialog.tsx`
- `/take-action` route in `src/App.tsx`

### Files created
- **`src/lib/district-map.ts`** — `BLAKESPEAR_CITIES` (Set), `ALL_CITIES` (sorted title-case array for datalist), `normalizeCity(s)` (lowercase, strip ZIP, strip `, CA`/`California`, strip punctuation, collapse whitespace), `lookupDistricts(city) → { inDistrict, recognized }`.
- **`src/components/TypewriterGlow.tsx`** — small typewriter component used by the form heading. (If a Wilson version exists in shared assets I'll mirror it; otherwise a minimal one: types out `text` char-by-char with a glowing caret, then holds.)

### Files edited

**`src/pages/Index.tsx`** — becomes the take-action page.
- Two-column shell: `lg:grid-cols-[1fr_420px] 2xl:grid-cols-[2fr_1fr]`.
- Left column: `<HeroSection />`, then on mobile/iPad (`lg:hidden`): caution-stripe → `#contact-form` wrapper containing heading + `<SenatorContactForm />` → caution-stripe → `<AlliesStrip variant="mobile" />`. Then desktop `<AlliesStrip variant="desktop" className="hidden lg:block" />` under the hero. Then the rest of the sections (`CeqaExplainer`, `ItsAlreadyHappening` untouched, `AdvancedManufacturing`, `CtaBanner`).
- Right column (`hidden lg:block`): sticky wrapper `#contact-form-desktop` with `sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto border-l border-border` containing the heading + `<SenatorContactForm />`.
- `pulseForm` state + `useEffect` listening to `window` event `"pulse-form"` → set true for 600ms. Apply `scale-[1.03] transition-transform duration-300` vs `scale-100 ...` to **both** wrappers.
- On mount, read `?focus=form` query param; if present, run the scroll+pulse helper after a short delay, then strip the param.

**`src/lib/scrollToForm.ts`** (new tiny helper, exported):
```
const el = document.getElementById("contact-form") || document.getElementById("contact-form-desktop");
el?.scrollIntoView({ behavior: "smooth" });
setTimeout(() => window.dispatchEvent(new Event("pulse-form")), 400);
```

**`src/components/HeroSection.tsx`**
- Remove `DistrictCheckDialog` import + state.
- CTA button wrapped in `flex justify-center lg:hidden`; onClick calls `scrollToForm()`.

**`src/components/SiteHeader.tsx`**
- Remove `DistrictCheckDialog`. Replace "Take Action" + "Send Message" buttons with handlers that:
  - if `location.pathname !== "/"`: `navigate("/?focus=form")`
  - else: call `scrollToForm()`
- "Send Message" stays visible on every viewport.

**`src/components/SiteFooter.tsx`**
- "Take Action" link becomes a button using the same cross-route helper. Remove the `/take-action` Link.

**`src/components/CtaBanner.tsx`**
- Remove `DistrictCheckDialog`. Button onClick → `scrollToForm()`.

**`src/components/AlliesStrip.tsx`**
- Add `variant?: "desktop" | "mobile"` prop (default desktop) — used only to allow the page to render two instances and apply visibility classes externally. Keep the visual block identical.
- Add pulsing logos: `useState(activeIndex)` + `useEffect` interval ~1200ms cycling through allies; after a full cycle pause ~1500ms then resume. Each `<img>` gets `transition-transform duration-300` and `scale-110` when `i === activeIndex`, else `scale-100`. Keep current ally list, sizes, Sierra Club override, and the no-bottom-border layout untouched.

**`src/components/SenatorContactForm.tsx`**
- Remove the address/zip session-storage logic and the verified-address banner.
- Replace schema field `address` with `city: z.string().min(1)`, validated via `lookupDistricts(city).inDistrict`.
- Render City/Town `<Input list="district-cities">` + `<datalist id="district-cities">` from `ALL_CITIES`.
- Live status under field:
  - in-district: text-primary "Your letter will be sent to Senator Blakespear."
  - out-of-district (recognized but not SD-38, or unrecognized non-empty): text-destructive "Sorry — this campaign is for SD-38 constituents only. Your city isn't in the district."
  - empty: nothing.
- Disable Send button when not in-district.
- `useEffect` on `firstName`/`lastName`: replace anything after `Sincerely,` in the message with `\n\n${firstName} ${lastName}`. Keep `DEFAULT_MESSAGE` copy unchanged (Blakespear thank-you / SB 954).
- Persist `{ firstName, lastName, email, city }` to `localStorage` under `blakespear-form-v1`; prefill on mount via `form.reset(...)`.
- On submit:
  - `submissionId = crypto.randomUUID()`.
  - Insert into `contact_submissions`: `address: city`, `zip: null`, `source: sessionStorage.getItem('utm_channel') || sessionStorage.getItem('campaign_source') || 'direct'`.
  - Recipients = `["senator.blakespear@senate.ca.gov", "philippe@nuhausdm.com"]`. For each: `try { await supabase.functions.invoke('send-transactional-email', { body: { templateName: 'senator-notification', recipientEmail: r, idempotencyKey: ` + "`blakespear-${submissionId}-${r}`" + `, templateData: { firstName, lastName, email, address: city, zip: '', message } } }) } catch (e) { console.error(e) }`.
  - Send `take-action-confirmation` to user with `idempotencyKey: ` + "`confirm-${submissionId}`" + `.
  - Toast + show existing "Message Sent!" success card.

**`src/App.tsx`** — remove the `/take-action` route and `TakeAction` import.

### Out of scope (untouched)
- `ItsAlreadyHappening.tsx`, map image, dot positions, connector lines.
- Edge functions, DB schema, email template content.
- Footer legal disclaimer, GTM, vanity redirects, admin dashboard.

### Open question
1. Confirm/edit the SD-38 city list (especially: include Camp Pendleton/Fallbrook/Bonsall/Rainbow? drop Mission Viejo?).
2. Confirm `philippe@nuhausdm.com` should receive every send (incl. real constituent submissions on the live site), not just test traffic.
