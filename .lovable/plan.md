

## Plan: Add "Emails Delivered" stat card back to the dashboard

### Changes to `src/pages/Admin.tsx`

1. **Add `Mail` back to the lucide-react import** (line 6).

2. **Add "Emails Delivered" stat card** to the `statCards` array (line 151-155), using `stats.totalSenatorEmails` and the `Mail` icon. The data is already available in the Stats interface and fetched from the edge function.

No other changes needed — the emails table stays removed, only the stat card comes back.

