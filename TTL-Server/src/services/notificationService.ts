import { getDb } from "../db";
import { NotFoundError } from "../lib/errors";

export const notificationService = {
  async list(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      getDb().notification.findMany({
        where: { OR: [{ userId }, { userId: null }] },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().notification.count({
        where: { OR: [{ userId }, { userId: null }] },
      }),
      getDb().notification.count({
        where: { OR: [{ userId }, { userId: null }], isRead: false },
      }),
    ]);
    return { notifications, total, unreadCount, page, totalPages: Math.ceil(total / limit) };
  },

  async unreadCount(userId: string) {
    const count = await getDb().notification.count({
      where: { OR: [{ userId }, { userId: null }], isRead: false },
    });
    return { count };
  },

  async markRead(notificationId: string, userId: string) {
    const n = await getDb().notification.findUnique({ where: { id: notificationId } });
    if (!n || (n.userId && n.userId !== userId)) throw new NotFoundError("Thông báo không tồn tại");
    return getDb().notification.update({ where: { id: notificationId }, data: { isRead: true } });
  },

  async markAllRead(userId: string) {
    await getDb().notification.updateMany({
      where: { OR: [{ userId }, { userId: null }], isRead: false },
      data: { isRead: true },
    });
    return { message: "Đã đánh dấu tất cả là đã đọc" };
  },

  async create(data: { userId?: string; title: string; content: string; type?: string; link?: string }) {
    return getDb().notification.create({ data });
  },

  async delete(id: string) {
    const n = await getDb().notification.findUnique({ where: { id } });
    if (!n) throw new NotFoundError("Thông báo không tồn tại");
    await getDb().notification.delete({ where: { id } });
    return { message: "Đã xoá thông báo" };
  },
};
