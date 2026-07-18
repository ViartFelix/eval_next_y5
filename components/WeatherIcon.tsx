import { getWeatherCodeInfo } from "@/lib/weather-codes";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

function resolveIcon(code: number, isDay: boolean): string {
  if (!isDay) {
    if (code <= 1) return "🌙";
    if (code === 2) return "🌥️";
  }
  return getWeatherCodeInfo(code).icon;
}

export function WeatherIcon({ code, isDay = true, className }: WeatherIconProps) {
  const icon = resolveIcon(code, isDay);
  const { label } = getWeatherCodeInfo(code);

  return (
    <span role="img" aria-label={label} className={className}>
      {icon}
    </span>
  );
}
