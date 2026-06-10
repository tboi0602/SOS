import { type Request, type Response, type NextFunction } from "express"
import { membershipService } from "../services/membershipService"

function s(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback
}

function n(val: unknown, fallback = 0): number {
  const parsed = parseInt(s(val), 10)
  return isNaN(parsed) ? fallback : parsed
}

export const membershipController = {
  async getMyFlow(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await membershipService.getMyFlow(req.user!.userId)
      res.json(result)
    } catch (err) { next(err) }
  },

  async uploadDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[]
      const urls = files.map((f) => `/uploads/membership-docs/${f.filename}`)
      const result = await membershipService.uploadDocuments(req.user!.userId, urls.join(","))
      res.json(result)
    } catch (err) { next(err) }
  },

  async confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await membershipService.confirmPayment(req.user!.userId)
      res.json(result)
    } catch (err) { next(err) }
  },

  async getLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await membershipService.getLessons(req.user!.userId)
      res.json({ lessons: result })
    } catch (err) { next(err) }
  },

  async submitLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { productUrl } = req.body
      const result = await membershipService.submitLesson(req.user!.userId, String(req.params.lessonId), productUrl)
      res.json(result)
    } catch (err) { next(err) }
  },

  async getQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await membershipService.getQuiz(req.user!.userId)
      res.json(result)
    } catch (err) { next(err) }
  },

  async submitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { answers } = req.body
      const result = await membershipService.submitQuiz(req.user!.userId, answers ?? {})
      res.json(result)
    } catch (err) { next(err) }
  },

  async getSituations(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await membershipService.getSituations(req.user!.userId)
      res.json(result)
    } catch (err) { next(err) }
  },

  async submitSituations(req: Request, res: Response, next: NextFunction) {
    try {
      const { driveLink } = req.body
      const situationIndex = n(String(req.params.index))
      const result = await membershipService.submitSituations(req.user!.userId, situationIndex, s(driveLink))
      res.json(result)
    } catch (err) { next(err) }
  },
}
