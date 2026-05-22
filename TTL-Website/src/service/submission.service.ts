import { request } from "./client"
import type { Submission } from "@/types/submission"

export const submissionService = {
  create(data: { title: string; videoUrl?: string; note?: string }) {
    return request<{ submission: Submission }>("/api/v1/submissions", {
      method: "POST",
      body: data,
    })
  },

  getMySubmissions(params?: { page?: number; limit?: number; status?: string; dateFrom?: string; dateTo?: string }) {
    const q = new URLSearchParams()
    if (params?.page) q.set("page", String(params.page))
    if (params?.limit) q.set("limit", String(params.limit))
    if (params?.status) q.set("status", params.status)
    if (params?.dateFrom) q.set("dateFrom", params.dateFrom)
    if (params?.dateTo) q.set("dateTo", params.dateTo)
    const query = q.toString()
    return request<{ submissions: Submission[]; total: number; page: number; totalPages: number; counts: Record<string, number> }>(
      `/api/v1/submissions/me${query ? "?" + query : ""}`,
    )
  },

  delete(id: string) {
    return request<{ message: string }>(`/api/v1/submissions/${id}`, {
      method: "DELETE",
    })
  },

  checkPenalty() {
    return request<{
      penalized: boolean
      daysOverdue: number
      deducted?: number
    }>("/api/v1/submissions/penalty")
  },
}
