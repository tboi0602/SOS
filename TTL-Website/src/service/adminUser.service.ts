import { request } from "./client"
import type { User } from "@/types/auth"
import type {
  AdminUserListResponse,
  AdminStats,
  DashboardResponse,
} from "@/types/admin"

export const adminUserService = {
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
}
