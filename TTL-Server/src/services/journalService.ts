import { getDb } from "../db"
import { NotFoundError, ForbiddenError } from "../lib/errors"

export const journalService = {
  async create(userId: string, data: { title: string; content: string; images?: string[] }) {
    const entry = await getDb().journal.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        images: data.images ?? [],
        points: 0,
        status: "pending",
      },
    })
    return entry
  },

  async getByUser(
    userId: string,
    page = 1,
    limit = 10,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const skip = (page - 1) * limit
    const where: any = { userId }
    if (status && status !== "all") where.status = status
    if (dateFrom) where.createdAt = { ...where.createdAt, gte: new Date(dateFrom + "T00:00:00") }
    if (dateTo) where.createdAt = { ...where.createdAt, lte: new Date(dateTo + "T23:59:59") }

    const [entries, total, allCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      getDb().journal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().journal.count({ where }),
      getDb().journal.count({ where: { userId } }),
      getDb().journal.count({ where: { userId, status: "pending" } }),
      getDb().journal.count({ where: { userId, status: "approved" } }),
      getDb().journal.count({ where: { userId, status: "rejected" } }),
    ])
    return {
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      counts: { all: allCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
    }
  },

  async delete(journalId: string, userId: string) {
    const entry = await getDb().journal.findUnique({ where: { id: journalId } })
    if (!entry) throw new NotFoundError("Nhật ký không tồn tại")
    if (entry.userId !== userId) throw new NotFoundError("Không có quyền xoá")
    await getDb().journal.delete({ where: { id: journalId } })
    return { message: "Đã xoá" }
  },

  async listPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [entries, total] = await Promise.all([
      getDb().journal.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      }),
      getDb().journal.count({ where: { status: "pending" } }),
    ])
    return { entries, total, page, limit }
  },

  async listApproved(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [entries, total] = await Promise.all([
      getDb().journal.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      }),
      getDb().journal.count({ where: { status: "approved" } }),
    ])
    return { entries, total, page, limit }
  },

  async approve(journalId: string, adminNote?: string, actorId?: string) {
    const entry = await getDb().journal.findUnique({ where: { id: journalId } })
    if (!entry) throw new NotFoundError("Nhật ký không tồn tại")
    if (entry.status !== "pending") throw new ForbiddenError("Chỉ duyệt được nhật ký đang chờ")

    const updated = await getDb().journal.update({
      where: { id: journalId },
      data: { status: "approved", points: 1, adminNote: adminNote ?? null },
    })
    await getDb().user.update({
      where: { id: entry.userId },
      data: { daoDuc: { increment: 1 } },
    })

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "APPROVE_JOURNAL",
        resource: "journal",
        resourceId: journalId,
        metadata: { journalTitle: entry.title?.slice(0, 100), authorId: entry.userId },
      },
    })

    return updated
  },

  async reject(journalId: string, adminNote?: string, actorId?: string) {
    const entry = await getDb().journal.findUnique({ where: { id: journalId } })
    if (!entry) throw new NotFoundError("Nhật ký không tồn tại")
    if (entry.status !== "pending") throw new ForbiddenError("Chỉ từ chối được nhật ký đang chờ")

    const updated = await getDb().journal.update({
      where: { id: journalId },
      data: { status: "rejected", adminNote: adminNote ?? null, points: 0 },
    })

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "REJECT_JOURNAL",
        resource: "journal",
        resourceId: journalId,
        metadata: { journalTitle: entry.title?.slice(0, 100), authorId: entry.userId },
      },
    })

    return updated
  },
}
