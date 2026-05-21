import rateLimit from "express-rate-limit"

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút" },
  standardHeaders: true,
  legacyHeaders: false,
})

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Quá nhiều yêu cầu, vui lòng thử lại sau" },
  standardHeaders: true,
  legacyHeaders: false,
})
