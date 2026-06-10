import { request } from "./client"

export interface CustomerVisitImageAdmin {
  id: string
  userId: string
  imageUrl: string
  description: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  user: { id: string; name: string; email: string; memberId: string | null }
  reviewer: { id: string; name: string } | null
}

export const adminCustomerVisitService = {
  listCustomerVisitImages(status?: string) {
    const params = status ? `?status=${status}` : "";
    return request<{
      images: CustomerVisitImageAdmin[]
    }>(`/api/v1/customer-visits/admin${params}`)
  },

  reviewCustomerVisitImage(id: string, status: "APPROVED" | "REJECTED") {
    return request<{ image: CustomerVisitImageAdmin }>(
      `/api/v1/customer-visits/${id}/review`,
      { method: "PUT", body: { status } },
    )
  },
}
