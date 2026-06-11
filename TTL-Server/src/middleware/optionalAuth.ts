import { type Request, type Response, type NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { getDb } from "../db"

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token
    if (!token) return next()

    const payload = verifyToken(token)
    if (!payload) return next()

    const user = await getDb().user.findUnique({
      where: { id: payload.userId },
      select: { tokenVersion: true, role: true, isActive: true, permissions: true },
    })

    if (!user) return next()
    if (payload.tokenVersion < user.tokenVersion) return next()
    if (!user.isActive) return next()

    const permissions = Array.isArray(user.permissions) ? user.permissions as string[] : []
    req.user = { ...payload, role: user.role, permissions }

    next()
  } catch {
    next()
  }
}
