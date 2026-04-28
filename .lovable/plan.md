

## Move Allies Strip Below Hero & Double Logo Size

### What changes

1. **Move `<AlliesStrip />` in `src/pages/Index.tsx`** — relocate it from above `<HeroSection />` to directly below it (before the first caution-stripe divider).

2. **Double the logo sizes in `src/components/AlliesStrip.tsx`** — change the default logo class from `h-10 md:h-12` to `h-20 md:h-24` (2x). Increase vertical padding from `py-3` to `py-5` to give the larger logos breathing room.

### File edits

- **`src/pages/Index.tsx`**: Remove `<AlliesStrip />` from before `<HeroSection />`, place it immediately after `<HeroSection />`.
- **`src/components/AlliesStrip.tsx`**: Update `DEFAULT_LOGO_CLASS` to `"h-20 md:h-24 w-auto object-contain"` and container padding to `py-5`.

