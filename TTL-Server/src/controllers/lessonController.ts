import { type Request, type Response } from "express"
import { lessonService } from "../services/lessonService"
import { asyncHandler } from "../lib/asyncHandler"

function p(val: unknown): string {
  return typeof val === "string" ? val : ""
}

export const lessonController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50))
    const result = await lessonService.list(page, limit)
    res.json(result)
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const lesson = await lessonService.getById(p(req.params.id))
    res.json({ lesson })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const lesson = await lessonService.create(req.body)
    res.status(201).json({ lesson })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const lesson = await lessonService.update(p(req.params.id), req.body)
    res.json({ lesson })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await lessonService.delete(p(req.params.id))
    res.json(result)
  }),

  uploadMedia: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as any[]
    if (!files || files.length === 0) {
      res.status(400).json({ error: "Vui lòng chọn file" })
      return
    }
    const urls = files.map((file) => `/uploads/lessons/${file.filename}`)
    res.json({ urls })
  }),
}
