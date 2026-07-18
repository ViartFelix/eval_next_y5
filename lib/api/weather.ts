import type { CurrentWeather, DailyForecast, WeatherData } from "../types";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const CURRENT_VARS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",");

const DAILY_VARS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

interface RawForecastResponse {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

function mapCurrent(raw: RawForecastResponse, todayUvIndexMax: number): CurrentWeather {
  const c = raw.current;
  return {
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    pressure: c.pressure_msl,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    windGusts: c.wind_gusts_10m,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    precipitation: c.precipitation,
    cloudCover: c.cloud_cover,
    uvIndex: todayUvIndexMax,
    time: c.time,
  };
}

function mapDaily(raw: RawForecastResponse): DailyForecast[] {
  const { daily } = raw;
  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    temperatureMax: daily.temperature_2m_max[i],
    temperatureMin: daily.temperature_2m_min[i],
    precipitationSum: daily.precipitation_sum[i],
    precipitationProbability: daily.precipitation_probability_max[i],
    windSpeedMax: daily.wind_speed_10m_max[i],
    uvIndexMax: daily.uv_index_max[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
  }));
}

/** Current conditions + 7-day forecast for a given point. Cached for 10 minutes. */
export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set("current", CURRENT_VARS);
  url.searchParams.set("daily", DAILY_VARS);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    throw new Error(`Échec de la récupération de la météo (${res.status})`);
  }

  const raw: RawForecastResponse = await res.json();
  const daily = mapDaily(raw);

  return {
    current: mapCurrent(raw, daily[0]?.uvIndexMax ?? 0),
    daily,
    timezone: raw.timezone,
  };
}
