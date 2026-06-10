"use client";

export function SkeletonRow({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface-elevated)]/30 border border-[var(--border-base)]">
      <div
        className="size-10 rounded-full bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse shrink-0"
        style={{ animationDelay: `${delay}ms` }}
      />
      <div className="flex-1 space-y-2.5">
        <div
          className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-1/3"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="h-3 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded w-2/3"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
      <div className="flex gap-2">
        <div
          className="size-8 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-lg"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="size-8 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-lg"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="size-8 bg-[color-mix(in_srgb,_var(--text-primary)_6%,_transparent)] animate-pulse rounded-lg"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
