# Corey's requested changes (Governor Newsom site)

## 1. New letter text
Replace the pre-written letter in the Send Your Message form with the approved version:

> Dear Governor Newsom,
>
> Please sign Senate Bill 954 (Blakespear) to protect public health and the quality of our air and drinking water supplies from industrial pollution.
>
> SB 954 adds common-sense protections to prevent unintended consequences from the advanced manufacturing CEQA exemption that you approved last year. SB 954 significantly reduces the risk the exemption will result in releases of toxic chemicals and other industrial pollutants that impair the health of Californians and the safety of our air and water.
>
> SB 954 confirms that economic and environmental progress go together. It also reduces the likelihood of more sites being contaminated that will cost taxpayers millions of dollars to clean up.
>
> To protect public health, air and water quality, and taxpayer dollars, I fully encourage you to sign SB 954.
>
> Sincerely,

The signer's name keeps auto-filling under "Sincerely," as it does today under "Thank you,".

## 2. "Read the Full Letter" link
The button currently opens the old coalition support letter. It needs to open the new environmental/labor letter sent to the Governor this month. I don't have that PDF yet — please upload it and I'll swap it in. Everything else can ship without it.

## 3. "Legislature should vote" wording
Change remaining legislature-facing language to Governor-facing:
- Explainer section: "by voting for Senate Bill 954" becomes "by signing Senate Bill 954".
- Coalition line: "120+ California organizations urging the Legislature to pass SB 954" becomes "...urging Governor Newsom to sign SB 954".
- Sweep the rest of the homepage, banner, footer, and share text for any other "vote / pass / Legislature" phrasing and switch it to "sign".

## 4. Bullet rewrite
"Restores public notice and environmental review for so-called 'advanced manufacturing' facilities" becomes:
"Restores environmental review for the most dangerous advanced manufacturing projects."

## 5. In the News additions
Add the two op-eds already published on the RTK-SB954 site, placed in date order:
- East Bay Times, Aug 18, 2026 — "Close special interest loopholes to protect the Bay Area's air and water"
- LA Sentinel, Aug 9, 2026 — "Close Loopholes for Polluters to Save LA's Air, Water"

Full text, authors, images, and external links come across as-is.

## Technical notes
- Letter copy lives in `DEFAULT_MESSAGE_BODY` in `src/components/SenatorContactForm.tsx`; the name-append effect regex must switch from `Thank you,` to `Sincerely,`.
- Bullet: `src/components/ItsAlreadyHappening.tsx` line 24; coalition line 96.
- "voting for" wording: `src/components/CeqaExplainer.tsx`.
- Op-eds: copy article objects from the SB 954 project's `src/pages/InTheNews.tsx`; their images are project-scoped pointers, so both must be downloaded from that project's preview origin and re-uploaded here via `lovable-assets create`.
- Letter PDF (item 2) is `SB954_LETTER` in `ItsAlreadyHappening.tsx`, currently `sb954-letter.pdf.asset.json`.
