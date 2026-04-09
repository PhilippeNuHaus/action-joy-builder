

## Plan: Add Analytics tab to Admin Dashboard

### Approach
Create a new "Analytics" tab on the admin page that displays site analytics data (visitors, pageviews, views per visit, session duration, bounce rate, plus breakdowns by page, source, device, and country). Data will be fetched via a new edge function that calls the Lovable API.

### 1. Create edge function `admin-analytics`

New file: `supabase/functions/admin-analytics/index.ts`

- Accepts POST with `{ password, startDate, endDate }` body
- Validates password against `ADMIN_DASHBOARD_PASSWORD` (same as admin-verify)
- Calls `https://api.lovable.dev/v1/projects/a84fb3ac-c314-49f5-91d5-4c2d37d66e59/analytics?startdate={}&enddate={}&granularity=daily` using `LOVABLE_API_KEY` as Bearer token
- Returns the analytics JSON to the client

### 2. Add `admin-analytics` to `supabase/config.toml`

```toml
[functions.admin-analytics]
verify_jwt = false
```

### 3. Update `src/pages/Admin.tsx`

- Add a new "Analytics" tab alongside Stats and Map
- Add state for analytics data, date range selector (Last 7 days / Last 30 days), and loading state
- Fetch analytics when the tab is activated (lazy load)
- Display **5 stat cards** at top: Visitors, Pageviews, Views Per Visit, Visit Duration, Bounce Rate
- Display **4 breakdown tables**: Top Pages, Sources, Devices, Countries — each as a dark-themed card with horizontal bar indicators (matching the gold accent color)
- All styled consistently with the existing dark navy (#0f1923) background, card borders (#1e2d3a), and gold (#d4a843) accents
- Use `TrendingUp` icon for the tab trigger

### Visual layout (Analytics tab)

```text
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Visitors│ │Pageviews │ │Views/Visit│ │ Duration │ │Bounce Rate│
│   328   │ │   552    │ │   1.68   │ │  1m 45s  │ │   72%    │
└─────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘

┌─── Top Pages ──────────┐  ┌─── Sources ──────────┐
│ /go/sms          174   │  │ Direct          314  │
│ /                124   │  │ google.com        4  │
│ /take-action      74   │  │ facebook.com      2  │
└────────────────────────┘  └──────────────────────┘

┌─── Devices ────────────┐  ┌─── Countries ────────┐
│ mobile           248   │  │ US              313  │
│ desktop           79   │  │ Unknown          11  │
└────────────────────────┘  └──────────────────────┘
```

### Technical details
- Session duration displayed in human-readable format (e.g., "1m 45s")
- Bounce rate displayed as percentage
- Date range defaults to last 7 days
- Breakdown tables show proportional gold bar fills based on max value in each category
- No changes to existing Stats or Map tabs

