## Goal

Got it — only two SMS channels exist: the original untracked `sms` (sum of Text 1 + Text 2 + Text 3 from the first three screenshots) and the new tracked `sms-1` (screenshot 4, May 8). Reconcile the seeded rows accordingly.

## Computed totals

**`sms` (untracked legacy, sum of screenshots 1–3):**
- Sent: 4,922 + 9,847 + 19,701 = **34,470**
- Spend: $172.27 + $344.65 + $689.54 = **$1,206.46**
- Date: leave blank (spans 3 sends)

**`sms-1` (screenshot 4, Blakespear (SMS-1) - 10k May 8):**
- Sent: **9,109**
- Spend: **$318.82**
- Date: **2026-05-08**

## Changes (data only — no schema or code changes)

Update `channel_costs`:

1. **Delete** `channel = 'sms-2'`
2. **Delete** `channel = 'sms-3'`
3. **Upsert `sms`** → `amount_sent = 34470`, `amount_spent = 1206.46`, `sent_at = null`
4. **Upsert `sms-1`** → `amount_sent = 9109`, `amount_spent = 318.82`, `sent_at = '2026-05-08'`
5. **Leave `email`** as-is (35,380 sent / $353.80)

## Result in the Costs tab

SMS group will show two rows:
- `sms` — 34,470 sent, $1,206.46
- `sms-1` — 9,109 sent, $318.82, May 8

Email group unchanged. Going forward, every new tracked blast will be added explicitly as `sms-2`, `sms-3`, etc.
