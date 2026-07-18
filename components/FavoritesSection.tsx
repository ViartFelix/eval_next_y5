"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import { FavoriteCard } from "@/components/FavoriteCard";

export function FavoritesSection() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-lg font-medium text-ink">Aucune ville favorite pour l&apos;instant</p>
        <p className="mt-1 text-sm text-text-muted">
          Recherchez une ville et appuyez sur l&apos;étoile pour la retrouver ici.
        </p>
      </div>
    );
  }

  const sorted = [...favorites].sort((a, b) => b.addedAt - a.addedAt);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((city) => (
        <FavoriteCard key={`${city.name}-${city.latitude}-${city.longitude}`} city={city} />
      ))}
    </div>
  );
}
