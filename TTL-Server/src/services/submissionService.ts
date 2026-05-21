import { getDb } from "../db"
import { NotFoundError, ForbiddenError } from "../lib/errors"
import { User } from "../models/User"

export const submissionService = {
  async create(userId: string, data: { title: string; videoUrl?: string; note?: string }) {
    const submission = await getDb().submission.create({
      data: {
        userId,
        title: data.title,
        videoUrl: data.videoUrl ?? null,
        note: data.note ?? null,
        status: "pending",
        points: 1,
      },
    })
    await getDb().user.update({
      where: { id: userId },
      data: { lastSubmissionDate: new Date() },
    })
    return submission
  },

  async getMySubmissions(userId: string) {
    return getDb().submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  },

  async delete(submissionId: string, userId: string) {
    const sub = await getDb().submission.findUnique({ where: { id: submissionId } })
    if (!sub) throw new NotFoundError("Tác phẩm không tồn tại")
    if (sub.userId !== userId) throw new NotFoundError("Không có quyền xoá")
    await getDb().submission.delete({ where: { id: submissionId } })
    return { message: "Đã xoá" }
  },

  async listPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [submissions, total] = await Promise.all([
      getDb().submission.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      }),
      getDb().submission.count({ where: { status: "pending" } }),
    ])
    return { submissions, total, page, limit }
  },

  async listApproved(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [submissions, total] = await Promise.all([
      getDb().submission.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      }),
      getDb().submission.count({ where: { status: "approved" } }),
    ])
    return { submissions, total, page, limit }
  },

  async approve(submissionId: string, adminNote?: string) {
    const sub = await getDb().submission.findUnique({ where: { id: submissionId } })
    if (!sub) throw new NotFoundError("Tác phẩm không tồn tại")
    if (sub.status !== "pending") throw new ForbiddenError("Chỉ duyệt được tác phẩm đang chờ")

    const updated = await getDb().submission.update({
      where: { id: submissionId },
      data: { status: "approved", adminNote: adminNote ?? null },
    })
    await User.addPoints(sub.userId, { truyenCamHung: sub.points })
    return updated
  },

  async reject(submissionId: string, adminNote?: string) {
    const sub = await getDb().submission.findUnique({ where: { id: submissionId } })
    if (!sub) throw new NotFoundError("Tác phẩm không tồn tại")
    if (sub.status !== "pending") throw new ForbiddenError("Chỉ từ chối được tác phẩm đang chờ")

    return getDb().submission.update({
      where: { id: submissionId },
      data: { status: "rejected", adminNote: adminNote ?? null, points: 0 },
    })
  },

  async checkPenalty(userId: string) {
    const user = await getDb().user.findUnique({
      where: { id: userId },
      select: { lastSubmissionDate: true, truyenCamHung: true },
    })
    if (!user || !user.lastSubmissionDate) return { penalized: false, daysOverdue: 0 }

    const now = new Date()
    const diffDays = Math.floor((now.getTime() - user.lastSubmissionDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays >= 2 && user.truyenCamHung > 0) {
      await getDb().user.update({
        where: { id: userId },
        data: { truyenCamHung: { decrement: 1 } },
      })
      return { penalized: true, daysOverdue: diffDays, deducted: 1 }
    }
    return { penalized: false, daysOverdue: diffDays }
  },
}
