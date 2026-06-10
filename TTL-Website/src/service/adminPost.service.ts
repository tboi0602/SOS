import { request } from "./client"
import type { Post } from "@/types/post"
import type { JournalEntry } from "@/types/journal"
import type { Submission } from "@/types/submission"

export const adminPostService = {
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
}
