"use client";

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-5 p-6 w-full">
      <div className="space-y-4">
        <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-3">
          <div className="size-20 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse mx-auto" />
          <div className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/2 mx-auto" />
          <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/3 mx-auto" />
        </div>
        <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-3">
          <div className="size-28 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse mx-auto" />
          <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/3 mx-auto" />
        </div>
        <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse" />
              <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="size-70 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded" />
          ))}
        </div>
        <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse" />
              <div className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded flex-1" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)] p-5 flex justify-center">
          <div className="size-32 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
