import type { CitySlugParts } from "./types";

/**
 * City names alone aren't unique (many Paris, many Springfield), so the slug
 * encodes coordinates too. This lets /ville/[slug] resolve a single exact
 * place without a second geocoding round-trip.
 */
export function buildCitySlug(city: CitySlugParts): string {
  const name = encodeURIComponent(city.name.trim());
  const lat = city.latitude.toFixed(4);
  const lon = city.longitude.toFixed(4);
  return `${name}@${lat}_${lon}`;
}

export function parseCitySlug(slug: string): CitySlugParts | null {
  const decoded = decodeURIComponent(slug);
  const atIndex = decoded.lastIndexOf("@");
  if (atIndex === -1) return null;

  const namePart = decoded.slice(0, atIndex);
  const coordsPart = decoded.slice(atIndex + 1);
  const [latStr, lonStr] = coordsPart.split("_");

  const latitude = Number(latStr);
  const longitude = Number(lonStr);
  if (!namePart || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return { name: namePart, latitude, longitude };
}
