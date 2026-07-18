import Link from "next/link";

export default function CityNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <span aria-hidden className="text-6xl">
        🗺️
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Ville introuvable
      </h1>
      <p className="text-text-muted">
        Ce lien de ville est invalide ou incomplet. Essayez une nouvelle recherche
        depuis l&apos;accueil.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dusk"
      >
        Nouvelle recherche
      </Link>
    </div>
  );
}
