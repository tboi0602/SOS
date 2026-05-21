import { getDb } from "../db"
import { logger } from "../lib/logger"

interface AuditLogData {
  userId?: string | null
  action: string
  resource: string
  resourceId?: string | null
  metadata?: Record<string, unknown> | null
  ip?: string | null
  userAgent?: string | null
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await getDb().auditLog.create({
      data: {
        userId: data.userId ?? null,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId ?? null,
        metadata: (data.metadata as any) ?? null,
        ip: data.ip ?? null,
        userAgent: data.userAgent ?? null,
      },
    })
  } catch (err) {
    logger.error("Failed to create audit log", { error: (err as Error).message })
  }
}
