import type { CurrentWeather } from "@/lib/types";

interface StatProps {
  icon: string;
  label: string;
  value: string;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
        <span aria-hidden>{icon}</span>
        {label}
      </div>
      <span className="font-display text-lg font-semibold text-ink">{value}</span>
    </div>
  );
}

function windDirectionLabel(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return directions[Math.round(degrees / 45) % 8];
}

export function CurrentConditions({ current }: { current: CurrentWeather }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Stat
        icon="🌡️"
        label="Ressenti"
        value={`${Math.round(current.apparentTemperature)}°`}
      />
      <Stat icon="💧" label="Humidité" value={`${current.humidity}%`} />
      <Stat icon="🎚️" label="Pression" value={`${Math.round(current.pressure)} hPa`} />
      <Stat
        icon="💨"
        label="Vent"
        value={`${Math.round(current.windSpeed)} km/h ${windDirectionLabel(current.windDirection)}`}
      />
      <Stat icon="🌬️" label="Rafales" value={`${Math.round(current.windGusts)} km/h`} />
      <Stat icon="☁️" label="Couverture nuageuse" value={`${current.cloudCover}%`} />
      <Stat icon="🌧️" label="Précipitations" value={`${current.precipitation} mm`} />
      <Stat icon="🕶️" label="Indice UV" value={current.uvIndex.toFixed(1)} />
    </div>
  );
}
