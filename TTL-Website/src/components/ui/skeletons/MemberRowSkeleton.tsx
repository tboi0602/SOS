"use client";

export function MemberRowSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-elevated)]/20 border border-[var(--border-base)]"
        >
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
              className="h-2 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/5"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
          <div className="flex gap-3">
            <div
              className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-10"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-10"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-10"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
