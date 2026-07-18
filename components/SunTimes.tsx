import { formatTime } from "@/lib/format";

export function SunTimes({ sunrise, sunset }: { sunrise: string; sunset: string }) {
  return (
    <div className="flex items-center justify-around gap-4 rounded-xl border border-border bg-surface px-5 py-4">
      <div className="flex flex-col items-center gap-1">
        <span aria-hidden className="text-2xl">
          🌅
        </span>
        <span className="text-xs uppercase tracking-wide text-text-muted">Lever</span>
        <span className="font-display text-lg font-semibold text-ink">
          {formatTime(sunrise)}
        </span>
      </div>
      <div className="h-10 w-px bg-border" aria-hidden />
      <div className="flex flex-col items-center gap-1">
        <span aria-hidden className="text-2xl">
          🌇
        </span>
        <span className="text-xs uppercase tracking-wide text-text-muted">Coucher</span>
        <span className="font-display text-lg font-semibold text-ink">
          {formatTime(sunset)}
        </span>
      </div>
    </div>
  );
}
