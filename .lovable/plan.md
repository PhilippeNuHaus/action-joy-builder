1. Update `src/components/HeroSection.tsx` so the hero heading has a dedicated iPhone/mobile version instead of relying on wrapped text inside 5 spans.
2. Render the mobile heading as 7 explicit lines, matching the visual lines in your screenshot:
   - Thank State Senator
   - Catherine Blakespear
   - For
   - Protecting Our
   - Community
   - From Toxic Pollution
   - By Introducing SB 954
3. Apply one consistent mobile-only line spacing value across all 7 lines (`leading-[1.5]` / equivalent uniform vertical rhythm) and remove the current mixed combo of parent `leading`, child `leading`, and `gap-*` that caused uneven spacing.
4. Keep the existing tablet/desktop heading layout unchanged by separating the mobile heading from the `md+` heading.
5. Preserve all current colors, copy, button layout, map visibility, and desktop/iPad spacing exactly as-is.

Technical details
- The current issue happens because some “lines” are actually wrapped text inside a single span, while others are separate flex children spaced by `gap-4`. That creates different vertical distances.
- The fix is to stop letting iPhone lines wrap unpredictably and instead define each mobile line explicitly so every line uses the same spacing rule.
- Desktop and iPad will stay on the existing structure so nothing outside iPhone/mobile changes.