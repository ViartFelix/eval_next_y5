/**
 * Open-Meteo returns ISO-like strings already localized to the city's own
 * timezone (no offset suffix), e.g. "2026-07-18T06:12". Extracting substrings
 * directly (instead of `new Date(...)`) avoids the browser silently
 * reinterpreting them in the viewer's own timezone.
 */

export function formatTime(isoLocal: string): string {
  const [, time] = isoLocal.split("T");
  return time ?? isoLocal;
}

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Aujourd'hui";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const label = date.toLocaleDateString("fr-FR", { weekday: "long" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`;
}

export function formatCityLabel(name: string, country: string, admin1?: string): string {
  const parts = [name, admin1, country].filter(Boolean);
  return parts.join(", ");
}
