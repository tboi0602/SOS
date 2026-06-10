import { request } from "./client"
import type { User } from "@/types/auth"
import type {
  AdminUserListResponse,
  AdminStats,
  DashboardResponse,
  ActivityLogResponse,
} from "@/types/admin"
import type { Post } from "@/types/post"
import type { JournalEntry } from "@/types/journal"
import type { Submission } from "@/types/submission"

export const adminService = {
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

  getActivityLog(page = 1, limit = 50, dateFrom?: string, dateTo?: string, action?: string) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    if (action) params.set("action", action)
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

  listPosts(page = 1, limit = 20) {
    return request<{
      posts: Post[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/posts?page=${page}&limit=${limit}`)
  },

  listPendingPosts(page = 1, limit = 20) {
    return request<{
      posts: Post[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/posts/pending?page=${page}&limit=${limit}`)
  },

  listApprovedPosts(page = 1, limit = 20) {
    return request<{
      posts: Post[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/posts/approved?page=${page}&limit=${limit}`)
  },

  approvePost(id: string, adminNote?: string) {
    return request<{ post: Post }>(`/api/v1/admin/posts/${id}/approve`, {
      method: "PUT",
      body: { adminNote },
    })
  },

  rejectPost(id: string, adminNote?: string) {
    return request<{ post: Post }>(`/api/v1/admin/posts/${id}/reject`, {
      method: "PUT",
      body: { adminNote },
    })
  },

  deletePost(id: string) {
    return request<{ message: string }>(`/api/v1/admin/posts/${id}`, {
      method: "DELETE",
    })
  },

  listPendingSubmissions(page = 1, limit = 20) {
    return request<{
      submissions: Submission[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/submissions/pending?page=${page}&limit=${limit}`)
  },

  approveSubmission(id: string, adminNote?: string) {
    return request<{ submission: Submission }>(
      `/api/v1/admin/submissions/${id}/approve`,
      { method: "PUT", body: { adminNote } },
    )
  },

  rejectSubmission(id: string, adminNote?: string) {
    return request<{ submission: Submission }>(
      `/api/v1/admin/submissions/${id}/reject`,
      { method: "PUT", body: { adminNote } },
    )
  },

  listPendingJournals(page = 1, limit = 20) {
    return request<{
      entries: JournalEntry[]
      total: number
      page: number
      limit: number
    }>(`/api/v1/admin/journals/pending?page=${page}&limit=${limit}`)
  },

  approveJournal(id: string, adminNote?: string) {
    return request<{ entry: JournalEntry }>(
      `/api/v1/admin/journals/${id}/approve`,
      { method: "PUT", body: { adminNote } },
    )
  },

  rejectJournal(id: string, adminNote?: string) {
    return request<{ entry: JournalEntry }>(
      `/api/v1/admin/journals/${id}/reject`,
      { method: "PUT", body: { adminNote } },
    )
  },

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

  /* ─── Membership Flow (Admin) ─── */

  getMembershipSettings() {
    return request<import("./membership.service").MembershipSettings>(
      "/api/v1/admin/membership-flow/settings",
    )
  },

  updateMembershipFlow(settings: { name: string; price: number; rules?: string }) {
    return request("/api/v1/admin/membership-flow/settings", {
      method: "PUT",
      body: settings,
    })
  },

  createLesson(
    data: Omit<import("./membership.service").LessonDef, "id">,
  ) {
    return request("/api/v1/admin/membership-flow/lessons", {
      method: "POST",
      body: data,
    })
  },

  updateLesson(id: string, data: Partial<import("./membership.service").LessonDef>) {
    return request(`/api/v1/admin/membership-flow/lessons/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  deleteLesson(id: string) {
    return request(`/api/v1/admin/membership-flow/lessons/${id}`, {
      method: "DELETE",
    })
  },

  createQuizQuestion(
    data: Omit<import("./membership.service").QuizQuestionDef, "id">,
  ) {
    return request("/api/v1/admin/membership-flow/quiz-questions", {
      method: "POST",
      body: data,
    })
  },

  updateQuizQuestion(
    id: string,
    data: Partial<import("./membership.service").QuizQuestionDef>,
  ) {
    return request(`/api/v1/admin/membership-flow/quiz-questions/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  deleteQuizQuestion(id: string) {
    return request(`/api/v1/admin/membership-flow/quiz-questions/${id}`, {
      method: "DELETE",
    })
  },

  createSituationQuestion(
    data: Omit<import("./membership.service").SituationQuestionDef, "id">,
  ) {
    return request("/api/v1/admin/membership-flow/situation-questions", {
      method: "POST",
      body: data,
    })
  },

  updateSituationQuestion(
    id: string,
    data: Partial<import("./membership.service").SituationQuestionDef>,
  ) {
    return request(`/api/v1/admin/membership-flow/situation-questions/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  deleteSituationQuestion(id: string) {
    return request(`/api/v1/admin/membership-flow/situation-questions/${id}`, {
      method: "DELETE",
    })
  },

  getPendingDocs(page = 1, limit = 20) {
    return request<{
      users: {
        user: { id: string; name: string; email: string; memberId: string | null }
        flow: import("./membership.service").UserFlow
      }[]
      total: number
      page: number
      totalPages: number
    }>(`/api/v1/admin/membership-flow/pending-docs?page=${page}&limit=${limit}`)
  },

  getPendingPayments(page = 1, limit = 20) {
    return request<{
      users: {
        user: { id: string; name: string; email: string; memberId: string | null }
        flow: import("./membership.service").UserFlow
      }[]
      total: number
      page: number
      totalPages: number
    }>(`/api/v1/admin/membership-flow/pending-payments?page=${page}&limit=${limit}`)
  },

  getActiveMembers(page = 1, limit = 20) {
    return request<{
      users: {
        user: { id: string; name: string; email: string; memberId: string | null }
        flow: import("./membership.service").UserFlow
      }[]
      total: number
      page: number
      totalPages: number
    }>(`/api/v1/admin/membership-flow/active-members?page=${page}&limit=${limit}`)
  },

  approveDocs(userId: string) {
    return request(`/api/v1/admin/membership-flow/docs/${userId}/approve`, {
      method: "POST",
    })
  },

  rejectDocs(userId: string, adminNote: string) {
    return request(`/api/v1/admin/membership-flow/docs/${userId}/reject`, {
      method: "POST",
      body: { adminNote },
    })
  },

  verifyPayment(userId: string) {
    return request(`/api/v1/admin/membership-flow/payment/${userId}/verify`, {
      method: "POST",
    })
  },

  rejectPayment(userId: string, adminNote: string) {
    return request(`/api/v1/admin/membership-flow/payment/${userId}/reject`, {
      method: "POST",
      body: { adminNote },
    })
  },

  scoreLesson(lessonId: string, score: number, adminNote?: string) {
    return request(`/api/v1/admin/membership-flow/lessons/${lessonId}/score`, {
      method: "POST",
      body: { score, adminNote },
    })
  },

  scoreSituation(userId: string, index: number, score: number, adminNote?: string) {
    return request(`/api/v1/admin/membership-flow/situations/${userId}/score`, {
      method: "POST",
      body: { index, score, adminNote },
    })
  },

  completeFlow(userId: string) {
    return request(`/api/v1/admin/membership-flow/${userId}/complete`, {
      method: "POST",
    })
  },

  /* ─── Exam Set CRUD ─── */

  getExamSets(flowId?: string) {
    const params = flowId ? `?membershipFlowId=${flowId}` : ""
    return request<import("./membership.service").QuizExamSetDef[]>(
      `/api/v1/admin/membership-flow/exam-sets${params}`,
    )
  },

  createExamSet(data: {
    membershipFlowId: string
    name: string
    passScore?: number
    questionIds?: string[]
  }) {
    return request("/api/v1/admin/membership-flow/exam-sets", {
      method: "POST",
      body: data,
    })
  },

  updateExamSet(id: string, data: { name?: string; passScore?: number }) {
    return request(`/api/v1/admin/membership-flow/exam-sets/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  deleteExamSet(id: string) {
    return request(`/api/v1/admin/membership-flow/exam-sets/${id}`, {
      method: "DELETE",
    })
  },

  addExamSetQuestions(examSetId: string, questionIds: string[]) {
    return request(`/api/v1/admin/membership-flow/exam-sets/${examSetId}/questions`, {
      method: "POST",
      body: { questionIds },
    })
  },

  removeExamSetQuestion(examSetId: string, questionId: string) {
    return request(
      `/api/v1/admin/membership-flow/exam-sets/${examSetId}/questions/${questionId}`,
      { method: "DELETE" },
    )
  },

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
