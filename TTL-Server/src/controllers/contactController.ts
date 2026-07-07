import { type Request, type Response } from "express"
import { contactService } from "../services/contactService"
import { asyncHandler } from "../lib/asyncHandler"
import { s } from "../lib/s"

export const contactController = {
  submit: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body
    await contactService.create({ name, email, phone, message })
    res.json({ success: true })
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(s(req.query.page, "1")) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(s(req.query.limit ?? "", "20")) || 20))
    const result = await contactService.list(page, limit)
    res.json(result)
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const msg = await contactService.markRead(s(req.params.id))
    res.json({ message: msg })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await contactService.delete(s(req.params.id))
    res.json(result)
  }),
}
