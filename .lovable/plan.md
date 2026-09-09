# Match the SB 954 site from the logos down

Goal: everything below the allies logo strip on this homepage should read and look exactly like the SB 954 site (preview version). The logo strip itself stays where it is.

## What changes

1. **Move the campaign update copy below the logos.**
   Right now the "Thank you to everyone / Great News!!" block sits above the logos. On SB 954 it sits directly below the logos, styled as its own section, and it ends with a gold "Send Your Letter to Governor Newsom" button on phones/tablets. This page will match that: block moves down, gains the button, and keeps the section dividers in the same order.

2. **Loophole explainer wording.**
   - "our air, our water, our health, our coast, and our lands" becomes "our air, our water, our health, our rivers, our bay, and our lands."
   - "Toxics Pollution Loophole" shown in quotes, and "by enacting Senate Bill 954" becomes "by voting for Senate Bill 954."

3. **Coalition letter line.**
   "120+ California organizations urging Governor Newsom to sign SB 954 into law" becomes the SB 954 wording: "…urging the Legislature to pass SB 954." (Say the word if you'd rather keep the Newsom version here.)

4. **Bottom call-to-action block.**
   Matches SB 954: heading reads URGE / GOVERNOR NEWSOM / TO SIGN / SB 954 INTO LAW…, and the checklist becomes three items — restore environmental review for "advanced manufacturing" projects, the existing middle item, and "Close the toxic pollution loophole once and for all."

## What is kept from this site

- The three-line phone version of the bottom button and its arrow placement (your earlier request).
- The desktop behavior where the button scrolls the letter panel to its top and pulses it.
- The letter form, "Other Ways to Help," and the typewriter effect on "Governor Newsom."
- The password gate and the hero.

## Technical notes

- `src/pages/Index.tsx`: replace `CampaignUpdate` above the strip with a `GovernorAppeal`-style section rendered after `AlliesStrip` / before the video, matching SB 954's divider order.
- Rename/replace `src/components/CampaignUpdate.tsx` with `GovernorAppeal.tsx` including the mobile scroll-to-form button.
- Text edits in `CeqaExplainer.tsx`, `ItsAlreadyHappening.tsx`, `CtaBanner.tsx` (copy only; keep local scroll logic and responsive button markup).
