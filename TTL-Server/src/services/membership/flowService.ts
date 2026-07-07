import path from "path";
import fs from "fs";
import crypto from "crypto";
import { NotFoundError, BadRequestError } from "../../lib/errors";
import { getDb } from "../../db";
import { notificationService } from "../notificationService";
import { quizService } from "./quizService";

export const flowService = {
  async getDefaultFlow() {
    let flow = await getDb().membershipFlow.findFirst({ orderBy: { createdAt: "desc" } });
    if (!flow) {
      flow = await getDb().membershipFlow.create({ data: {} });
    }
    return flow;
  },

  async getMyFlow(userId: string) {
    let uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: { membershipFlow: true },
    });
    if (!uf) {
      const flow = await this.getDefaultFlow();
      uf = await getDb().userMembershipFlow.create({
        data: { userId, membershipFlowId: flow.id },
        include: { membershipFlow: true },
      });
    }
    return uf;
  },

  async uploadDocuments(userId: string, data: {
    documentsUrl?: string
    idCardFront?: string
    idCardBack?: string
    achievementImages?: string
  }) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    const allowed = ["pending_docs", "docs_submitted"];
    if (!allowed.includes(uf.status)) throw new BadRequestError("Trạng thái không hợp lệ");

    const dedup = (...parts: (string | undefined | null)[]) =>
      [...new Set(parts.filter(Boolean).flatMap((s) => s!.split(",").filter(Boolean)))].join(",")

    const mergedDocs = dedup(uf.documentsUrl, data.documentsUrl)
    const mergedAchievements = dedup(uf.achievementImages, data.achievementImages)

    const newStatus = uf.status === "pending_docs" ? "docs_submitted" : uf.status;

    const updated = await getDb().userMembershipFlow.update({
      where: { userId },
      data: {
        documentsUrl: mergedDocs,
        idCardFront: data.idCardFront || uf.idCardFront,
        idCardBack: data.idCardBack || uf.idCardBack,
        achievementImages: mergedAchievements,
        status: newStatus,
      },
    });

    const admins = await getDb().user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });
    for (const admin of admins) {
      await notificationService.create({
        userId: admin.id,
        title: "Tài liệu đăng ký mới",
        content: "Có tài liệu đăng ký hội viên mới cần duyệt",
        type: "membership",
        link: "/admin/membership-flow",
      });
    }

    return updated;
  },

  async confirmPayment(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    if (uf.status !== "pending_payment") throw new BadRequestError("Trạng thái không hợp lệ");

    const updated = await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "payment_pending_verification", paymentConfirmedAt: new Date() },
    });

    const admins = await getDb().user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });
    for (const admin of admins) {
      await notificationService.create({
        userId: admin.id,
        title: "Xác nhận thanh toán",
        content: "Người dùng đã xác nhận chuyển khoản, vui lòng kiểm tra",
        type: "membership",
        link: "/admin/membership-flow",
      });
    }

    return updated;
  },

  async getSettings() {
    const flow = await this.getDefaultFlow();
    const [lessons, quizQuestions, situationQuestions, examSets] = await Promise.all([
      getDb().lessonDef.findMany({ where: { membershipFlowId: flow.id }, orderBy: { orderIndex: "asc" } }),
      getDb().quizQuestion.findMany({ where: { membershipFlowId: flow.id }, orderBy: { orderIndex: "asc" } }),
      getDb().situationQuestion.findMany({ where: { membershipFlowId: flow.id }, orderBy: { orderIndex: "asc" } }),
      quizService.getExamSets(flow.id),
    ]);
    return { flow, lessons, quizQuestions, examSets, situationQuestions };
  },

  async updateFlow(data: { name?: string; price?: number; rules?: string }) {
    const flow = await this.getDefaultFlow();
    return getDb().membershipFlow.update({ where: { id: flow.id }, data });
  },

  async getPendingDocs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: "docs_submitted" as const };
    const [flows, total] = await Promise.all([
      getDb().userMembershipFlow.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().userMembershipFlow.count({ where }),
    ]);
    return { users: flows, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getAllFlows(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {
      OR: [
        { documentsUrl: { not: null } },
        { idCardFront: { not: null } },
        { idCardBack: { not: null } },
        { achievementImages: { not: null } },
      ],
    };
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }
    const [flows, total] = await Promise.all([
      getDb().userMembershipFlow.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          membershipFlow: { select: { name: true, price: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().userMembershipFlow.count({ where }),
    ]);
    return { users: flows, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getPendingPayments(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: "payment_pending_verification" as const };
    const [flows, total] = await Promise.all([
      getDb().userMembershipFlow.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().userMembershipFlow.count({ where }),
    ]);
    return { users: flows, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getActiveMembers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const statuses = ["in_lessons", "pending_quiz", "pending_situations", "pending_review", "completed"];
    const where: Record<string, unknown> = { status: { in: statuses } };
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }
    const [flows, total] = await Promise.all([
      getDb().userMembershipFlow.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          situation1: { select: { title: true, description: true } },
          situation2: { select: { title: true, description: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().userMembershipFlow.count({ where }),
    ]);
    return { users: flows, total, page, totalPages: Math.ceil(total / limit) };
  },

  async approveDocs(userId: string, adminId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf || uf.status !== "docs_submitted") throw new BadRequestError("Trạng thái không hợp lệ");

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "pending_payment" },
    });

    await notificationService.create({
      userId,
      title: "Tài liệu đã được duyệt",
      content: "Tài liệu đăng ký của bạn đã được duyệt. Vui lòng tiến hành thanh toán.",
      type: "membership",
      link: "/home/membership",
    });

    return { message: "Đã duyệt" };
  },

  async rejectDocs(userId: string, adminNote: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf || uf.status !== "docs_submitted") throw new BadRequestError("Trạng thái không hợp lệ");

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "pending_docs", adminNote },
    });

    await notificationService.create({
      userId,
      title: "Tài liệu cần chỉnh sửa",
      content: adminNote || "Tài liệu của bạn chưa đạt yêu cầu, vui lòng kiểm tra lại.",
      type: "membership",
      link: "/home/membership",
    });

    return { message: "Đã từ chối" };
  },

  async verifyPayment(userId: string, adminId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf || uf.status !== "payment_pending_verification") throw new BadRequestError("Trạng thái không hợp lệ");

    const lessons = await getDb().lessonDef.findMany({
      where: { membershipFlowId: uf.membershipFlowId },
    });

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: {
        status: "in_lessons",
        paymentVerifiedAt: new Date(),
        paymentVerifiedBy: adminId,
      },
    });

    for (const lesson of lessons) {
      await getDb().userLesson.upsert({
        where: { userId_lessonDefId: { userId, lessonDefId: lesson.id } },
        update: {},
        create: { userId, lessonDefId: lesson.id },
      });
    }

    await getDb().user.update({
      where: { id: userId },
      data: { role: "user" },
    });

    await notificationService.create({
      userId,
      title: "Thanh toán xác nhận",
      content: "Thanh toán của bạn đã được xác nhận! Bắt đầu tham gia các bài học.",
      type: "membership",
      link: "/home/membership",
    });

    return { message: "Đã xác nhận thanh toán" };
  },

  async rejectPayment(userId: string, adminNote: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf || uf.status !== "payment_pending_verification") throw new BadRequestError("Trạng thái không hợp lệ");

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "pending_payment", adminNote },
    });

    await notificationService.create({
      userId,
      title: "Thanh toán chưa xác nhận",
      content: adminNote || "Chưa nhận được chuyển khoản, vui lòng kiểm tra lại.",
      type: "membership",
      link: "/home/membership",
    });

    return { message: "Đã từ chối" };
  },

  async completeFlow(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "completed", completedAt: new Date() },
    });

    const graduationId = `THV-${crypto.randomBytes(12).toString("hex").toUpperCase()}`;

    await getDb().user.update({
      where: { id: userId },
      data: { role: "member", graduationId },
    });

    await notificationService.create({
      userId,
      title: "Chúc mừng!",
      content: "Bạn đã hoàn thành chương trình đăng ký hội viên!",
      type: "membership",
      link: "/home",
    });

    return { message: "Đã hoàn thành" };
  },

  async deleteMemberProfile(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy hồ sơ thành viên");

    const allUrls = [
      ...(uf.documentsUrl?.split(",").filter(Boolean) ?? []),
      ...(uf.idCardFront ? [uf.idCardFront] : []),
      ...(uf.idCardBack ? [uf.idCardBack] : []),
      ...(uf.achievementImages?.split(",").filter(Boolean) ?? []),
    ];

    const baseDir = path.join(process.cwd(), "public");
    for (const url of allUrls) {
      const relative = url.startsWith("/") ? url.slice(1) : url;
      const filePath = path.join(baseDir, relative);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch { }
    }

    const userDir = path.join(baseDir, "uploads", "membership-docs", userId);
    try {
      if (fs.existsSync(userDir)) fs.rmSync(userDir, { recursive: true, force: true });
    } catch { }

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: {
        documentsUrl: null,
        idCardFront: null,
        idCardBack: null,
        achievementImages: null,
        status: "pending_docs",
      },
    });

    return { message: "Đã xoá file hồ sơ thành viên" };
  },

  async recalcTotalScore(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) return;

    const lessonScores = await getDb().userLesson.findMany({
      where: { userId, score: { not: null } },
    });

    const lessonTotal = lessonScores.reduce((sum, l) => sum + (l.score ?? 0), 0);
    const situationTotal = (uf.situation1Score ?? 0) + (uf.situation2Score ?? 0);
    const quizScore = uf.quizScore ?? 0;
    const total = lessonTotal + situationTotal + quizScore;

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { totalScore: total },
    });

    return total;
  },
};
