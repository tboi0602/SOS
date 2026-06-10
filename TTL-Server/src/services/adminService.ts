import { NotFoundError, BadRequestError } from "../lib/errors";
import { getDb } from "../db";
import { toSafeUser } from "../lib/safeUser";

export const adminService = {
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

  async getPendingMembers(page: number, limit: number) {
    const pendingWhere = { status: "pending" as const };

    const [postUsers, journalUsers, submissionUsers, visitUsers] = await Promise.all([
      getDb().post.findMany({ where: pendingWhere, select: { userId: true }, distinct: ["userId"] }),
      getDb().journal.findMany({ where: pendingWhere, select: { userId: true }, distinct: ["userId"] }),
      getDb().submission.findMany({ where: pendingWhere, select: { userId: true }, distinct: ["userId"] }),
      getDb().customerVisitImage.findMany({ where: { status: "PENDING" }, select: { userId: true }, distinct: ["userId"] }),
    ]);

    const userIds = new Set([
      ...postUsers.map((u) => u.userId),
      ...journalUsers.map((u) => u.userId),
      ...submissionUsers.map((u) => u.userId),
      ...visitUsers.map((u) => u.userId),
    ]);

    const userIdsArr = Array.from(userIds);
    const total = userIdsArr.length;
    const pagedIds = userIdsArr.slice((page - 1) * limit, page * limit);

    if (pagedIds.length === 0) {
      return { members: [], total: 0, page, totalPages: 0 };
    }

    const [users, postCounts, journalCounts, submissionCounts, visitCounts] = await Promise.all([
      getDb().user.findMany({
        where: { id: { in: pagedIds } },
        select: { id: true, name: true, email: true, avatar: true, memberId: true },
      }),
      getDb().post.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "pending" }, _count: { id: true } }),
      getDb().journal.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "pending" }, _count: { id: true } }),
      getDb().submission.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "pending" }, _count: { id: true } }),
      getDb().customerVisitImage.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "PENDING" }, _count: { id: true } }),
    ]);

    const countMap = (arr: { userId: string; _count: { id: number } }[]) => {
      const map = new Map<string, number>();
      for (const item of arr) map.set(item.userId, item._count.id);
      return map;
    };

    const postMap = countMap(postCounts);
    const journalMap = countMap(journalCounts);
    const submissionMap = countMap(submissionCounts);
    const visitMap = countMap(visitCounts);

    const members = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      memberId: u.memberId,
      pendingCounts: {
        posts: postMap.get(u.id) ?? 0,
        journals: journalMap.get(u.id) ?? 0,
        submissions: submissionMap.get(u.id) ?? 0,
        customerVisits: visitMap.get(u.id) ?? 0,
      },
      totalPending:
        (postMap.get(u.id) ?? 0) +
        (journalMap.get(u.id) ?? 0) +
        (submissionMap.get(u.id) ?? 0) +
        (visitMap.get(u.id) ?? 0),
    }));

    return {
      members,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getUserPendingItems(userId: string, filterType?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const items: Record<string, unknown>[] = [];
    let total = 0;

    const fetchPosts = !filterType || filterType === "post";
    const fetchJournals = !filterType || filterType === "journal";
    const fetchSubmissions = !filterType || filterType === "submission";
    const fetchVisits = !filterType || filterType === "customer-visit";

    const queries: Promise<void>[] = [];

    if (fetchPosts) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().post.findMany({
              where: { userId, status: "pending" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, content: true, createdAt: true, status: true },
            }),
            getDb().post.count({ where: { userId, status: "pending" } }),
          ]);
          items.push(...list.map((p) => ({ ...p, itemType: "post", title: p.content.slice(0, 100) })));
          total += count;
        })(),
      );
    }

    if (fetchJournals) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().journal.findMany({
              where: { userId, status: "pending" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, title: true, createdAt: true, status: true },
            }),
            getDb().journal.count({ where: { userId, status: "pending" } }),
          ]);
          items.push(...list.map((j) => ({ ...j, itemType: "journal" })));
          total += count;
        })(),
      );
    }

    if (fetchSubmissions) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().submission.findMany({
              where: { userId, status: "pending" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, title: true, createdAt: true, status: true },
            }),
            getDb().submission.count({ where: { userId, status: "pending" } }),
          ]);
          items.push(...list.map((s) => ({ ...s, itemType: "submission" })));
          total += count;
        })(),
      );
    }

    if (fetchVisits) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().customerVisitImage.findMany({
              where: { userId, status: "PENDING" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, description: true, createdAt: true, status: true, imageUrl: true },
            }),
            getDb().customerVisitImage.count({ where: { userId, status: "PENDING" } }),
          ]);
          items.push(...list.map((v) => ({ ...v, itemType: "customer-visit", title: v.description ?? "Hình ảnh gặp khách hàng" })));
          total += count;
        })(),
      );
    }

    await Promise.all(queries);

    if (!filterType) {
      items.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
      const sliced = items.slice(skip, skip + limit);
      return { items: sliced, total, page, totalPages: Math.ceil(total / limit) };
    }

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
