import { request } from "./client"

export interface PendingMember {
  id: string
  name: string
  email: string
  avatar: string | null
  memberId: string | null
  pendingCounts: {
    posts: number
    journals: number
    submissions: number
    customerVisits: number
  }
  totalPending: number
}

export interface PendingMembersResponse {
  members: PendingMember[]
  total: number
  page: number
  totalPages: number
}

export interface PendingItem {
  id: string
  itemType: "post" | "journal" | "submission" | "customer-visit"
  title: string
  content?: string
  description?: string
  imageUrl?: string
  createdAt: string
  status: string
}

export interface PendingItemsResponse {
  items: PendingItem[]
  total: number
  page: number
  totalPages: number
}

export const adminPendingMemberService = {
  getPendingMembers(page = 1, limit = 20) {
    return request<PendingMembersResponse>(
      `/api/v1/admin/pending-members?page=${page}&limit=${limit}`,
    )
  },

  getUserPendingItems(userId: string, filterType?: string, page = 1, limit = 20) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (filterType) params.set("type", filterType)
    return request<PendingItemsResponse>(
      `/api/v1/admin/pending-members/${userId}/items?${params}`,
    )
  },
}
