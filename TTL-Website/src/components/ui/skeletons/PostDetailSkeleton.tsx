"use client";

export function PostDetailSkeleton() {
  return (
    <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/4" />
          <div className="h-2 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/6" />
        </div>
      </div>
      <div className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-full" />
      <div className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-3/4" />
      <div className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/2" />
      <div className="h-48 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-xl" />
      <div className="flex gap-4">
        <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-12" />
        <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-12" />
      </div>
      <div className="border-t border-[var(--border-base)] pt-4 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/5" />
              <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
