import { NotFoundError } from "../../lib/errors";
import { getDb } from "../../db";

export const adminActivityService = {
  async getActivityLog(page = 1, limit = 50, dateFrom?: string, dateTo?: string, action?: string) {
    const where: Record<string, unknown> = {};
    if (dateFrom) {
      where.createdAt = { ...(where.createdAt as object || {}), gte: new Date(dateFrom + "T00:00:00") };
    }
    if (dateTo) {
      where.createdAt = { ...(where.createdAt as object || {}), lte: new Date(dateTo + "T23:59:59") };
    }
    if (action) {
      where.action = action;
    }

    const [logs, total] = await Promise.all([
      getDb().auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      }),
      getDb().auditLog.count({ where }),
    ]);

    return {
      logs: logs.map((l) => ({
        id: l.id,
        userId: l.userId,
        action: l.action,
        resource: l.resource,
        resourceId: l.resourceId,
        metadata: l.metadata as { targetName?: string; targetEmail?: string } | null,
        ip: l.ip,
        userAgent: l.userAgent,
        createdAt: l.createdAt.toISOString(),
        user: l.user
          ? { id: l.user.id, name: l.user.name, email: l.user.email, avatar: l.user.avatar }
          : null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async deleteActivityLog(id: string) {
    const log = await getDb().auditLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundError("Bản ghi không tồn tại");
    await getDb().auditLog.delete({ where: { id } });
    return { message: "Đã xoá bản ghi" };
  },

  async deleteAllActivityLog() {
    const result = await getDb().auditLog.deleteMany({});
    return { message: `Đã xoá ${result.count} bản ghi`, count: result.count };
  },
};
