## Goal
Add the new POLITICO California Climate article as the **featured** article on `/in-the-news`, demote the current Capitol Weekly piece to a regular card, and visually highlight the Blakespear/SB 954 section inside the article reader.

## Changes (frontend only — `src/pages/InTheNews.tsx`)

### 1. Add the new article object at the top of the `articles` array
- **title:** "The climate primaries cometh"
- **source:** "POLITICO — California Climate"
- **date:** "May 26, 2026"
- **author:** "Alex Nieves, Camille von Kaenel and Noah Baustin"
- **summary:** One-sentence framing that pulls out the Blakespear angle, e.g. *"As California's primary nears, Sen. Catherine Blakespear points to the weekend evacuation near an Orange County aerospace plant as a 'clear connection' to her SB 954 push to restore environmental guardrails on advanced manufacturing."*
- **url:** the politico.com link provided
- **featured: true**
- **imageUrl:** new asset (see step 3)
- **body:** Only the sections directly relevant to Right to Know / SB 954, not the full newsletter. Specifically:
  - A short intro paragraph framing the newsletter context
  - The full "THERE'S NOTHING LIKE AN EMERGENCY" section about Blakespear and SB 954 (this is the highlighted block)
  - A brief closing note that the Senate is expected to vote on SB 954 this week
  - We will **not** reproduce the campaign/oil-money/transit/CCS sections — they're off-topic and would dilute the page. A "Read full newsletter on POLITICO" link already exists at the bottom of the modal.

### 2. Remove `featured: true` from the Capitol Weekly article
It becomes a regular card below the new featured POLITICO piece. The CalMatters article stays as the third card. Order in `articles` array: POLITICO (featured) → Capitol Weekly → CalMatters.

### 3. Featured image
Use a generated editorial image evoking the POLITICO California Climate masthead style (Capitol dome silhouette + California coastline, navy/gold treatment consistent with site palette). Save to `src/assets/politico-california-climate.jpg` and import it. We can't screenshot Politico directly due to licensing; a branded thematic image is the safer choice.

### 4. Highlight the Blakespear section in the reader modal
Extend the `NewsArticle` interface so `body` can be either a string or a `{ type: 'highlight', heading?: string, paragraphs: string[] }` block. Render highlight blocks inside a styled callout:
- Left border in `border-primary` (gold), `bg-primary/5` background
- Small heading "SB 954 spotlight" in `font-heading uppercase tracking-widest text-primary text-xs`
- Paragraphs inside use normal prose styling
- Padding `p-5 md:p-6`, rounded, `my-6`

The POLITICO article's `body` will use this to wrap the "THERE'S NOTHING LIKE AN EMERGENCY" paragraphs so they visually pop. Other articles remain unaffected (plain strings keep working).

### 5. Sidebar
No changes needed — it iterates `articles` and automatically picks up the new entry and featured badge.

## Out of scope
- No schema, no routing, no business-logic changes.
- No changes to the Capitol Weekly or CalMatters bodies.

## Result
Visitors landing on `/in-the-news` see the POLITICO piece as the new featured article. Opening it shows a focused excerpt with the SB 954 / Blakespear section visually highlighted as a gold-bordered callout, and a "Read on POLITICO — California Climate" link to the full newsletter.
