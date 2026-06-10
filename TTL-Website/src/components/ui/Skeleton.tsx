"use client";

import { type ReactNode } from "react";
import { SkeletonRow } from "./skeletons/SkeletonRow"
import { AdminTableSkeleton } from "./skeletons/AdminTableSkeleton"
import { PostCardSkeleton } from "./skeletons/PostCardSkeleton"
import { ProfileSkeleton } from "./skeletons/ProfileSkeleton"
import { PostDetailSkeleton } from "./skeletons/PostDetailSkeleton"
import { TopSalesSkeleton } from "./skeletons/TopSalesSkeleton"
import { DashboardSkeleton } from "./skeletons/DashboardSkeleton"
import { MemberRowSkeleton } from "./skeletons/MemberRowSkeleton"
import { resolveVariant } from "./skeletons/variantResolver"

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
