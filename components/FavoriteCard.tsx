"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CurrentWeather, FavoriteCity } from "@/lib/types";
import { buildCitySlug } from "@/lib/slug";
import { formatTemperature } from "@/lib/format";
import { WeatherIcon } from "@/components/WeatherIcon";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getWeatherCodeInfo } from "@/lib/weather-codes";

interface WeatherSummaryResponse {
  current: CurrentWeather;
  todayMax: number;
  todayMin: number;
}

export function FavoriteCard({ city }: { city: FavoriteCity }) {
  const [summary, setSummary] = useState<WeatherSummaryResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather-summary?lat=${city.latitude}&lon=${city.longitude}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [city.latitude, city.longitude]);

  const slug = buildCitySlug(city);

  return (
    <Link
      href={`/ville/${slug}`}
      className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="absolute right-4 top-4">
        <FavoriteButton city={city} size="sm" />
      </div>

      <div>
        <h3 className="pr-10 font-display text-xl font-semibold text-ink">
          {city.name}
        </h3>
        <p className="text-sm text-text-muted">
          {[city.admin1, city.country].filter(Boolean).join(", ")}
        </p>
      </div>

      <div className="flex items-end justify-between">
        {summary ? (
          <>
            <span className="font-display text-4xl font-semibold text-ink">
              {formatTemperature(summary.current.temperature)}
            </span>
            <div className="flex items-center gap-2 text-right">
              <span className="text-sm text-text-muted">
                {getWeatherCodeInfo(summary.current.weatherCode).label}
              </span>
              <WeatherIcon
                code={summary.current.weatherCode}
                isDay={summary.current.isDay}
                className="text-3xl"
              />
            </div>
          </>
        ) : failed ? (
          <span className="text-sm text-text-muted">Météo indisponible</span>
        ) : (
          <span className="text-sm text-text-muted">Chargement…</span>
        )}
      </div>
    </Link>
  );
}
