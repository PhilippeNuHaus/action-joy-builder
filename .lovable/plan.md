1. Add a dedicated desktop form anchor at the top of the right-side message column in `src/pages/Index.tsx`, positioned at the true start of the “Send Your Message” section.
2. Update `goToForm` in `src/components/SiteHeader.tsx` so the desktop header “Send Message” button scrolls to that desktop anchor instead of only targeting the current container.
3. Keep the existing pulse/zoom behavior, but trigger it after the desktop scroll starts so the user lands at the beginning of the section and still sees the emphasis effect.
4. Leave mobile behavior unchanged.

Technical details
- Right now the header button scrolls to `#contact-form` or `#contact-form-desktop`, then fires the `pulse-form` event.
- On desktop, `#contact-form-desktop` wraps a sticky panel, so scrolling to that container does not reliably align the viewport to the visible start of the “Send Your Message” section.
- The fix is to give desktop a specific scroll target near the top of the sticky form area and use that for desktop clicks, while preserving the existing smooth scroll and pulse animation.
- Scope: desktop header “Send Message” behavior only; no content, layout, or mobile CTA changes.