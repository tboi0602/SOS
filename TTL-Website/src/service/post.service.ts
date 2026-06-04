import { request, uploadFiles } from "./client"
import type { Post, PostListResponse, Comment } from "@/types/post"

export const postService = {
  list(page = 1, limit = 10) {
    return request<PostListResponse>(
      `/api/v1/posts?page=${page}&limit=${limit}`,
    )
  },

  myPosts(params?: { page?: number; limit?: number; status?: string; dateFrom?: string; dateTo?: string }) {
    const q = new URLSearchParams()
    if (params?.page) q.set("page", String(params.page))
    if (params?.limit) q.set("limit", String(params.limit))
    if (params?.status) q.set("status", params.status)
    if (params?.dateFrom) q.set("dateFrom", params.dateFrom)
    if (params?.dateTo) q.set("dateTo", params.dateTo)
    const query = q.toString()
    const url = `/api/v1/posts/my-posts${query ? "?" + query : ""}`
    return request<PostListResponse & { counts?: Record<string, number> }>(url)
  },

  getById(id: string) {
    return request<{ post: Post }>(`/api/v1/posts/${id}`)
  },

  search(q: string) {
    const params = new URLSearchParams({ q })
    return request<{ posts: Post[]; total: number }>(
      `/api/v1/posts/search?${params}`,
    )
  },

  create(data: {
    content: string
    images?: string[]
    videos?: string[]
    productLink?: string | null
    hashtags?: string[]
  }) {
    return request<{ post: Post }>("/api/v1/posts", {
      method: "POST",
      body: data,
    })
  },

  uploadMedia(files: File[]) {
    return uploadFiles<{ urls: string[] }>("/api/v1/posts/upload", files, "files")
  },

  update(
    id: string,
    data: {
      content?: string
      images?: string[]
      videos?: string[]
      productLink?: string | null
      hashtags?: string[]
    },
  ) {
    return request<{ post: Post }>(`/api/v1/posts/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  delete(id: string) {
    return request<{ message: string }>(`/api/v1/posts/${id}`, {
      method: "DELETE",
    })
  },

  toggleLike(id: string) {
    return request<{ liked: boolean }>(`/api/v1/posts/${id}/like`, {
      method: "POST",
    })
  },

  addComment(postId: string, content: string) {
    return request<{ comment: Comment }>(
      `/api/v1/posts/${postId}/comments`,
      { method: "POST", body: { content } },
    )
  },

  getNews(page = 1, limit = 20) {
    return request<PostListResponse>(`/api/v1/posts/news?page=${page}&limit=${limit}`);
  },

  deleteComment(postId: string, commentId: string) {
    return request<{ message: string }>(
      `/api/v1/posts/${postId}/comments/${commentId}`,
      { method: "DELETE" },
    )
  },
}
