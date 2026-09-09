interface DistrictResult {
  recognized: boolean;
}

/** Common California cities offered as suggestions in the city field. */
export const ALL_CITIES = [
  "Carlsbad",
  "Coronado",
  "Dana Point",
  "Del Mar",
  "Encinitas",
  "Fresno",
  "Imperial Beach",
  "La Jolla",
  "Laguna Niguel",
  "Long Beach",
  "Los Angeles",
  "Oakland",
  "Oceanside",
  "Sacramento",
  "San Clemente",
  "San Diego",
  "San Francisco",
  "San Jose",
  "San Juan Capistrano",
  "Santa Barbara",
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

/** The campaign is now statewide — every city is accepted. */
export function lookupDistricts(city: string): DistrictResult {
  return { recognized: normalizeCity(city).length > 0 };
}
