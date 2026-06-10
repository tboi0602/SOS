"use client";

export function PostCardSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            <div className="space-y-1.5 flex-1">
              <div
                className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/4"
                style={{ animationDelay: `${i * 80}ms` }}
              />
              <div
                className="h-2 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/6"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            </div>
          </div>
          <div
            className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-3/4"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div
            className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/2"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div
            className="h-32 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-xl"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div className="flex gap-4">
            <div
              className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-12"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            <div
              className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-12"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
