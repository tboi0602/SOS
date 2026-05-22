import { request, uploadFiles } from "./client"
import type { JournalEntry } from "@/types/journal"

export const journalService = {
  getMyEntries(params?: { page?: number; limit?: number; status?: string; dateFrom?: string; dateTo?: string }) {
    const q = new URLSearchParams()
    if (params?.page) q.set("page", String(params.page))
    if (params?.limit) q.set("limit", String(params.limit))
    if (params?.status) q.set("status", params.status)
    if (params?.dateFrom) q.set("dateFrom", params.dateFrom)
    if (params?.dateTo) q.set("dateTo", params.dateTo)
    const query = q.toString()
    return request<{ entries: JournalEntry[]; total: number; page: number; totalPages: number; counts: Record<string, number> }>(
      `/api/v1/journal/me${query ? "?" + query : ""}`,
    )
  },

  getByUser(userId: string) {
    return request<{ entries: JournalEntry[] }>(
      `/api/v1/journal/user/${userId}`,
    )
  },

  uploadMedia(files: File[]) {
    return uploadFiles<{ urls: string[] }>(
      "/api/v1/journal/upload",
      files,
      "files",
    )
  },

  create(data: { title: string; content: string; images?: string[] }) {
    return request<{ entry: JournalEntry }>("/api/v1/journal", {
      method: "POST",
      body: data,
    })
  },

  delete(id: string) {
    return request<{ message: string }>(`/api/v1/journal/${id}`, {
      method: "DELETE",
    })
  },
}
