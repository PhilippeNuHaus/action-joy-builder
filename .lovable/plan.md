## Goal

Mirror the Cabaldon Costs tab in the Right to Know admin, trim the Stats grid, drop the Analytics tab, and pre-seed channel cost rows from the screenshots provided.

## 1. Database (migration)

Create the `channel_costs` table + two SECURITY DEFINER aggregator RPCs, mirroring Cabaldon. Adapted to this project's column names (this project uses `source` instead of `channel` on `campaign_visits` and `contact_submissions`, but the cost table keeps `channel` as the generic key):

- `public.channel_costs(channel text PK, amount_spent numeric(10,2), amount_sent int, sent_at date, notes text, updated_at timestamptz)` with RLS allowing service role only.
- `public.get_clicks_by_source()` → `(channel text, count bigint)` reading from `campaign_visits.source`.
- `public.get_letters_by_source()` → `(channel text, count bigint)` reading from `contact_submissions.source`.

Then seed rows from the screenshots (only what is concretely known):

- `sms-2` — 2026-04-02, $344.72 spent, 9,847 sent (Blakespear Text 2 - 10k from Scale to Win).
- `sms-1` — 2026-03-30, sent 5,000 (cost left blank).
- `sms-3` — 2026-04-03, sent 20,000 (cost left blank).
- `email` — sent 35,380 (date 2026-04-14 from spreadsheet, cost blank).

(All other amounts left empty for the user to fill in.)

## 2. Edge function `admin-verify`

Add three new actions, all gated by the existing password check:

- `get_costs` — selects all rows from `channel_costs`, calls both RPCs, merges into `{ channel, amount_spent, amount_sent, sent_at, clicks, letters }[]`.
- `upsert_cost` — `{ channel, amount_spent, amount_sent, sent_at? }` → upsert into `channel_costs`.
- `delete_cost` — `{ channel }` → delete row.

Existing `get_stats` (default) and `geocode` actions stay untouched.

## 3. Frontend — `src/components/admin/CostsTab.tsx` (new)

Direct port of Cabaldon's `CostsTab.tsx`:

- 4 summary cards: Total Spend, Cost / Click, Cost / Letter, Conversion Rate.
- Grouped table with SMS / Email collapsible buckets, columns: Channel, Date Sent, Spend, Sent, Clicks, Letters, $/Click, $/Letter, $/Recipient, Conv. Rate.
- Inline editable Spend / Sent / Date inputs (save on blur).
- "Add a channel code" form at the bottom.
- Calls `supabase.functions.invoke("admin-verify", { body: { password, action: "get_costs" | "upsert_cost" | ... } })`.

Styled with the project's existing dark navy/gold tokens to match the rest of the admin (the Cabaldon version uses generic shadcn Card classes, so it adopts the theme automatically).

## 4. Frontend — `src/pages/Admin.tsx` edits

- **Remove** the "Emails Delivered" stat card (and stop displaying `totalSenatorEmails`).
- **Remove** the Analytics tab: `TabsTrigger value="analytics"`, the entire `<TabsContent value="analytics">` block, the `analytics`/`analyticsLoading`/`analyticsRange`/`analyticsFetched` state, `fetchAnalytics`, `handleRangeChange`, and the related logic inside `handleTabChange` and `handleRefresh`.
- **Add** Costs tab: new `TabsTrigger value="costs"` (DollarSign icon) and `<TabsContent value="costs"><CostsTab password={savedPassword} /></TabsContent>`.
- Stats grid drops from 4 cards to 3 (`Letters Sent`, `Link Clicks`, `Channels Tracked`).

## Files touched

```
NEW  supabase/migrations/<ts>_costs_tab.sql
EDIT supabase/functions/admin-verify/index.ts
NEW  src/components/admin/CostsTab.tsx
EDIT src/pages/Admin.tsx
```

## Notes / open items

- Screenshots only give complete data for one row (sms-2 / Apr 2). Other rows seeded with sent counts only — costs/sent left blank for the user to fill in inline.
- The spreadsheet's "Direct" / "text" / "email" letter channel columns aren't seeded as cost rows — those are letter counts, which the RPC already aggregates from `contact_submissions.source`.
