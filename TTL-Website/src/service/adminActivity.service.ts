import { request } from "./client"
import type { ActivityLogResponse } from "@/types/admin"

export const adminActivityService = {
  getActivityLog(page = 1, limit = 50, dateFrom?: string, dateTo?: string, resource?: string) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    if (resource) params.set("resource", resource)
    return request<ActivityLogResponse>(`/api/v1/admin/activity-log?${params}`)
  },

  deleteActivityLog(id: string) {
    return request<{ message: string }>(`/api/v1/admin/activity-log/${id}`, {
      method: "DELETE",
    });
  },

  deleteAllActivityLog() {
    return request<{ message: string; count: number }>("/api/v1/admin/activity-log", {
      method: "DELETE",
    });
  },
}
