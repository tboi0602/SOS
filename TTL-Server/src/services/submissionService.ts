import { getDb } from "../db";
import { NotFoundError, ForbiddenError } from "../lib/errors";

export const submissionService = {
  async create(
    userId: string,
    data: { title: string; videoUrl?: string; note?: string },
  ) {
    const submission = await getDb().submission.create({
      data: {
        userId,
        title: data.title,
        videoUrl: data.videoUrl ?? null,
        note: data.note ?? null,
        status: "pending",
        points: 0,
      },
    });
    await getDb().user.update({
      where: { id: userId },
      data: { lastSubmissionDate: new Date() },
    });
    return submission;
  },

  async getMySubmissions(
    userId: string,
    page = 1,
    limit = 10,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (status && status !== "all") where.status = status;
    if (dateFrom)
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(dateFrom + "T00:00:00"),
      };
    if (dateTo)
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(dateTo + "T23:59:59"),
      };

    const [
      submissions,
      total,
      allCount,
      pendingCount,
      approvedCount,
      rejectedCount,
    ] = await Promise.all([
      getDb().submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().submission.count({ where }),
      getDb().submission.count({ where: { userId } }),
      getDb().submission.count({ where: { userId, status: "pending" } }),
      getDb().submission.count({ where: { userId, status: "approved" } }),
      getDb().submission.count({ where: { userId, status: "rejected" } }),
    ]);
    return {
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      counts: {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    };
  },

  async delete(submissionId: string, userId: string) {
    const sub = await getDb().submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new NotFoundError("Tác phẩm không tồn tại");
    if (sub.userId !== userId) throw new NotFoundError("Không có quyền xoá");
    await getDb().submission.delete({ where: { id: submissionId } });
    return { message: "Đã xoá" };
  },

  async listPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [submissions, total] = await Promise.all([
      getDb().submission.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      }),
      getDb().submission.count({ where: { status: "pending" } }),
    ]);
    return { submissions, total, page, limit };
  },

  async listApproved(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [submissions, total] = await Promise.all([
      getDb().submission.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      }),
      getDb().submission.count({ where: { status: "approved" } }),
    ]);
    return { submissions, total, page, limit };
  },

  async approve(submissionId: string, adminNote?: string, actorId?: string) {
    const sub = await getDb().submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new NotFoundError("Tác phẩm không tồn tại");
    if (sub.status !== "pending")
      throw new ForbiddenError("Chỉ duyệt được tác phẩm đang chờ");

    const updated = await getDb().submission.update({
      where: { id: submissionId },
      data: { status: "approved", points: 2, adminNote: adminNote ?? null },
    });
    await getDb().user.update({
      where: { id: sub.userId },
      data: { kyLuat: { increment: 2 } },
    });

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "APPROVE_SUBMISSION",
        resource: "submission",
        resourceId: submissionId,
        metadata: { submissionTitle: sub.title?.slice(0, 100), authorId: sub.userId },
      },
    });

    return updated;
  },

  async reject(submissionId: string, adminNote?: string, actorId?: string) {
    const sub = await getDb().submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new NotFoundError("Tác phẩm không tồn tại");
    if (sub.status !== "pending")
      throw new ForbiddenError("Chỉ từ chối được tác phẩm đang chờ");

    const updated = await getDb().submission.update({
      where: { id: submissionId },
      data: { status: "rejected", adminNote: adminNote ?? null, points: 0 },
    });

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "REJECT_SUBMISSION",
        resource: "submission",
        resourceId: submissionId,
        metadata: { submissionTitle: sub.title?.slice(0, 100), authorId: sub.userId },
      },
    });

    return updated;
  },

  async checkPenalty(userId: string) {
    const user = await getDb().user.findUnique({
      where: { id: userId },
      select: { lastSubmissionDate: true, truyenCamHung: true },
    });
    if (!user || !user.lastSubmissionDate)
      return { penalized: false, daysOverdue: 0 };

    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - user.lastSubmissionDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (diffDays >= 2 && user.truyenCamHung > 0) {
      await getDb().user.update({
        where: { id: userId },
        data: { truyenCamHung: { decrement: 1 } },
      });
      return { penalized: true, daysOverdue: diffDays, deducted: 1 };
    }
    return { penalized: false, daysOverdue: diffDays };
  },
};
