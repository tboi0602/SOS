import { type Request, type Response, type NextFunction } from "express"
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library"
import { AppError } from "../lib/errors"
import { logger } from "../lib/logger"

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    })
    return
  }

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({ error: "Dữ liệu đã tồn tại", code: "UNIQUE_CONSTRAINT" })
        return
      case "P2025":
        res.status(404).json({ error: "Không tìm thấy dữ liệu", code: "NOT_FOUND" })
        return
      case "P2003":
        res.status(400).json({ error: "Dữ liệu tham chiếu không hợp lệ", code: "FOREIGN_KEY" })
        return
      default:
        logger.error("Prisma error", { code: err.code, error: err.message })
        res.status(400).json({ error: "Lỗi dữ liệu", code: `PRISMA_${err.code}` })
        return
    }
  }

  if (err instanceof PrismaClientValidationError) {
    logger.error("Prisma validation error", { error: err.message })
    res.status(400).json({ error: "Dữ liệu không hợp lệ", code: "VALIDATION_ERROR" })
    return
  }

  logger.error("Unhandled error", { error: err.message, stack: err.stack })

  const statusCode = (err as any).statusCode || 500
  const message = statusCode === 500 ? "Internal server error" : err.message

  res.status(statusCode).json({ error: message })
}
