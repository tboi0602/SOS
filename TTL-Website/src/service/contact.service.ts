import { request } from "./client"
import type { ContactFormData } from "@/types/landing"

export async function submitContact(data: ContactFormData): Promise<{ success: boolean }> {
  return request("/api/v1/contact", { method: "POST", body: data })
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export const adminContactService = {
  list(page = 1, limit = 20) {
    return request<{ messages: ContactMessage[]; total: number; page: number; totalPages: number }>(
      `/api/v1/contact?page=${page}&limit=${limit}`,
    )
  },

  markRead(id: string) {
    return request<{ message: ContactMessage }>(`/api/v1/contact/${id}/read`, { method: "PUT" })
  },

  delete(id: string) {
    return request<{ message: string }>(`/api/v1/contact/${id}`, { method: "DELETE" })
  },
}
