import { getDb } from "../db"
import { NotFoundError, ForbiddenError } from "../lib/errors"
import { User } from "../models/User"

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

  async getByUser(userId: string) {
    return getDb().journal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
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

  async approve(journalId: string, adminNote?: string) {
    const entry = await getDb().journal.findUnique({ where: { id: journalId } })
    if (!entry) throw new NotFoundError("Nhật ký không tồn tại")
    if (entry.status !== "pending") throw new ForbiddenError("Chỉ duyệt được nhật ký đang chờ")

    const updated = await getDb().journal.update({
      where: { id: journalId },
      data: { status: "approved", points: 1, adminNote: adminNote ?? null },
    })
    await User.addPoints(entry.userId, { truyenCamHung: 1 })
    return updated
  },

  async reject(journalId: string, adminNote?: string) {
    const entry = await getDb().journal.findUnique({ where: { id: journalId } })
    if (!entry) throw new NotFoundError("Nhật ký không tồn tại")
    if (entry.status !== "pending") throw new ForbiddenError("Chỉ từ chối được nhật ký đang chờ")

    return getDb().journal.update({
      where: { id: journalId },
      data: { status: "rejected", adminNote: adminNote ?? null, points: 0 },
    })
  },
}
