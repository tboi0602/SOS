import { z } from "zod"

export const createPostSchema = z.object({
  content: z.string().min(1, "Nội dung không được để trống").max(5000, "Nội dung quá dài"),
  images: z.array(z.string()).max(10, "Tối đa 10 ảnh").optional(),
  videos: z.array(z.string()).max(5, "Tối đa 5 video").optional(),
  productLink: z.string().url("Link sản phẩm không hợp lệ").max(500).nullable().optional(),
  hashtags: z.array(z.string().max(50)).max(10, "Tối đa 10 hashtag").optional(),
})

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  images: z.array(z.string()).max(10).optional(),
  videos: z.array(z.string()).max(5).optional(),
  productLink: z.string().url().max(500).nullable().optional(),
  hashtags: z.array(z.string().max(50)).max(10).optional(),
})

export const postIdSchema = z.object({
  id: z.string().uuid("ID bài viết không hợp lệ"),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, "Nội dung bình luận không được để trống").max(1000, "Bình luận quá dài"),
})
