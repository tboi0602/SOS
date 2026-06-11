import { NotFoundError, BadRequestError } from "../../lib/errors";
import { getDb } from "../../db";
import { notificationService } from "../notificationService";
import { quizService } from "./quizService";
import { flowService } from "./flowService";

export const lessonService = {
  async getLessons(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    if (!["in_lessons", "pending_quiz", "pending_situations", "pending_review", "completed"].includes(uf.status)) {
      throw new BadRequestError("Chưa có quyền truy cập bài học");
    }

    const lessons = await getDb().lessonDef.findMany({
      where: { membershipFlowId: uf.membershipFlowId },
      orderBy: { orderIndex: "asc" },
    });

    const userLessons = await getDb().userLesson.findMany({
      where: { userId },
    });

    const userLessonMap = new Map(userLessons.map((ul) => [ul.lessonDefId, ul]));

    return lessons.map((l) => ({
      ...l,
      userLesson: userLessonMap.get(l.id) ?? null,
    }));
  },

  async submitLesson(userId: string, lessonDefId: string, productUrl: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    if (uf.status !== "in_lessons") throw new BadRequestError("Chưa trong giai đoạn học");

    const lesson = await getDb().lessonDef.findUnique({ where: { id: lessonDefId } });
    if (!lesson || lesson.membershipFlowId !== uf.membershipFlowId) {
      throw new NotFoundError("Bài học không tồn tại");
    }

    const ul = await getDb().userLesson.upsert({
      where: { userId_lessonDefId: { userId, lessonDefId } },
      update: { productUrl, status: "submitted", submittedAt: new Date() },
      create: { userId, lessonDefId, productUrl, status: "submitted", submittedAt: new Date() },
    });

    const allLessons = await getDb().lessonDef.findMany({
      where: { membershipFlowId: uf.membershipFlowId },
    });
    const submitted = await getDb().userLesson.count({
      where: { userId, lessonDefId: { in: allLessons.map((l) => l.id) }, status: "submitted" },
    });

    if (submitted >= allLessons.length) {
      await quizService.assignQuiz(userId);
    }

    return ul;
  },

  async scoreLesson(lessonId: string, score: number, adminNote?: string) {
    const ul = await getDb().userLesson.findUnique({ where: { id: lessonId } });
    if (!ul) throw new NotFoundError("Không tìm thấy bài nộp");

    const updated = await getDb().userLesson.update({
      where: { id: lessonId },
      data: { score, adminNote, status: "scored" },
    });

    await flowService.recalcTotalScore(ul.userId);

    await notificationService.create({
      userId: ul.userId,
      title: "Bài học đã được chấm",
      content: `Bài học của bạn đã được chấm: ${score} điểm`,
      type: "membership",
      link: "/home/membership",
    });

    return updated;
  },

  async createLesson(data: { title: string; description?: string; type?: string; orderIndex?: number; content?: string }) {
    const flow = await flowService.getDefaultFlow();
    const { id: _, ...clean } = data as any;
    return getDb().lessonDef.create({ data: { ...clean, membershipFlowId: flow.id } });
  },

  async updateLesson(id: string, data: { title?: string; description?: string; type?: string; orderIndex?: number; content?: string }) {
    return getDb().lessonDef.update({ where: { id }, data });
  },

  async deleteLesson(id: string) {
    return getDb().lessonDef.delete({ where: { id } });
  },
};
