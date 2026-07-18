import type { AirQualityData } from "@/lib/types";
import {
  AQI_LEVEL_ADVICE,
  AQI_LEVEL_COLOR_VAR,
  AQI_LEVEL_LABELS,
} from "@/lib/air-quality-levels";

interface PollutantProps {
  label: string;
  value: number;
  unit: string;
}

function Pollutant({ label, value, unit }: PollutantProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-surface-muted px-3 py-2">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="font-display text-sm font-semibold text-ink">
        {Math.round(value)} <span className="text-xs font-normal text-text-muted">{unit}</span>
      </span>
    </div>
  );
}

export function AirQualityCard({ data }: { data: AirQualityData }) {
  const color = AQI_LEVEL_COLOR_VAR[data.level];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Qualité de l&apos;air · indice européen
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {Math.round(data.europeanAqi)}
          </p>
        </div>
        <span
          className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {AQI_LEVEL_LABELS[data.level]}
        </span>
      </div>

      <p className="mt-3 text-sm text-text-muted">{AQI_LEVEL_ADVICE[data.level]}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Pollutant label="PM2.5" value={data.pm2_5} unit="µg/m³" />
        <Pollutant label="PM10" value={data.pm10} unit="µg/m³" />
        <Pollutant label="Ozone" value={data.ozone} unit="µg/m³" />
        <Pollutant label="NO₂" value={data.nitrogenDioxide} unit="µg/m³" />
      </div>
    </div>
  );
}
