import { NotFoundError, BadRequestError } from "../../lib/errors";
import { getDb } from "../../db";
import { toSafeUser } from "../../lib/safeUser";

export const adminUserService = {
  async listUsers(page: number, limit: number, search?: string, excludeUserId?: string) {
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (excludeUserId) {
      where.NOT = { id: excludeUserId };
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
      users: users.map((u) => toSafeUser(u)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getUserById(id: string) {
    const user = await getDb().user.findUnique({ where: { id } });
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
    return toSafeUser(updated);
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

  async getDashboard(excludeUserId?: string) {
    const users = await getDb().user.findMany({
      where: excludeUserId ? { id: { not: excludeUserId } } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            posts: true,
            journals: true,
            submissions: true,
          },
        },
      },
    });

    return {
      members: users.map((u) => {
        const total = (u.kyLuat ?? 0) + (u.daoDuc ?? 0) + (u.truyenCamHung ?? 0) + (u.postScore ?? 0) + (u.referredScore ?? 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar,
          job: u.job,
          memberId: u.memberId,
          isActive: u.isActive,
          permissions: Array.isArray(u.permissions) ? u.permissions : [],
          kyLuat: u.kyLuat ?? 0,
          daoDuc: u.daoDuc ?? 0,
          truyenCamHung: u.truyenCamHung ?? 0,
          postScore: u.postScore ?? 0,
          referredScore: u.referredScore ?? 0,
          totalScore: total,
          postCount: u._count.posts,
          submissionCount: u._count.submissions,
          journalCount: u._count.journals,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        };
      }),
      total: users.length,
    };
  },

  async updateUserPermissions(id: string, permissions: string[], currentUserId?: string) {
    if (id === currentUserId) {
      throw new BadRequestError("Bạn không thể tự thay đổi quyền của chính mình")
    }
    const user = await getDb().user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    const VALID_PERMISSIONS = [
      "approve_posts",
      "approve_journals",
      "approve_submissions",
      "manage_users",
      "manage_permissions",
      "manage_notifications",
      "manage_lessons",
      "manage_posts",
    ];
    const invalid = permissions.filter((p) => !VALID_PERMISSIONS.includes(p));
    if (invalid.length > 0) {
      throw new BadRequestError(`Quyền không hợp lệ: ${invalid.join(", ")}`);
    }

    const updated = await getDb().user.update({
      where: { id },
      data: { permissions },
    });

    await getDb().auditLog.create({
      data: {
        userId: currentUserId ?? null,
        action: "UPDATE_PERMISSIONS",
        resource: "user",
        resourceId: id,
        metadata: { permissions, targetName: user.name, targetEmail: user.email },
      },
    });

    return toSafeUser(updated);
  },

  async blockUser(id: string, actorId?: string) {
    const user = await getDb().user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");
    if (!user.isActive) throw new BadRequestError("Người dùng đã bị chặn");

    await getDb().user.update({
      where: { id },
      data: {
        isActive: false,
        tokenVersion: { increment: 1 },
      },
    });

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "BLOCK_USER",
        resource: "user",
        resourceId: id,
        metadata: { targetName: user.name, targetEmail: user.email },
      },
    });

    return { message: "Đã chặn người dùng thành công" };
  },

  async unblockUser(id: string, actorId?: string) {
    const user = await getDb().user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");
    if (user.isActive) throw new BadRequestError("Người dùng chưa bị chặn");

    await getDb().user.update({
      where: { id },
      data: { isActive: true },
    });

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "UNBLOCK_USER",
        resource: "user",
        resourceId: id,
        metadata: { targetName: user.name, targetEmail: user.email },
      },
    });

    return { message: "Đã bỏ chặn người dùng thành công" };
  },
};
