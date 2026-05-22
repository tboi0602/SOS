import { request } from "./client"
import type { ProfileResponse, PublicProfileResponse, MemberListResponse, ReferredMember, TopSalesResponse } from "@/types/profile"

export const profileService = {
  getProfile() {
    return request<ProfileResponse>("/api/v1/profile")
  },

  getPublicProfile(userId: string) {
    return request<PublicProfileResponse>(`/api/v1/profile/public/${userId}`)
  },

  listMembers(page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    return request<MemberListResponse>(`/api/v1/profile/members?${params}`)
  },

  getReferredMembers() {
    return request<{ members: ReferredMember[] }>(
      "/api/v1/profile/referred-members",
    )
  },

  getTopSales() {
    return request<TopSalesResponse>("/api/v1/profile/top-sales")
  },
}
