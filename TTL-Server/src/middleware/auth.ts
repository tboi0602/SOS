import { type Request, type Response, type NextFunction } from "express"
import { signToken, verifyToken, type JwtPayload } from "../utils/jwt"
import { getDb } from "../db"
import { UnauthorizedError, ForbiddenError } from "../lib/errors"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 2 * 60 * 60 * 1000,
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token
    if (!token) {
      throw new UnauthorizedError("Vui lòng đăng nhập", "NO_TOKEN")
    }

    const payload = verifyToken(token)
    if (!payload) {
      throw new UnauthorizedError("Phiên đăng nhập hết hạn", "TOKEN_EXPIRED")
    }

    const user = await getDb().user.findUnique({
      where: { id: payload.userId },
      select: { tokenVersion: true, role: true, isActive: true, permissions: true },
    })

    if (!user) {
      throw new UnauthorizedError("Người dùng không tồn tại", "USER_NOT_FOUND")
    }

    if (payload.tokenVersion < user.tokenVersion) {
      throw new ForbiddenError("Phiên đăng nhập đã bị vô hiệu hoá", "TOKEN_REVOKED")
    }

    if (!user.isActive) {
      throw new ForbiddenError("Tài khoản đã bị vô hiệu hoá", "ACCOUNT_DISABLED")
    }

    const permissions = Array.isArray(user.permissions) ? user.permissions as string[] : []
    req.user = { ...payload, role: user.role, permissions }

    // Token rotation: mỗi request tiêu thụ token cũ, trả token mới
    const newVersion = user.tokenVersion + 1
    const newToken = signToken({
      userId: payload.userId,
      email: payload.email,
      tokenVersion: newVersion,
      role: user.role,
      permissions,
    })
    res.cookie("token", newToken, COOKIE_OPTIONS)

    // Bump version sau khi response đã gửi — tránh race condition giữa các request đồng thời
    res.on("finish", () => {
      getDb().user
        .updateMany({
          where: { id: payload.userId, tokenVersion: user.tokenVersion },
          data: { tokenVersion: newVersion },
        })
        .catch(() => {})
    })

    next()
  } catch (err) {
    next(err)
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return next(new ForbiddenError("Bạn không có quyền truy cập", "FORBIDDEN"))
  }
  next()
}

export function requireAdminOrPermission(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role === "admin") return next()
  if (req.user?.permissions && req.user.permissions.length > 0) return next()
  return next(new ForbiddenError("Bạn không có quyền truy cập", "FORBIDDEN"))
}

export function requirePermission(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.role === "admin") return next()
    const hasAll = permissions.every((p) => req.user?.permissions?.includes(p))
    if (!hasAll) {
      return next(new ForbiddenError("Bạn không có quyền thực hiện hành động này", "FORBIDDEN"))
    }
    next()
  }
}
