import { type Request, type Response } from "express"
import { journalService } from "../services/journalService"
import { asyncHandler } from "../lib/asyncHandler"

export const journalController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const entry = await journalService.create(req.user!.userId, req.body)
    res.status(201).json({ entry })
  }),

  getMyEntries: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10))
    const status = req.query.status as string | undefined
    const dateFrom = req.query.dateFrom as string | undefined
    const dateTo = req.query.dateTo as string | undefined
    const result = await journalService.getByUser(req.user!.userId, page, limit, status, dateFrom, dateTo)
    res.json(result)
  }),

  getByUser: asyncHandler(async (req: Request, res: Response) => {
    const entries = await journalService.getByUser(req.params.userId as string)
    res.json({ entries })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await journalService.delete(req.params.id as string, req.user!.userId)
    res.json(result)
  }),

  listPending: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const result = await journalService.listPending(page, limit)
    res.json(result)
  }),

  listApproved: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const result = await journalService.listApproved(page, limit)
    res.json(result)
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const entry = await journalService.approve(req.params.id as string, req.body.adminNote, req.user?.userId)
    res.json({ entry })
  }),

  reject: asyncHandler(async (req: Request, res: Response) => {
    const entry = await journalService.reject(req.params.id as string, req.body.adminNote, req.user?.userId)
    res.json({ entry })
  }),
}
