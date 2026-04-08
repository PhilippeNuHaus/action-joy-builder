

## Plan: Add pagination to admin dashboard tables

### Changes to `src/pages/Admin.tsx`

1. **Add pagination state** — `submissionPage` and `emailPage` state variables, defaulting to 1.

2. **Paginate submissions table** — Show 10 rows per page using `.slice((page-1)*10, page*10)`. Add Previous/Next buttons and "Page X of Y" indicator below the table. Table columns stay exactly as they are: Name, Email, Channel, Date (PST).

3. **Paginate Emails to Senator table** — Same 10-per-page pattern with Previous/Next controls.

4. **All stat cards remain unchanged** — Letters Sent, Link Clicks, Emails Sent, Channels Tracked all stay.

### Technical details
- No changes to data fetching, stat cards, or column layout
- Pagination is client-side only using array `.slice()`
- Previous button disabled on page 1, Next disabled on last page
- Styled to match the existing dark theme with gold accents

