import { api } from "@/service/api"

export const postService = {
  list(page = 1, limit = 10) {
    return api.posts.list(page, limit)
  },

  myPosts(page = 1, limit = 10) {
    return api.posts.myPosts(page, limit)
  },

  getById(id: string) {
    return api.posts.getById(id)
  },

  create(data: { content: string; images?: string[]; videos?: string[]; productLink?: string | null; hashtags?: string[] }) {
    return api.posts.create(data)
  },

  uploadMedia(files: File[]) {
    return api.posts.uploadMedia(files)
  },

  update(id: string, data: { content?: string; images?: string[]; videos?: string[]; productLink?: string | null; hashtags?: string[] }) {
    return api.posts.update(id, data)
  },

  delete(id: string) {
    return api.posts.delete(id)
  },

  toggleLike(id: string) {
    return api.posts.toggleLike(id)
  },

  addComment(postId: string, content: string) {
    return api.posts.addComment(postId, content)
  },

  deleteComment(postId: string, commentId: string) {
    return api.posts.deleteComment(postId, commentId)
  },
}
