import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseCitySlug } from "@/lib/slug";
import { getWeather } from "@/lib/api/weather";
import { getAirQuality } from "@/lib/api/air-quality";
import { searchCities } from "@/lib/api/geocoding";
import type { AirQualityData, GeocodingResult } from "@/lib/types";
import { CityHero } from "@/components/CityHero";
import { CurrentConditions } from "@/components/CurrentConditions";
import { DailyForecastList } from "@/components/DailyForecastList";
import { SunTimes } from "@/components/SunTimes";
import { AirQualityCard } from "@/components/AirQualityCard";
import { LocationMap } from "@/components/LocationMap";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function resolveCityDetails(
  name: string,
  latitude: number,
  longitude: number
): Promise<Pick<GeocodingResult, "country" | "admin1">> {
  try {
    const matches = await searchCities(name);
    const closest = matches.find(
      (m) => Math.abs(m.latitude - latitude) < 0.01 && Math.abs(m.longitude - longitude) < 0.01
    );
    return { country: closest?.country ?? "", admin1: closest?.admin1 };
  } catch {
    return { country: "", admin1: undefined };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = parseCitySlug(slug);
  if (!city) return { title: "Ville introuvable" };
  return { title: city.name };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = parseCitySlug(slug);
  if (!city) notFound();

  const [weather, details] = await Promise.all([
    getWeather(city.latitude, city.longitude),
    resolveCityDetails(city.name, city.latitude, city.longitude),
  ]);

  let airQuality: AirQualityData | null = null;
  try {
    airQuality = await getAirQuality(city.latitude, city.longitude);
  } catch {
    airQuality = null;
  }

  const today = weather.daily[0];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
      <CityHero
        name={city.name}
        country={details.country}
        admin1={details.admin1}
        latitude={city.latitude}
        longitude={city.longitude}
        current={weather.current}
      />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Conditions actuelles
        </h2>
        <CurrentConditions current={weather.current} />
      </section>

      {today && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Lever et coucher du soleil
          </h2>
          <SunTimes sunrise={today.sunrise} sunset={today.sunset} />
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Prévisions sur 7 jours
        </h2>
        <DailyForecastList days={weather.daily} />
      </section>

      {airQuality && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Qualité de l&apos;air
          </h2>
          <AirQualityCard data={airQuality} />
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Localisation
        </h2>
        <LocationMap
          latitude={city.latitude}
          longitude={city.longitude}
          cityName={city.name}
        />
      </section>
    </div>
  );
}
