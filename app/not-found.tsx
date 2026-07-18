import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <span aria-hidden className="text-6xl">
        🧭
      </span>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Cette page s&apos;est perdue dans les nuages
      </h1>
      <p className="text-text-muted">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dusk"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
