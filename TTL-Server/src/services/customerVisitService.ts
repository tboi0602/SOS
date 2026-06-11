import { NotFoundError, BadRequestError } from "../lib/errors";
import { getDb } from "../db";
import { notificationService } from "./notificationService";

export const customerVisitService = {
  async upload(userId: string, imageUrl: string, description?: string) {
    const user = await getDb().user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    const visit = await getDb().customerVisitImage.create({
      data: { userId, imageUrl, description: description ?? null },
    });

    // Only award score if admin approved
    return visit;
  },

  async listByUser(userId: string) {
    const images = await getDb().customerVisitImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return images;
  },

  async listAll(status?: string) {
    const where: Record<string, unknown> = {};
    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      where.status = status;
    }
    const images = await getDb().customerVisitImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
      },
    });
    return images;
  },

  async review(id: string, reviewerId: string, status: "APPROVED" | "REJECTED", adminNote?: string) {
    const visit = await getDb().customerVisitImage.findUnique({ where: { id } });
    if (!visit) throw new NotFoundError("Không tìm thấy ảnh");
    if (visit.status !== "PENDING") throw new BadRequestError("Ảnh đã được xử lý");

    const updated = await getDb().customerVisitImage.update({
      where: { id },
      data: { status, reviewedBy: reviewerId, reviewedAt: new Date(), adminNote: adminNote ?? null },
    });

    // Award score only on approval
    if (status === "APPROVED") {
      await getDb().user.update({
        where: { id: visit.userId },
        data: { referredScore: { increment: 2 } },
      });
    }

    if (adminNote) {
      await notificationService.create({
        userId: visit.userId,
        title: `Admin đã nhận xét ảnh thăm khách hàng của bạn`,
        content: adminNote,
        type: "auto",
        link: "/home/customer-visits",
      }).catch(() => {});
    }

    return updated;
  },

  async delete(id: string, userId: string) {
    const visit = await getDb().customerVisitImage.findUnique({ where: { id } });
    if (!visit) throw new NotFoundError("Không tìm thấy ảnh");
    if (visit.userId !== userId) throw new BadRequestError("Không có quyền xoá ảnh này");

    await getDb().customerVisitImage.delete({ where: { id } });

    // Only decrement score if it was approved
    if (visit.status === "APPROVED") {
      await getDb().user.update({
        where: { id: userId },
        data: { referredScore: { decrement: 2 } },
      });
    }

    return { message: "Đã xoá ảnh" };
  },
};
