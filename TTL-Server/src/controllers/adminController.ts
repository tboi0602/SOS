import { type Request, type Response, type NextFunction } from "express"
import { adminService } from "../services/adminService"

function s(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback
}

export const adminController = {
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(s(req.query.page, "1")) || 1)
      const limit = Math.min(50, Math.max(1, parseInt(s(req.query.limit, "20")) || 20))
      const search = s(req.query.search, "") || undefined
      const result = await adminService.listUsers(page, limit, search)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.getUserById(s(req.params.id))
      res.json({ user })
    } catch (err) {
      next(err)
    }
  },

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.updateUserRole(s(req.params.id), req.body.role)
      res.json({ user })
    } catch (err) {
      next(err)
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.deleteUser(s(req.params.id))
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getStats()
      res.json(stats)
    } catch (err) {
      next(err)
    }
  },
}
