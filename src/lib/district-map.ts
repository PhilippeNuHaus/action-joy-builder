interface DistrictResult {
  inBlakespearDistrict: boolean;
  recognized: boolean;
}

// Cities in Senator Blakespear's SD-38 (coastal North San Diego County
// + small piece of South Orange County)
export const BLAKESPEAR_CITIES = [
  "carlsbad",
  "coronado",
  "dana point",
  "del mar",
  "encinitas",
  "imperial beach",
  "la jolla",
  "laguna niguel",
  "oceanside",
  "san clemente",
  "san diego",
  "san juan capistrano",
  "solana beach",
];

/** All known cities in the district map, title-cased for datalist display */
export const ALL_CITIES = [
  "Carlsbad",
  "Coronado",
  "Dana Point",
  "Del Mar",
  "Encinitas",
  "Imperial Beach",
  "La Jolla",
  "Laguna Niguel",
  "Oceanside",
  "San Clemente",
  "San Diego",
  "San Juan Capistrano",
  "Solana Beach",
].sort();

/** Normalize user-entered city: lowercase, strip ZIP, strip ", CA", strip punctuation */
function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/\b\d{5}(-\d{4})?\b/g, "")
    .replace(/,\s*(ca|california)\b/g, "")
    .replace(/[.,;:!?()'"`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function lookupDistricts(city: string): DistrictResult {
  const normalized = normalizeCity(city);
  const inBlakespearDistrict = BLAKESPEAR_CITIES.includes(normalized);
  return {
    inBlakespearDistrict,
    recognized: inBlakespearDistrict,
  };
}
