import type { CurrentWeather } from "@/lib/types";
import { getSkyGradient } from "@/lib/sky-gradient";
import { getWeatherCodeInfo } from "@/lib/weather-codes";
import { formatTemperature } from "@/lib/format";
import { WeatherIcon } from "@/components/WeatherIcon";
import { FavoriteButton } from "@/components/FavoriteButton";

interface CityHeroProps {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
}

export function CityHero({
  name,
  country,
  admin1,
  latitude,
  longitude,
  current,
}: CityHeroProps) {
  const gradient = getSkyGradient(current.weatherCode, current.isDay);
  const { label } = getWeatherCodeInfo(current.weatherCode);
  const isLight = current.isDay && current.weatherCode <= 3;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border"
      style={{
        background: `linear-gradient(160deg, ${gradient.from}, ${gradient.via} 55%, ${gradient.to})`,
      }}
    >
      <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className={`font-display text-3xl font-semibold sm:text-4xl ${
                isLight ? "text-ink" : "text-white"
              }`}
            >
              {name}
            </h1>
            <p className={`mt-1 text-sm ${isLight ? "text-ink/70" : "text-white/80"}`}>
              {[admin1, country].filter(Boolean).join(", ")}
            </p>
          </div>
          <FavoriteButton city={{ name, country, admin1, latitude, longitude }} />
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <span
            className={`font-display text-7xl font-semibold leading-none sm:text-8xl ${
              isLight ? "text-ink" : "text-white"
            }`}
          >
            {formatTemperature(current.temperature)}
          </span>
          <div className="flex items-center gap-3 pb-2">
            <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="text-5xl" />
            <div>
              <p className={`text-lg font-medium ${isLight ? "text-ink" : "text-white"}`}>
                {label}
              </p>
              <p className={`text-sm ${isLight ? "text-ink/70" : "text-white/80"}`}>
                Ressenti {formatTemperature(current.apparentTemperature)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
