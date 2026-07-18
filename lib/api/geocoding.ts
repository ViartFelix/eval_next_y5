import type { GeocodingResult } from "../types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

interface RawGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone: string;
  population?: number;
}

function mapResult(raw: RawGeocodingResult): GeocodingResult {
  return {
    id: raw.id,
    name: raw.name,
    latitude: raw.latitude,
    longitude: raw.longitude,
    country: raw.country,
    countryCode: raw.country_code,
    admin1: raw.admin1,
    timezone: raw.timezone,
    population: raw.population,
  };
}

/** Search cities by name. Cached briefly since suggestions rarely change. */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "fr");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Échec de la recherche de villes (${res.status})`);
  }

  const data: { results?: RawGeocodingResult[] } = await res.json();
  return (data.results ?? []).map(mapResult);
}
