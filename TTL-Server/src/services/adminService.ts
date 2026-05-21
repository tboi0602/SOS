import { User } from "../models/User";
import { NotFoundError, BadRequestError } from "../lib/errors";
import { getDb } from "../db";

export const adminService = {
  async listUsers(page: number, limit: number, search?: string) {
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      getDb().user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      getDb().user.count({ where }),
    ]);

    return {
      users: users.map((u) => User.toSafeUser(u)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getUserById(id: string) {
    const user = await User.findById(id, true);
    if (!user) throw new NotFoundError("Người dùng không tồn tại");
    return user;
  },

  async updateUserRole(id: string, role: string) {
    if (!["user", "admin"].includes(role)) {
      throw new BadRequestError("Vai trò không hợp lệ");
    }
    const user = await getDb().user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    const updated = await getDb().user.update({
      where: { id },
      data: { role },
    });
    return User.toSafeUser(updated);
  },

  async deleteUser(id: string) {
    const user = await getDb().user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");
    await getDb().user.delete({ where: { id } });
    return { message: "Xoá người dùng thành công" };
  },

  async getStats() {
    const [totalUsers, activeUsers, totalPosts, totalComments] = await Promise.all([
      getDb().user.count(),
      getDb().user.count({ where: { isActive: true } }),
      getDb().post.count(),
      getDb().comment.count(),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalPosts,
      totalComments,
    };
  },
};
