"use client";

import { type ReactNode } from "react";

function SkeletonRow({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c1e3a]/30 border border-white/4">
      <div
        className="size-10 rounded-full bg-white/6 animate-pulse shrink-0"
        style={{ animationDelay: `${delay}ms` }}
      />
      <div className="flex-1 space-y-2.5">
        <div
          className="h-3 bg-white/6 animate-pulse rounded w-1/3"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="h-3 bg-white/6 animate-pulse rounded w-2/3"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
      <div className="flex gap-2">
        <div
          className="size-8 bg-white/6 animate-pulse rounded-lg"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="size-8 bg-white/6 animate-pulse rounded-lg"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="size-8 bg-white/6 animate-pulse rounded-lg"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-white/6 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 border-b border-white/6 last:border-0"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="size-9 rounded-full bg-white/6 animate-pulse shrink-0" />
          <div className="flex-1 grid grid-cols-[1.5fr_0.6fr_0.4fr_0.4fr_0.4fr_0.5fr_0.5fr_0.5fr_0.5fr_0.7fr_0.5fr] gap-2">
            {Array.from({ length: 11 }).map((_, j) => (
              <div key={j} className="h-3 bg-white/6 animate-pulse rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PostCardSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-full bg-white/6 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            <div className="space-y-1.5 flex-1">
              <div
                className="h-3 bg-white/6 animate-pulse rounded w-1/4"
                style={{ animationDelay: `${i * 80}ms` }}
              />
              <div
                className="h-2 bg-white/6 animate-pulse rounded w-1/6"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            </div>
          </div>
          <div
            className="h-4 bg-white/6 animate-pulse rounded w-3/4"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div
            className="h-4 bg-white/6 animate-pulse rounded w-1/2"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div
            className="h-32 bg-white/6 animate-pulse rounded-xl"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div className="flex gap-4">
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-12"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-12"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-5 p-6 w-full">
      <div className="space-y-4">
        <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-3">
          <div className="size-20 rounded-full bg-white/6 animate-pulse mx-auto" />
          <div className="h-4 bg-white/6 animate-pulse rounded w-1/2 mx-auto" />
          <div className="h-3 bg-white/6 animate-pulse rounded w-1/3 mx-auto" />
        </div>
        <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-3">
          <div className="size-28 rounded-full bg-white/6 animate-pulse mx-auto" />
          <div className="h-3 bg-white/6 animate-pulse rounded w-1/3 mx-auto" />
        </div>
        <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-white/6 animate-pulse" />
              <div className="h-3 bg-white/6 animate-pulse rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="size-70 rounded-full bg-white/6 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-white/6 animate-pulse rounded" />
          ))}
        </div>
        <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-white/6 animate-pulse" />
              <div className="h-3 bg-white/6 animate-pulse rounded flex-1" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 flex justify-center">
          <div className="size-32 bg-white/6 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-white/6 animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-white/6 animate-pulse rounded w-1/4" />
          <div className="h-2 bg-white/6 animate-pulse rounded w-1/6" />
        </div>
      </div>
      <div className="h-4 bg-white/6 animate-pulse rounded w-full" />
      <div className="h-4 bg-white/6 animate-pulse rounded w-3/4" />
      <div className="h-4 bg-white/6 animate-pulse rounded w-1/2" />
      <div className="h-48 bg-white/6 animate-pulse rounded-xl" />
      <div className="flex gap-4">
        <div className="h-3 bg-white/6 animate-pulse rounded w-12" />
        <div className="h-3 bg-white/6 animate-pulse rounded w-12" />
      </div>
      <div className="border-t border-white/6 pt-4 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-white/6 animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-white/6 animate-pulse rounded w-1/5" />
              <div className="h-3 bg-white/6 animate-pulse rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopSalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        {[2, 1, 3].map((pos) => (
          <div
            key={pos}
            className={`rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-3 ${pos === 1 ? "w-56" : "w-48 mt-8"}`}
          >
            <div className="size-8 bg-white/6 animate-pulse rounded-full mx-auto" />
            <div className="size-16 rounded-full bg-white/6 animate-pulse mx-auto" />
            <div className="h-3 bg-white/6 animate-pulse rounded w-1/2 mx-auto" />
            <div className="h-3 bg-white/6 animate-pulse rounded w-1/3 mx-auto" />
            <div className="h-3 bg-white/6 animate-pulse rounded w-2/3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#0c1e3a]/20 border border-white/4"
          >
            <div
              className="size-6 bg-white/6 animate-pulse rounded"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="size-9 rounded-full bg-white/6 animate-pulse shrink-0"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div className="flex-1 space-y-1.5">
              <div
                className="h-3 bg-white/6 animate-pulse rounded w-1/4"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <div
                className="h-2 bg-white/6 animate-pulse rounded w-1/6"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-12"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div
                  className="h-3 bg-white/6 animate-pulse rounded w-16"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
                <div
                  className="h-6 bg-white/6 animate-pulse rounded w-12"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              </div>
              <div
                className="size-10 rounded-xl bg-white/6 animate-pulse"
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
            className="rounded-2xl bg-[#0c1e3a]/30 border border-white/6 p-5"
          >
            <div className="h-4 bg-white/6 animate-pulse rounded w-32 mb-4" />
            <div className="h-64 bg-white/6 animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="h-8 bg-white/6 animate-pulse rounded w-48" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl bg-[#0c1e3a]/20 border border-white/4"
        >
          <div
            className="size-9 rounded-full bg-white/6 animate-pulse shrink-0"
            style={{ animationDelay: `${i * 40}ms` }}
          />
          <div
            className="flex-1 grid grid-cols-[1.5fr_0.6fr_0.4fr_0.4fr_0.4fr_0.5fr_0.5fr_0.5fr_0.5fr_0.7fr_0.5fr] gap-2"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {Array.from({ length: 11 }).map((_, j) => (
              <div key={j} className="h-3 bg-white/6 animate-pulse rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MemberRowSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#0c1e3a]/20 border border-white/4"
        >
          <div
            className="size-9 rounded-full bg-white/6 animate-pulse shrink-0"
            style={{ animationDelay: `${i * 60}ms` }}
          />
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-1/4"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="h-2 bg-white/6 animate-pulse rounded w-1/5"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
          <div className="flex gap-3">
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-10"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-10"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div
              className="h-3 bg-white/6 animate-pulse rounded w-10"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant resolver                                                  */
/* ------------------------------------------------------------------ */

function resolveVariant(name?: string) {
  if (!name) return "row";
  if (name.startsWith("admin-") && name !== "admin-dashboard")
    return "admin-table";
  switch (name) {
    case "home-feed":
      return "post-card";
    case "home-profile":
      return "profile";
    case "post-detail":
      return "post-detail";
    case "top-sales":
      return "top-sales";
    case "admin-dashboard":
      return "dashboard";
    case "members-page":
    case "referred-section":
      return "member-row";
    default:
      return "row";
  }
}

/* ------------------------------------------------------------------ */
/*  Main Skeleton component                                           */
/* ------------------------------------------------------------------ */

export function Skeleton({
  loading,
  children,
  name,
  rows = 1,
}: {
  loading: boolean;
  children: ReactNode;
  name?: string;

  rows?: number;
}) {
  if (!loading) return <>{children}</>;

  const variant = resolveVariant(name);

  switch (variant) {
    case "admin-table":
      return <AdminTableSkeleton rows={rows} />;
    case "post-card":
      return <PostCardSkeleton rows={rows} />;
    case "profile":
      return <ProfileSkeleton />;
    case "post-detail":
      return <PostDetailSkeleton />;
    case "top-sales":
      return <TopSalesSkeleton />;
    case "dashboard":
      return <DashboardSkeleton />;
    case "member-row":
      return <MemberRowSkeleton rows={rows} />;
    default:
      return (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} delay={i * 80} />
          ))}
        </div>
      );
  }
}
