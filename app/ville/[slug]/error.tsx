"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CityError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <span aria-hidden className="text-6xl">
        ⛈️
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Impossible de charger la météo de cette ville
      </h1>
      <p className="text-text-muted">
        Le service météo est peut-être temporairement indisponible. Réessayez dans
        quelques instants.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dusk"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
