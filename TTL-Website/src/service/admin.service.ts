import { request } from "./client"
import type { User } from "@/types/auth"
import type {
  AdminUserListResponse,
  AdminStats,
  DashboardResponse,
  ActivityLogResponse,
} from "@/types/admin"
import type { Post } from "@/types/post"
import type { JournalEntry } from "@/types/journal"
import type { Submission } from "@/types/submission"

export const adminService = {
  listUsers(page = 1, limit = 20, search?: string) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (search) params.set("search", search)
    return request<AdminUserListResponse>(`/api/v1/admin/users?${params}`)
  },

  getUserById(id: string) {
    return request<{ user: User }>(`/api/v1/admin/users/${id}`)
  },

  updateUserRole(id: string, role: string) {
    return request<{ user: User }>(`/api/v1/admin/users/${id}/role`, {
      method: "PUT",
      body: { role },
    })
  },

  deleteUser(id: string) {
    return request<{ message: string }>(`/api/v1/admin/users/${id}`, {
      method: "DELETE",
    })
  },

  getStats() {
    return request<AdminStats>("/api/v1/admin/stats")
  },

  getDashboard() {
    return request<DashboardResponse>("/api/v1/admin/dashboard")
  },

  updateUserPermissions(id: string, permissions: string[]) {
    return request<{ user: User }>(`/api/v1/admin/users/${id}/permissions`, {
      method: "PUT",
      body: { permissions },
    })
  },

  blockUser(id: string) {
    return request<{ message: string }>(`/api/v1/admin/users/${id}/block`, {
      method: "POST",
    })
  },

  unblockUser(id: string) {
    return request<{ message: string }>(`/api/v1/admin/users/${id}/unblock`, {
      method: "POST",
    })
  },

  getActivityLog(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    return request<ActivityLogResponse>(`/api/v1/admin/activity-log?${params}`)
  },

  listPosts(page = 1, limit = 20) {
    return request<{
      posts: Post[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/posts?page=${page}&limit=${limit}`)
  },

  listPendingPosts(page = 1, limit = 20) {
    return request<{
      posts: Post[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/posts/pending?page=${page}&limit=${limit}`)
  },

  listApprovedPosts(page = 1, limit = 20) {
    return request<{
      posts: Post[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/posts/approved?page=${page}&limit=${limit}`)
  },

  approvePost(id: string, adminNote?: string) {
    return request<{ post: Post }>(`/api/v1/admin/posts/${id}/approve`, {
      method: "PUT",
      body: { adminNote },
    })
  },

  rejectPost(id: string, adminNote?: string) {
    return request<{ post: Post }>(`/api/v1/admin/posts/${id}/reject`, {
      method: "PUT",
      body: { adminNote },
    })
  },

  deletePost(id: string) {
    return request<{ message: string }>(`/api/v1/admin/posts/${id}`, {
      method: "DELETE",
    })
  },

  listPendingSubmissions(page = 1, limit = 20) {
    return request<{
      submissions: Submission[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/submissions/pending?page=${page}&limit=${limit}`)
  },

  approveSubmission(id: string, adminNote?: string) {
    return request<{ submission: Submission }>(
      `/api/v1/admin/submissions/${id}/approve`,
      { method: "PUT", body: { adminNote } },
    )
  },

  rejectSubmission(id: string, adminNote?: string) {
    return request<{ submission: Submission }>(
      `/api/v1/admin/submissions/${id}/reject`,
      { method: "PUT", body: { adminNote } },
    )
  },

  listPendingJournals(page = 1, limit = 20) {
    return request<{
      entries: JournalEntry[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/journals/pending?page=${page}&limit=${limit}`)
  },

  approveJournal(id: string, adminNote?: string) {
    return request<{ entry: JournalEntry }>(
      `/api/v1/admin/journals/${id}/approve`,
      { method: "PUT", body: { adminNote } },
    )
  },

  rejectJournal(id: string, adminNote?: string) {
    return request<{ entry: JournalEntry }>(
      `/api/v1/admin/journals/${id}/reject`,
      { method: "PUT", body: { adminNote } },
    )
  },
}
