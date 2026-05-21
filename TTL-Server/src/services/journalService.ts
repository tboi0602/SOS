import { getDb } from "../db"
import { NotFoundError } from "../lib/errors"
import { User } from "../models/User"

export const journalService = {
  async create(userId: string, data: { title: string; content: string; images?: string[] }) {
    const entry = await getDb().journal.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        images: data.images ?? [],
        points: 2,
      },
    })
    await User.addPoints(userId, { truyenCamHung: 2 })
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
}
