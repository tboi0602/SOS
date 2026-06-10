import { type Request, type Response, type NextFunction } from "express"
import { membershipService } from "../services/membershipService"

function s(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback
}

function n(val: unknown, fallback = 0): number {
  const parsed = parseInt(s(val), 10)
  return isNaN(parsed) ? fallback : parsed
}

function pid(req: Request, name: string): string {
  return typeof req.params[name] === "string" ? req.params[name] as string : ""
}

export const adminMembershipController = {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.getSettings()) }
    catch (err) { next(err) }
  },

  async updateFlow(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.updateFlow(req.body)) }
    catch (err) { next(err) }
  },

  async createLesson(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.createLesson(req.body)) }
    catch (err) { next(err) }
  },

  async updateLesson(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.updateLesson(pid(req, "id"), req.body)) }
    catch (err) { next(err) }
  },

  async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.deleteLesson(pid(req, "id"))) }
    catch (err) { next(err) }
  },

  async createQuizQuestion(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.createQuizQuestion(req.body)) }
    catch (err) { next(err) }
  },

  async updateQuizQuestion(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.updateQuizQuestion(pid(req, "id"), req.body)) }
    catch (err) { next(err) }
  },

  async deleteQuizQuestion(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.deleteQuizQuestion(pid(req, "id"))) }
    catch (err) { next(err) }
  },

  async createSituationQuestion(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.createSituationQuestion(req.body)) }
    catch (err) { next(err) }
  },

  async updateSituationQuestion(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.updateSituationQuestion(pid(req, "id"), req.body)) }
    catch (err) { next(err) }
  },

  async deleteSituationQuestion(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.deleteSituationQuestion(pid(req, "id"))) }
    catch (err) { next(err) }
  },

  async getPendingDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, n(req.query.page, 1))
      const limit = Math.min(50, Math.max(1, n(req.query.limit, 20)))
      res.json(await membershipService.getPendingDocs(page, limit))
    } catch (err) { next(err) }
  },

  async getPendingPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, n(req.query.page, 1))
      const limit = Math.min(50, Math.max(1, n(req.query.limit, 20)))
      res.json(await membershipService.getPendingPayments(page, limit))
    } catch (err) { next(err) }
  },

  async getActiveMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, n(req.query.page, 1))
      const limit = Math.min(50, Math.max(1, n(req.query.limit, 20)))
      res.json(await membershipService.getActiveMembers(page, limit))
    } catch (err) { next(err) }
  },

  async approveDocs(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.approveDocs(pid(req, "userId"), req.user!.userId)) }
    catch (err) { next(err) }
  },

  async rejectDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminNote } = req.body
      res.json(await membershipService.rejectDocs(pid(req, "userId"), s(adminNote)))
    } catch (err) { next(err) }
  },

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.verifyPayment(pid(req, "userId"), req.user!.userId)) }
    catch (err) { next(err) }
  },

  async rejectPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminNote } = req.body
      res.json(await membershipService.rejectPayment(pid(req, "userId"), s(adminNote)))
    } catch (err) { next(err) }
  },

  async scoreLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { score, adminNote } = req.body
      res.json(await membershipService.scoreLesson(pid(req, "lessonId"), n(score), s(adminNote) || undefined))
    } catch (err) { next(err) }
  },

  async scoreSituation(req: Request, res: Response, next: NextFunction) {
    try {
      const { score, adminNote } = req.body
      const situationIndex = n(pid(req, "index"))
      res.json(await membershipService.scoreSituation(pid(req, "userId"), situationIndex, n(score), s(adminNote) || undefined))
    } catch (err) { next(err) }
  },

  async completeFlow(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.completeFlow(pid(req, "userId"))) }
    catch (err) { next(err) }
  },

  /* ─── Exam Set CRUD ─── */

  async createExamSet(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.createExamSet(req.body)) }
    catch (err) { next(err) }
  },

  async updateExamSet(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.updateExamSet(pid(req, "id"), req.body)) }
    catch (err) { next(err) }
  },

  async deleteExamSet(req: Request, res: Response, next: NextFunction) {
    try { res.json(await membershipService.deleteExamSet(pid(req, "id"))) }
    catch (err) { next(err) }
  },

  async addQuestionsToExamSet(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionIds } = req.body
      res.json(await membershipService.addQuestionsToExamSet(pid(req, "id"), questionIds ?? []))
    } catch (err) { next(err) }
  },

  async removeQuestionFromExamSet(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await membershipService.removeQuestionFromExamSet(pid(req, "id"), pid(req, "questionId")))
    } catch (err) { next(err) }
  },

  async getExamSets(req: Request, res: Response, next: NextFunction) {
    try {
      const flowId = s(req.query.membershipFlowId) || (await membershipService.getDefaultFlow()).id
      res.json(await membershipService.getExamSets(flowId))
    } catch (err) { next(err) }
  },
}
