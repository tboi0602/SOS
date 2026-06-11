import { NotFoundError, BadRequestError } from "../../lib/errors";
import { getDb } from "../../db";
import { notificationService } from "../notificationService";
import { flowService } from "./flowService";

export const situationService = {
  async getSituations(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: {
        membershipFlow: { include: { situationQuestions: true } },
      },
    });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    if (uf.status !== "pending_situations" && uf.status !== "pending_review") {
      throw new BadRequestError("Không trong giai đoạn xử lý tình huống");
    }

    if (!uf.situation1Id && !uf.situation2Id) {
      const questions = uf.membershipFlow.situationQuestions;
      if (questions.length < 2) throw new BadRequestError("Chưa đủ bộ đề tình huống");

      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      const s1 = shuffled[0];
      const s2 = shuffled[1];

      await getDb().userMembershipFlow.update({
        where: { userId },
        data: {
          situation1Id: s1.id,
          situation2Id: s2.id,
          status: "pending_situations",
        },
      });

      return {
        situations: [
          { id: s1.id, title: s1.title, description: s1.description, index: 1, link: null, score: null },
          { id: s2.id, title: s2.title, description: s2.description, index: 2, link: null, score: null },
        ],
      };
    }

    const s1 = uf.situation1Id
      ? await getDb().situationQuestion.findUnique({ where: { id: uf.situation1Id } })
      : null;
    const s2 = uf.situation2Id
      ? await getDb().situationQuestion.findUnique({ where: { id: uf.situation2Id } })
      : null;

    return {
      situations: [
        { id: s1?.id, title: s1?.title, description: s1?.description, index: 1, link: uf.situation1Link, score: uf.situation1Score },
        { id: s2?.id, title: s2?.title, description: s2?.description, index: 2, link: uf.situation2Link, score: uf.situation2Score },
      ],
    };
  },

  async submitSituations(userId: string, situationIndex: number, driveLink: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    if (uf.status !== "pending_situations" && uf.status !== "pending_review") {
      throw new BadRequestError("Không trong giai đoạn xử lý tình huống");
    }

    const field = situationIndex === 1 ? "situation1Link" : "situation2Link" as const;
    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { [field]: driveLink },
    });

    const bothSubmitted =
      (situationIndex === 1 ? driveLink : uf.situation1Link) &&
      (situationIndex === 2 ? driveLink : uf.situation2Link);

    if (bothSubmitted) {
      await getDb().userMembershipFlow.update({
        where: { userId },
        data: { status: "pending_review" },
      });

      const admins = await getDb().user.findMany({
        where: { role: "admin" },
        select: { id: true },
      });
      for (const admin of admins) {
        await notificationService.create({
          userId: admin.id,
          title: "Bài tình huống mới",
          content: "Người dùng đã nộp bài tình huống, vui lòng chấm điểm",
          type: "membership",
          link: "/admin/membership-flow",
        });
      }
    }

    return { message: "Đã nộp bài" };
  },

  async scoreSituation(userId: string, situationIndex: number, score: number, adminNote?: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");

    const field = situationIndex === 1 ? "situation1Score" : "situation2Score" as const;
    const noteField = "adminNote" as const;

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { [field]: score, [noteField]: adminNote ?? uf.adminNote },
    });

    await flowService.recalcTotalScore(userId);

    await notificationService.create({
      userId,
      title: `Tình huống ${situationIndex} đã được chấm`,
      content: `Tình huống ${situationIndex} của bạn đã được chấm: ${score} điểm`,
      type: "membership",
      link: "/home/membership",
    });

    return { message: "Đã chấm điểm" };
  },

  async createSituationQuestion(data: { title: string; description: string; orderIndex?: number }) {
    const flow = await flowService.getDefaultFlow();
    const { id: _, ...clean } = data as any;
    return getDb().situationQuestion.create({ data: { ...clean, membershipFlowId: flow.id } });
  },

  async updateSituationQuestion(id: string, data: { title?: string; description?: string }) {
    return getDb().situationQuestion.update({ where: { id }, data });
  },

  async deleteSituationQuestion(id: string) {
    return getDb().situationQuestion.delete({ where: { id } });
  },
};
