import type { User } from "./auth";

export interface AdminUserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
}

export interface DashboardMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  job: string | null;
  isActive: boolean;
  permissions: string[];
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  totalScore: number;
  postCount: number;
  submissionCount: number;
  journalCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  members: DashboardMember[];
  total: number;
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  metadata: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  user: Pick<User, "id" | "name" | "email" | "avatar"> | null;
}

export interface ActivityLogResponse {
  logs: ActivityLogEntry[];
  total: number;
  page: number;
  totalPages: number;
}
