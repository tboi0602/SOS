// Legacy barrel — re-exports types for gradual migration.
// New code should import types from "@/types/..." and services from "@/service/..."

export type { User, RegisterData } from "@/types/auth"
export type { Post, Comment, PostListResponse } from "@/types/post"
export type { JournalEntry } from "@/types/journal"
export type { Submission } from "@/types/submission"
export type {
  ProfileResponse,
  MemberInfo,
  MemberListResponse,
  ReferredMember,
  TopSalesResponse,
  PublicProfileResponse,
} from "@/types/profile"
export type {
  AdminUserListResponse,
  AdminStats,
  DashboardResponse,
  DashboardMember,
  ActivityLogEntry,
  ActivityLogResponse,
} from "@/types/admin"
