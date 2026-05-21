import { type Request, type Response } from "express"
import { profileService } from "../services/profileService"
import { asyncHandler } from "../lib/asyncHandler"

export const profileController = {
  getPublicProfile: asyncHandler(async (req: Request, res: Response) => {
    const data = await profileService.getPublicProfile(req.params.userId as string, req.user!.userId)
    res.json(data)
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const data = await profileService.getProfile(req.user!.userId)
    res.json(data)
  }),

  getReferredMembers: asyncHandler(async (req: Request, res: Response) => {
    const members = await profileService.getReferredMembers(req.user!.userId)
    res.json({ members })
  }),

  getTopSales: asyncHandler(async (_req: Request, res: Response) => {
    const result = await profileService.getTopSales()
    res.json(result)
  }),

  listMembers: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const result = await profileService.listMembers(page, limit)
    res.json(result)
  }),
}
