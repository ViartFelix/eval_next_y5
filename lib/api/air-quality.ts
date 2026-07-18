import type { AirQualityData, AirQualityLevel } from "../types";

const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

interface RawAirQualityResponse {
  current: {
    time: string;
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    nitrogen_dioxide: number;
  };
}

/** European AQI scale: https://open-meteo.com/en/docs/air-quality-api */
function levelFromEuropeanAqi(aqi: number): AirQualityLevel {
  if (aqi <= 20) return "bon";
  if (aqi <= 40) return "moyen";
  if (aqi <= 60) return "degrade";
  if (aqi <= 80) return "mauvais";
  if (aqi <= 100) return "tres-mauvais";
  return "extreme";
}

/** Original feature: air quality for a point, cached for 30 minutes. */
export async function getAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityData> {
  const url = new URL(AIR_QUALITY_URL);
  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set(
    "current",
    "european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide"
  );
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    throw new Error(`Échec de la récupération de la qualité de l'air (${res.status})`);
  }

  const raw: RawAirQualityResponse = await res.json();
  const c = raw.current;

  return {
    europeanAqi: c.european_aqi,
    level: levelFromEuropeanAqi(c.european_aqi),
    pm2_5: c.pm2_5,
    pm10: c.pm10,
    ozone: c.ozone,
    nitrogenDioxide: c.nitrogen_dioxide,
    time: c.time,
  };
}
