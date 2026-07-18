"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GeocodingResult } from "@/lib/types";
import { buildCitySlug } from "@/lib/slug";

export function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal }
        );
        const data: { results: GeocodingResult[] } = await res.json();
        setResults(data.results);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Recherche indisponible pour le moment.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToCity(city: GeocodingResult) {
    const slug = buildCitySlug(city);
    setIsOpen(false);
    setQuery("");
    router.push(`/ville/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToCity(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const showDropdown =
    isOpen && trimmedQuery.length >= 2 && (results.length > 0 || isLoading || Boolean(error));

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <label htmlFor="city-search" className="sr-only">
        Rechercher une ville
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3.5 shadow-sm transition-shadow focus-within:shadow-md">
        <span aria-hidden className="text-lg text-text-muted">
          🔍
        </span>
        <input
          id="city-search"
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="city-search-listbox"
          placeholder="Rechercher une ville (ex. Lyon, Dakar, Montréal…)"
          className="w-full bg-transparent text-base text-ink placeholder:text-text-muted focus:outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showDropdown && (
        <ul
          id="city-search-listbox"
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
        >
          {isLoading && (
            <li className="px-5 py-3 text-sm text-text-muted">Recherche…</li>
          )}
          {!isLoading && error && (
            <li className="px-5 py-3 text-sm text-aqi-mauvais">{error}</li>
          )}
          {!isLoading && !error && results.length === 0 && (
            <li className="px-5 py-3 text-sm text-text-muted">
              Aucune ville trouvée pour « {trimmedQuery} ».
            </li>
          )}
          {!isLoading &&
            results.map((city, index) => (
              <li key={city.id} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onClick={() => goToCity(city)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm transition-colors ${
                    index === activeIndex ? "bg-surface-muted" : ""
                  }`}
                >
                  <span className="font-medium text-ink">{city.name}</span>
                  <span className="text-text-muted">
                    {[city.admin1, city.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
