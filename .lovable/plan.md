1. Keep the desktop header “Send Message” button wired to the right-side Send Message column only, using a dedicated desktop-only scroll target at the top of that column.
2. Update the bottom CTA button in `src/components/CtaBanner.tsx` to use the same desktop-only targeting logic, so it also scrolls to the top of the right-side Send Message column instead of the left content flow.
3. Preserve the existing pulse/zoom effect for both buttons after the scroll begins.
4. Leave mobile and tablet behavior unchanged.

Technical details
- The desktop page is a two-column layout in `src/pages/Index.tsx`: the left column contains the content sections and the right column contains the sticky Send Message form.
- On desktop, both CTAs should target the right column anchor (`contact-form-desktop-anchor`) and never prioritize the mobile form target.
- The current bottom CTA still uses the old generic logic (`contact-form` first, then `contact-form-desktop`), which can pull behavior toward the left-side flow instead of the desktop form column.
- Scope: desktop-only scroll targeting for the header CTA and bottom CTA; no layout, copy, or mobile behavior changes.