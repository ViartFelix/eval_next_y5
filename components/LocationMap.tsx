"use client";

import { useEffect, useRef, useState } from "react";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  cityName: string;
}

// Matches the map's rendered aspect ratio (wide landscape strip: h-64/sm:h-80
// inside a max-w-5xl column). Keeping the bbox in this ratio matters because
// the OSM embed preserves aspect ratio and letterboxes rather than distorting
// the map to fill the iframe.
const CONTAINER_ASPECT_RATIO = 2.75;

export function LocationMap({ latitude, longitude, cityName }: LocationMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      const next = { width: Math.round(w), height: Math.round(h) };
      setSize((prev) =>
        prev && prev.width === next.width && prev.height === next.height ? prev : next
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const latDelta = 0.05;
  // Longitude degrees are physically shorter than latitude degrees away from
  // the equator (by cos(latitude)), so the delta must be widened to keep the
  // bbox's real-world aspect ratio matching the container instead of degree
  // deltas that look square on paper but render portrait-shaped in practice.
  const lonDelta =
    (latDelta * CONTAINER_ASPECT_RATIO) / Math.cos((latitude * Math.PI) / 180);

  const bbox = [
    longitude - lonDelta,
    latitude - latDelta,
    longitude + lonDelta,
    latitude + latDelta,
  ].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div
      ref={wrapperRef}
      className="h-64 overflow-hidden rounded-2xl border border-border sm:h-80"
    >
      {/*
        The OSM embed is a MapLibre GL (WebGL canvas) map: it measures its
        container once on load and never re-syncs afterward. An iframe sized
        with a percentage width (`w-full`) resolves through a two-phase
        layout — an initial UA-default box, then the final percentage-based
        size — and the map inside commits to the first, smaller pass, leaving
        the rest of the canvas blank. Measuring the wrapper with
        ResizeObserver and only mounting the iframe with an explicit pixel
        width (never a percentage) gives the map a single, correct size to
        initialize with.
      */}
      {size !== null && (
        <iframe
          title={`Carte de ${cityName}`}
          src={src}
          width={size.width}
          height={size.height}
          style={{ border: 0, display: "block" }}
        />
      )}
    </div>
  );
}
