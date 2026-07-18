"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { FavoriteCity } from "@/lib/types";
import { buildCitySlug } from "@/lib/slug";

const STORAGE_KEY = "weather-app:favorites";

type Listener = () => void;

/**
 * localStorage is a mutable external store, so it's read through
 * useSyncExternalStore rather than useState+useEffect: this keeps the
 * server-rendered snapshot (always empty) and the post-hydration client
 * snapshot consistent without a manual "isHydrated" state flag.
 */
let cachedFavorites: FavoriteCity[] | null = null;
const listeners = new Set<Listener>();

function readFromStorage(): FavoriteCity[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSnapshot(): FavoriteCity[] {
  if (cachedFavorites === null) {
    cachedFavorites = readFromStorage();
  }
  return cachedFavorites;
}

const EMPTY_FAVORITES: FavoriteCity[] = [];

function getServerSnapshot(): FavoriteCity[] {
  return EMPTY_FAVORITES;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeFavorites(next: FavoriteCity[]) {
  cachedFavorites = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

interface FavoritesContextValue {
  favorites: FavoriteCity[];
  isFavorite: (city: FavoriteCity) => boolean;
  toggleFavorite: (city: FavoriteCity) => void;
  removeFavorite: (city: FavoriteCity) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback(
    (city: FavoriteCity) => {
      const slug = buildCitySlug(city);
      return favorites.some((fav) => buildCitySlug(fav) === slug);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (city: FavoriteCity) => {
      const slug = buildCitySlug(city);
      const exists = favorites.some((fav) => buildCitySlug(fav) === slug);
      writeFavorites(
        exists
          ? favorites.filter((fav) => buildCitySlug(fav) !== slug)
          : [...favorites, { ...city, addedAt: Date.now() }]
      );
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    (city: FavoriteCity) => {
      const slug = buildCitySlug(city);
      writeFavorites(favorites.filter((fav) => buildCitySlug(fav) !== slug));
    },
    [favorites]
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
