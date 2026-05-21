import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import path from "path"
import { v4 as uuid } from "uuid"
import { initDb, closeDb } from "./db"
import { config } from "./config"
import { logger } from "./lib/logger"
import { errorHandler } from "./middleware/errorHandler"
import authRoutes from "./router/v1/auth"
import chatRoutes from "./router/v1/chat"
import postRoutes from "./router/v1/post"
import adminRoutes from "./router/v1/admin"
import profileRoutes from "./router/v1/profile"
import journalRoutes from "./router/v1/journal"

async function main() {
  logger.info("Starting server", { nodeEnv: config.nodeEnv, port: config.port })

  await initDb()
  logger.info("Database connected")

  const app = express()

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }))

  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
  }))

  app.use(cookieParser())
  app.use(express.json({ limit: "5mb" }))
  app.use(express.urlencoded({ extended: true, limit: "5mb" }))
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")))

  app.use((req, _res, next) => {
    const correlationId = (req.headers["x-correlation-id"] as string) || uuid()
    req.headers["x-correlation-id"] = correlationId
    next()
  })

  app.get("/api/health", async (_req, res) => {
    try {
      const { getDb } = await import("./db")
      await getDb().$queryRaw`SELECT 1`
      res.json({
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      })
    } catch {
      res.status(503).json({
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      })
    }
  })

  app.use("/api/v1/auth", authRoutes)
  app.use("/api/v1/chat", chatRoutes)
  app.use("/api/v1/posts", postRoutes)
  app.use("/api/v1/admin", adminRoutes)
  app.use("/api/v1/profile", profileRoutes)
  app.use("/api/v1/journal", journalRoutes)

  app.use((_req, res) => {
    res.status(404).json({ error: "API endpoint không tồn tại", code: "NOT_FOUND" })
  })

  app.use(errorHandler)

  const server = app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`)
  })

  const shutdown = async () => {
    logger.info("Shutting down server...")
    await closeDb()
    server.close()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

main().catch((err) => {
  logger.error("Failed to start server", { error: err.message })
  process.exit(1)
})
