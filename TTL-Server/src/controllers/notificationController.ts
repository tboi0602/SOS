import { type Request, type Response } from "express"
import { notificationService } from "../services/notificationService"
import { asyncHandler } from "../lib/asyncHandler"

function p(val: unknown): string {
  return typeof val === "string" ? val : ""
}

export const notificationController = {
  unreadCount: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.unreadCount(req.user!.userId)
    res.json(result)
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50))
    const result = await notificationService.list(req.user!.userId, page, limit)
    res.json(result)
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const n = await notificationService.markRead(p(req.params.id), req.user!.userId)
    res.json({ notification: n })
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.markAllRead(req.user!.userId)
    res.json(result)
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const n = await notificationService.create(req.body)
    res.status(201).json({ notification: n })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.delete(p(req.params.id))
    res.json(result)
  }),
}
