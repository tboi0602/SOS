import { type Request, type Response } from "express"
import { submissionService } from "../services/submissionService"
import { asyncHandler } from "../lib/asyncHandler"

export const submissionController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const submission = await submissionService.create(req.user!.userId, req.body)
    res.status(201).json({ submission })
  }),

  getMySubmissions: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10))
    const status = req.query.status as string | undefined
    const dateFrom = req.query.dateFrom as string | undefined
    const dateTo = req.query.dateTo as string | undefined
    const result = await submissionService.getMySubmissions(req.user!.userId, page, limit, status, dateFrom, dateTo)
    res.json(result)
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await submissionService.delete(req.params.id as string, req.user!.userId)
    res.json(result)
  }),

  checkPenalty: asyncHandler(async (req: Request, res: Response) => {
    const result = await submissionService.checkPenalty(req.user!.userId)
    res.json(result)
  }),

  listPending: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const result = await submissionService.listPending(page, limit)
    res.json(result)
  }),

  listApproved: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const result = await submissionService.listApproved(page, limit)
    res.json(result)
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const submission = await submissionService.approve(req.params.id as string, req.body.adminNote, req.user?.userId)
    res.json({ submission })
  }),

  reject: asyncHandler(async (req: Request, res: Response) => {
    const submission = await submissionService.reject(req.params.id as string, req.body.adminNote, req.user?.userId)
    res.json({ submission })
  }),
}
