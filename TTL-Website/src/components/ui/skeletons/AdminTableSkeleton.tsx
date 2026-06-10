"use client";

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border-base)] overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 border-b border-[var(--border-base)] last:border-0"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="size-9 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse shrink-0" />
          <div className="flex-1 grid grid-cols-[1.5fr_0.6fr_0.4fr_0.4fr_0.4fr_0.5fr_0.5fr_0.5fr_0.5fr_0.7fr_0.5fr] gap-2">
            {Array.from({ length: 11 }).map((_, j) => (
              <div key={j} className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
