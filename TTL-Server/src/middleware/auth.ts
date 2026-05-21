import { type Request, type Response, type NextFunction } from "express"
import { verifyToken, type JwtPayload } from "../utils/jwt"
import { getDb } from "../db"
import { UnauthorizedError, ForbiddenError } from "../lib/errors"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
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
      select: { tokenVersion: true, role: true },
    })

    if (!user) {
      throw new UnauthorizedError("Người dùng không tồn tại", "USER_NOT_FOUND")
    }

    if (payload.tokenVersion < user.tokenVersion) {
      throw new ForbiddenError("Phiên đăng nhập đã bị vô hiệu hoá", "TOKEN_REVOKED")
    }

    req.user = { ...payload, role: user.role }
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
