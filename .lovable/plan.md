## Goal
Make the Channel Costs table fit the admin viewport with no horizontal scroll.

## Changes (frontend only — `src/components/admin/CostsTab.tsx`)

1. **Compact the inline inputs** — shrink the editable fields so they stop forcing the table wider:
   - Date input: `w-36` → `w-32`, smaller text (`text-xs`)
   - Spend input: `w-24` → `w-20`
   - Sent input: `w-28` → `w-20`
   - All editable cells: tighter horizontal padding (`px-1`)

2. **Tighten table cell padding globally** for this table — add a wrapper class so every `TableHead`/`TableCell` uses `px-2` (default shadcn is `px-4`).

3. **Shorten column headers** to reduce minimum width:
   - `$/Click` / `$/Letter` / `$/Recipient` / `Conv. Rate` stay, but headers get `text-xs` and `whitespace-nowrap` removed so they can wrap to two lines if needed.
   - Right-align numeric headers tightly.

4. **Reduce font size** of numeric cells to `text-sm` so 9–10 narrow columns fit comfortably at ~1000px.

5. **Wrap the table** in a `w-full` container (no `overflow-x-auto`) so it actually constrains rather than scrolls. If the viewport is genuinely too narrow on small screens, keep `overflow-x-auto` only at `<lg` breakpoint.

## Result
On the admin's normal desktop width (~1000–1100px inside the card), all 10 columns (Channel, Date Sent, Spend, Sent, Clicks, Letters, $/Click, $/Letter, $/Recipient, Conv. Rate) fit without a horizontal scrollbar. Mobile still scrolls gracefully.

No data, schema, or business-logic changes.
