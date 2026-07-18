import type { DailyForecast } from "@/lib/types";
import { WeatherIcon } from "@/components/WeatherIcon";
import { getWeatherCodeInfo } from "@/lib/weather-codes";
import { formatDayLabel, formatDateShort, formatTemperature } from "@/lib/format";

export function DailyForecastList({ days }: { days: DailyForecast[] }) {
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {days.map((day, index) => (
        <li
          key={day.date}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-4 text-center"
        >
          <span className="text-sm font-semibold text-ink">
            {formatDayLabel(day.date, index)}
          </span>
          <span className="text-xs text-text-muted">{formatDateShort(day.date)}</span>
          <WeatherIcon code={day.weatherCode} className="text-3xl" />
          <span className="text-xs text-text-muted">
            {getWeatherCodeInfo(day.weatherCode).label}
          </span>
          <div className="flex items-baseline gap-1.5 font-display">
            <span className="text-base font-semibold text-ink">
              {formatTemperature(day.temperatureMax)}
            </span>
            <span className="text-sm text-text-muted">
              {formatTemperature(day.temperatureMin)}
            </span>
          </div>
          {day.precipitationProbability > 0 && (
            <span className="text-xs text-sky">
              💧 {day.precipitationProbability}%
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
