import { type Request, type Response, type NextFunction } from "express"
import { signToken, verifyToken } from "../utils/jwt"
import { getDb } from "../db"

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 2 * 60 * 60 * 1000,
}

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

    // Token rotation
    const newVersion = user.tokenVersion + 1
    const newToken = signToken({
      userId: payload.userId,
      email: payload.email,
      tokenVersion: newVersion,
      role: user.role,
      permissions,
    })
    res.cookie("token", newToken, COOKIE_OPTIONS)

    res.on("finish", () => {
      getDb().user
        .updateMany({
          where: { id: payload.userId, tokenVersion: user.tokenVersion },
          data: { tokenVersion: newVersion },
        })
        .catch(() => {})
    })

    next()
  } catch {
    next()
  }
}
