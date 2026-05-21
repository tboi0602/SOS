import { type Request, type Response, type NextFunction } from "express"
import { type ZodSchema, ZodError } from "zod"
import { AppError } from "../lib/errors"

type ValidationTarget = "body" | "query" | "params"

export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target])
      req[target] = data
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const message = (err as ZodError).issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ")
        next(new AppError(400, message, "VALIDATION_ERROR"))
        return
      }
      next(err)
    }
  }
}
