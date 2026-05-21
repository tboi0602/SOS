import { type Request, type Response } from "express"
import { postService } from "../services/postService"
import { asyncHandler } from "../lib/asyncHandler"
import { getDb } from "../db"

export const postController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.create(req.user!.userId, req.body)
    res.status(201).json({ post })
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10))
    const result = await postService.getAll(req.user!.userId, page, limit)
    res.json(result)
  }),

  getMyPosts: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10))
    const result = await postService.getMyPosts(req.user!.userId, page, limit)
    res.json(result)
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.getById(req.params.id as string, req.user!.userId)
    res.json({ post })
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const q = String(req.query.q || "")
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        where: { content: { contains: q, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { id: true, name: true, email: true } }, likes: { select: { userId: true } }, comments: { select: { id: true, userId: true, content: true, createdAt: true }, orderBy: { createdAt: "asc" } } },
      }),
      getDb().post.count({ where: { content: { contains: q, mode: "insensitive" } } }),
    ])
    const formatted = posts.map((p: any) => ({
      id: p.id,
      userId: p.userId,
      user: p.user,
      content: p.content,
      images: p.images,
      videos: p.videos ?? [],
      productLink: p.productLink,
      hashtags: p.hashtags ?? [],
      likeCount: p.likes.length,
      commentCount: p.comments.length,
      liked: p.likes.some((l: any) => l.userId === req.user!.userId),
      comments: p.comments.map((c: any) => ({ ...c, isOwner: c.userId === req.user!.userId })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))
    res.json({ posts: formatted, total })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.update(req.params.id as string, req.user!.userId, req.body)
    res.json({ post })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await postService.delete(req.params.id as string, req.user!.userId)
    res.json(result)
  }),

  toggleLike: asyncHandler(async (req: Request, res: Response) => {
    const result = await postService.toggleLike(req.params.id as string, req.user!.userId)
    res.json(result)
  }),

  addComment: asyncHandler(async (req: Request, res: Response) => {
    const comment = await postService.addComment(req.params.id as string, req.user!.userId, req.body.content)
    res.status(201).json({ comment })
  }),

  deleteComment: asyncHandler(async (req: Request, res: Response) => {
    const result = await postService.deleteComment(req.params.commentId as string, req.user!.userId)
    res.json(result)
  }),

  uploadMedia: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as any[]
    if (!files || files.length === 0) {
      res.status(400).json({ error: "Vui lòng chọn file" })
      return
    }
    const urls = files.map((file) => `/uploads/posts/${file.filename}`)
    res.json({ urls })
  }),
}
