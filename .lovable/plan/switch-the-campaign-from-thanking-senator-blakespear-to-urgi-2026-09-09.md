# Switch the campaign from thanking Senator Blakespear to urging Governor Newsom to sign SB 954

Rewrite all site language using the approved copy doc, remove the "thank your senator / assembly member" framing, and open the form to everyone in California.

## New homepage copy (from the doc)

Headline:
URGE GOVERNOR NEWSOM TO CEMENT HIS LEGACY AND PROTECT OUR COMMUNITY FROM TOXIC POLLUTION BY SIGNING INTO LAW SB 954

Body, in order:
- Thank you to everyone who sent an email to your legislator earlier this year urging them to support legislation to close the toxic pollution loophole.
- *Great News!!* With your support, the California Legislature just approved Senate Bill 954 that helps close the toxic pollution loophole the legislature and governor created last year as part of a broader California Environmental Quality Act (CEQA) overhaul.
- The toxic pollution loophole currently exempts 75+ types of heavy industry - including facilities that use and can release toxic chemicals like arsenic, PFAS, and cyanide - from vitally needed environmental review.
- State leaders promised us a fix that maintains the goals laid out in the initial legislation but doesn't sacrifice environmental review for the most dangerous industries in California. Senate Bill 954 is that fix. It closes the toxic pollution loophole to protect public health and our air and water quality.
- SB 954 has passed the Assembly and Senate and undergone an extensive public review process. It has strong support from environmental, environmental justice, labor, and public health organizations. It deserves to become law.
- **Governor Newsom can cement his legacy and protect our community from toxic pollution by signing SB 954 into law. He needs to hear from us!**
- In just 30 seconds, you can send a letter to Governor Newsom today asking him to support SB 954.

## Letter in the form

Replaces the current thank-you letter word for word with the doc's letter, addressed "Dear Governor Newsom," and signed with the sender's name as it does today.

## Buttons and labels

- Hero and bottom buttons: "Click to Quickly Send a Letter to Governor Newsom" (three-line version on iPhone, same styling and spacing as now).
- Form heading: "Send Your Message to Governor Newsom".
- Field label, confirmation line, success screen, and the sent-confirmation toast all change from Senator Blakespear to Governor Newsom.
- Bottom section heading changes from "Thank Senator Blakespear for Introducing SB 954..." to urging the Governor to sign it.

## Anyone in California can send

- The district city list check is removed. The city field stays as a plain optional-looking text field with no blocked message and no disabled button.
- Nothing else about how submissions are stored changes; city keeps saving as it does today.

## Emails

- Notification email: retitled from "Constituent Message" to a message for the Governor's office, drops the "verified constituent of Senate District 38" and "verified address" lines, and keeps name, city, email and the letter body.
- Confirmation email to the sender: wording updated to reference the Governor and SB 954 signing; share captions updated to match.

## Other pages

- Page title and social preview text: "Right to Know - Tell Gov. Newsom to Sign SB 954".
- "Other ways to help" panel: the direct-email and phone lines change to the Governor's office; share captions reworded around signing SB 954.
- In the News and Resources pages are left as they are (articles are historical).

## One thing to confirm

The Governor's office does not publish a direct email inbox - public messages go through the official contact form at govapps.gov.ca.gov/gov40mail. So the plan sends each letter to your team inbox (philippe@nuhausdm.com) and stores it as today. If you have a staffer or office address to use, send it to me and I'll add it as the primary recipient. The Senator's office address is removed either way.

## Technical notes

Files touched: `HeroSection.tsx`, `CtaBanner.tsx`, `Index.tsx`, `SenatorContactForm.tsx`, `OtherWaysToHelp.tsx`, `src/lib/district-map.ts` (gate removed), `index.html`, and the two email templates under `supabase/functions/_shared/transactional-email-templates/`, followed by an edge function deploy. No database changes.
