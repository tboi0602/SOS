import { getDb } from "../db"

export const contactService = {
  async create(data: { name: string; email: string; phone?: string; message: string }) {
    return getDb().contactMessage.create({ data })
  },

  async list(page = 1, limit = 20) {
    const [messages, total] = await Promise.all([
      getDb().contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      getDb().contactMessage.count(),
    ])
    return {
      messages: messages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        message: m.message,
        isRead: m.isRead,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  },

  async markRead(id: string) {
    return getDb().contactMessage.update({ where: { id }, data: { isRead: true } })
  },

  async delete(id: string) {
    await getDb().contactMessage.delete({ where: { id } })
    return { message: "Đã xoá" }
  },
}
