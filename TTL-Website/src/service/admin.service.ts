import { api } from "@/service/api"

export const adminService = {
  listUsers(page = 1, limit = 20, search?: string) {
    return api.admin.listUsers(page, limit, search)
  },

  getUserById(id: string) {
    return api.admin.getUserById(id)
  },

  updateUserRole(id: string, role: string) {
    return api.admin.updateUserRole(id, role)
  },

  deleteUser(id: string) {
    return api.admin.deleteUser(id)
  },

  getStats() {
    return api.admin.getStats()
  },
}
