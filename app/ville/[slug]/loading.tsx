function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface-muted ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
      <SkeletonBlock className="h-64 rounded-3xl sm:h-72" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-20" />
        ))}
      </div>
      <SkeletonBlock className="h-24" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-40" />
        ))}
      </div>
      <SkeletonBlock className="h-40" />
      <SkeletonBlock className="h-64" />
    </div>
  );
}
