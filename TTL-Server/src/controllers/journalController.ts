import { type Request, type Response } from "express"
import { journalService } from "../services/journalService"
import { asyncHandler } from "../lib/asyncHandler"

export const journalController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const entry = await journalService.create(req.user!.userId, req.body)
    res.status(201).json({ entry })
  }),

  getMyEntries: asyncHandler(async (req: Request, res: Response) => {
    const entries = await journalService.getByUser(req.user!.userId)
    res.json({ entries })
  }),

  getByUser: asyncHandler(async (req: Request, res: Response) => {
    const entries = await journalService.getByUser(req.params.userId as string)
    res.json({ entries })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await journalService.delete(req.params.id as string, req.user!.userId)
    res.json(result)
  }),
}
