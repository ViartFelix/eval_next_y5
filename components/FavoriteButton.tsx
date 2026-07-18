"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import type { FavoriteCity } from "@/lib/types";

interface FavoriteButtonProps {
  city: Omit<FavoriteCity, "addedAt">;
  size?: "sm" | "lg";
}

export function FavoriteButton({ city, size = "lg" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite({ ...city, addedAt: 0 });

  const dimension = size === "lg" ? "h-11 w-11 text-2xl" : "h-8 w-8 text-base";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite({ ...city, addedAt: 0 });
      }}
      aria-pressed={active}
      aria-label={
        active
          ? `Retirer ${city.name} des favoris`
          : `Ajouter ${city.name} aux favoris`
      }
      className={`${dimension} inline-flex shrink-0 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-sun bg-sun/15 text-sun"
          : "border-border bg-surface text-text-muted hover:border-sun hover:text-sun"
      }`}
    >
      <span aria-hidden>{active ? "★" : "☆"}</span>
    </button>
  );
}
