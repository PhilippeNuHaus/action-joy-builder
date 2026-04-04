## Admin Map Feature

### 1. Database: Add location columns to `campaign_visits`
- Add `latitude` and `longitude` columns (nullable, for future clicks only)

### 2. Backend: Geocode letter addresses
- Update `admin-verify` edge function to geocode addresses from `contact_submissions` using OpenStreetMap's free Nominatim API (no API key needed)
- Cache/return coordinates alongside submission data

### 3. Frontend: Capture click location
- Update the campaign redirect page to grab approximate browser location (if available) or use a free IP geolocation service, and store lat/lng in `campaign_visits`

### 4. Frontend: Build the map
- Install `react-leaflet` + `leaflet` (free, no API key required)
- Add a map section to the admin dashboard
- **Letter submissions**: Plot with address-geocoded coordinates
  - 📧 Email channel → blue icon
  - 📱 SMS channel → green icon  
  - 🔗 Direct → gold icon
- **Clicks** (future only): Plot with different marker style
  - Different icon shape to distinguish from letters

### Notes
- Historical clicks won't appear on map (no location data)
- Geocoding happens server-side to avoid rate limits
- Nominatim has a 1 req/sec limit, so we'll batch carefully
