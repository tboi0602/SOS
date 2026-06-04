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
      const result = await adminService.listUsers(page, limit, search, req.user?.userId)
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

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getDashboard(req.user?.userId)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async updateUserPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.updateUserPermissions(s(req.params.id), req.body.permissions, req.user?.userId)
      res.json({ user })
    } catch (err) {
      next(err)
    }
  },

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.blockUser(s(req.params.id), req.user?.userId)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.unblockUser(s(req.params.id), req.user?.userId)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async getActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(s(req.query.page, "1")) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(s(req.query.limit, "50")) || 50))
      const dateFrom = s(req.query.dateFrom) || undefined
      const dateTo = s(req.query.dateTo) || undefined
      const action = s(req.query.action) || undefined
      const result = await adminService.getActivityLog(page, limit, dateFrom, dateTo, action)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async deleteActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.deleteActivityLog(s(req.params.id))
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async deleteAllActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.deleteAllActivityLog()
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
}
