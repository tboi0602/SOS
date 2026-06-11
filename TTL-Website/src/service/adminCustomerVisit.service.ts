import { request } from "./client"

export interface CustomerVisitImageAdmin {
  id: string
  userId: string
  imageUrl: string
  description: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  adminNote: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  user: { id: string; name: string; email: string }
  reviewer: { id: string; name: string } | null
}

export const adminCustomerVisitService = {
  listCustomerVisitImages(status?: string) {
    const params = status ? `?status=${status}` : "";
    return request<{
      images: CustomerVisitImageAdmin[]
    }>(`/api/v1/customer-visits/admin${params}`)
  },

  reviewCustomerVisitImage(id: string, status: "APPROVED" | "REJECTED", adminNote?: string) {
    return request<{ image: CustomerVisitImageAdmin }>(
      `/api/v1/customer-visits/${id}/review`,
      { method: "PUT", body: { status, adminNote } },
    )
  },
}
