import { SearchBar } from "@/components/SearchBar";
import { FavoritesSection } from "@/components/FavoritesSection";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-14 px-5 py-12 sm:px-8 sm:py-16">
      <section
        className="flex flex-col items-center gap-8 rounded-3xl border border-border px-6 py-16 text-center sm:py-20"
        style={{
          background:
            "linear-gradient(160deg, var(--sky-from), var(--sky-via) 55%, var(--sky-to))",
        }}
      >
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Le ciel, où que vous soyez
          </h1>
          <p className="mx-auto max-w-md text-base text-ink/70">
            Recherchez une ville pour voir sa météo en direct, ses prévisions à 7
            jours et la qualité de l&apos;air.
          </p>
        </div>
        <SearchBar />
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Villes favorites
          </h2>
          <p className="text-sm text-text-muted">
            Retrouvez rapidement les conditions de vos villes enregistrées.
          </p>
        </div>
        <FavoritesSection />
      </section>
    </div>
  );
}
