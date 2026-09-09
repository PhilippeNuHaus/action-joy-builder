# Match the SB 954 site from the logos down

Goal: the allies logo strip sits exactly where it does on the SB 954 site (directly under the hero), and everything below it reads and looks the same as SB 954.

## What changes

1. **Logo strip moves up, campaign copy moves down.**
   Right now the "Thank you to everyone / Great News!!" block sits between the hero and the logos. On SB 954 the logos come straight after the hero, and that copy sits below them as its own section ending with a gold "Send Your Letter to Governor Newsom" button on phones/tablets. This page will match that order exactly, including the striped dividers.

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

5. **Footer matches SB 954.**
   - Title becomes "Right to Know – SB 954."
   - Blurb becomes "Urge Governor Newsom to protect our community from toxic pollution by signing SB 954 into law."
   - Bottom line reads "Paid for by Planning and Conservation League (Right to Know Campaign). © 2026 Right to Know."
   - SB 954's footer also has a "Take Action" quick link; this site no longer has that page, so that link is left out.
