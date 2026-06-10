"use client";

export function TopSalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        {[2, 1, 3].map((pos) => (
          <div
            key={pos}
            className={`rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-3 ${pos === 1 ? "w-56" : "w-48 mt-8"}`}
          >
            <div className="size-8 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-full mx-auto" />
            <div className="size-16 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse mx-auto" />
            <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/2 mx-auto" />
            <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/3 mx-auto" />
            <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-2/3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-elevated)]/20 border border-[var(--border-base)]"
          >
            <div
              className="size-6 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="size-9 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse shrink-0"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div className="flex-1 space-y-1.5">
              <div
                className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/4"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <div
                className="h-2 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/6"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
            <div
              className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-12"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
