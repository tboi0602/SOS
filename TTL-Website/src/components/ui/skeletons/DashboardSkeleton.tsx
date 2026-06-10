"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div
                  className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-16"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
                <div
                  className="h-6 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-12"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              </div>
              <div
                className="size-10 rounded-xl bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5"
          >
            <div className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-32 mb-4" />
            <div className="h-64 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="h-8 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-48" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-elevated)]/20 border border-[var(--border-base)]"
        >
          <div
            className="size-9 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse shrink-0"
            style={{ animationDelay: `${i * 40}ms` }}
          />
          <div
            className="flex-1 grid grid-cols-[1.5fr_0.6fr_0.4fr_0.4fr_0.4fr_0.5fr_0.5fr_0.5fr_0.5fr_0.7fr_0.5fr] gap-2"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {Array.from({ length: 11 }).map((_, j) => (
              <div key={j} className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
