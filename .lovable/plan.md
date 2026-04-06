

## Plan: Update Hero CTA Button Text and Size

### What changes
**File: `src/components/HeroSection.tsx`**

1. Change the primary (gold) button text from "Thank Senator Catherine Blakespear" to **"Click to Quickly Thank Senator Blakespear"** (single line, no `<br />`)
2. Make both buttons the same size by ensuring they share identical padding and width constraints — both will use the same `max-w-[320px] w-full` so they appear uniform
3. Remove the `<br />` line breaks from both buttons for cleaner single-flow text

### Technical detail
- Primary button: update inner text, remove `<br />`, keep `px-10 py-5` padding, add `max-w-[320px] w-full`
- Secondary button: already has `max-w-[320px]`, add `w-full` to match
- Both buttons will render at the same width on desktop, stacking on mobile

