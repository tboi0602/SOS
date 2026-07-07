import { request } from "./client"
import type {
  MembershipSettings,
  LessonDef,
  QuizQuestionDef,
  SituationQuestionDef,
  UserFlow,
  QuizExamSetDef,
  UserLesson,
} from "./membership.service"

export const adminMembershipService = {
  getMembershipSettings() {
    return request<MembershipSettings>(
      "/api/v1/admin/membership-flow/settings",
    )
  },

  updateMembershipFlow(settings: { name: string; price: number; rules?: string }) {
    return request("/api/v1/admin/membership-flow/settings", {
      method: "PUT",
      body: settings,
    })
  },

  createLesson(data: Omit<LessonDef, "id">) {
    return request("/api/v1/admin/membership-flow/lessons", {
      method: "POST",
      body: data,
    })
  },

  updateLesson(id: string, data: Partial<LessonDef>) {
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

  createQuizQuestion(data: Omit<QuizQuestionDef, "id">) {
    return request("/api/v1/admin/membership-flow/quiz-questions", {
      method: "POST",
      body: data,
    })
  },

  updateQuizQuestion(id: string, data: Partial<QuizQuestionDef>) {
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

  createSituationQuestion(data: Omit<SituationQuestionDef, "id">) {
    return request("/api/v1/admin/membership-flow/situation-questions", {
      method: "POST",
      body: data,
    })
  },

  updateSituationQuestion(id: string, data: Partial<SituationQuestionDef>) {
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
        user: { id: string; name: string; email: string }
        flow: UserFlow
      }[]
      total: number
      page: number
      totalPages: number
    }>(`/api/v1/admin/membership-flow/pending-docs?page=${page}&limit=${limit}`)
  },

  getAllFlows(page = 1, limit = 20, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set("search", search)
    return request<{
      users: (UserFlow & { user: { id: string; name: string; email: string; avatar: string | null }; membershipFlow: { name: string; price: number } })[]
      total: number; page: number; totalPages: number
    }>(`/api/v1/admin/membership-flow/all-flows?${params}`)
  },

  getPendingPayments(page = 1, limit = 20) {
    return request<{
      users: (UserFlow & { user: { id: string; name: string; email: string } })[]
      total: number
      page: number
      totalPages: number
    }>(`/api/v1/admin/membership-flow/pending-payments?page=${page}&limit=${limit}`)
  },

  getActiveMembers(page = 1, limit = 20, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set("search", search)
    return request<{
      users: (UserFlow & { user: { id: string; name: string; email: string } })[]
      total: number
      page: number
      totalPages: number
    }>(`/api/v1/admin/membership-flow/active?${params}`)
  },

  getUserLessons(userId: string) {
    return request<{ lessons: UserLesson[] }>(`/api/v1/admin/membership-flow/users/${userId}/lessons`)
  },

  approveDocs(userId: string) {
    return request(`/api/v1/admin/membership-flow/${userId}/approve-docs`, {
      method: "PUT",
    })
  },

  rejectDocs(userId: string, adminNote: string) {
    return request(`/api/v1/admin/membership-flow/${userId}/reject-docs`, {
      method: "PUT",
      body: { adminNote },
    })
  },

  verifyPayment(userId: string) {
    return request(`/api/v1/admin/membership-flow/${userId}/verify-payment`, {
      method: "PUT",
    })
  },

  rejectPayment(userId: string, adminNote: string) {
    return request(`/api/v1/admin/membership-flow/${userId}/reject-payment`, {
      method: "PUT",
      body: { adminNote },
    })
  },

  scoreLesson(lessonId: string, score: number, adminNote?: string) {
    return request(`/api/v1/admin/membership-flow/score-lesson/${lessonId}`, {
      method: "PUT",
      body: { score, adminNote },
    })
  },

  scoreSituation(userId: string, index: number, score: number, adminNote?: string) {
    return request(`/api/v1/admin/membership-flow/score-situation/${userId}/${index}`, {
      method: "PUT",
      body: { score, adminNote },
    })
  },

  completeFlow(userId: string) {
    return request(`/api/v1/admin/membership-flow/${userId}/complete`, {
      method: "PUT",
    })
  },

  getExamSets(flowId?: string) {
    const params = flowId ? `?membershipFlowId=${flowId}` : ""
    return request<QuizExamSetDef[]>(
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
}
