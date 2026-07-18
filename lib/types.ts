export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
  uvIndex: number;
  time: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  timezone: string;
}

export type AirQualityLevel =
  | "bon"
  | "moyen"
  | "degrade"
  | "mauvais"
  | "tres-mauvais"
  | "extreme";

export interface AirQualityData {
  europeanAqi: number;
  level: AirQualityLevel;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
  time: string;
}

export interface CitySlugParts {
  name: string;
  latitude: number;
  longitude: number;
}

export interface FavoriteCity extends CitySlugParts {
  country: string;
  admin1?: string;
  addedAt: number;
}
