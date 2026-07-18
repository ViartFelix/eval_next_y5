import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight text-ink"
        >
          <span aria-hidden className="text-2xl">
            ⛅
          </span>
          Ciel
        </Link>
        <nav className="text-sm font-medium text-text-muted">
          <Link href="/" className="transition-colors hover:text-sky">
            Accueil
          </Link>
        </nav>
      </div>
    </header>
  );
}
