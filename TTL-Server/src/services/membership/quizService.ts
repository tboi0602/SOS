import { NotFoundError, BadRequestError } from "../../lib/errors";
import { getDb } from "../../db";
import { flowService } from "./flowService";

export const quizService = {
  async assignQuiz(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: {
        membershipFlow: {
          include: { quizExamSets: { include: { questions: { include: { question: true } } } } },
        },
      },
    });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");

    const flowId = uf.membershipFlowId;
    let examSets = uf.membershipFlow.quizExamSets;

    if (examSets.length === 0) {
      const questions = await getDb().quizQuestion.findMany({
        where: { membershipFlowId: flowId },
        orderBy: { orderIndex: "asc" },
      });
      if (questions.length === 0) throw new BadRequestError("Chưa có bộ đề trắc nghiệm");

      const examSet = await getDb().quizExamSet.create({
        data: {
          membershipFlowId: flowId,
          name: "Đề tự động",
          passScore: Math.ceil(questions.length * 0.7),
          questions: {
            create: questions.map((q, i) => ({ questionId: q.id, orderIndex: i })),
          },
        },
      });
      examSets = [{ ...examSet, questions: questions.map((q) => ({ question: q })) } as any];
    }

    const randomIdx = Math.floor(Math.random() * examSets.length);
    const examSet = examSets[randomIdx];

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "pending_quiz", quizExamSetId: examSet.id },
    });
  },

  async getQuiz(userId: string) {
    let uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: {
        quizExamSet: {
          include: {
            questions: {
              include: { question: { select: { id: true, question: true, options: true } } },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    if (!uf) throw new NotFoundError("Không tìm thấy flow");

    if (!uf.quizExamSet && uf.status === "pending_quiz") {
      try {
        await this.assignQuiz(userId);
        uf = await getDb().userMembershipFlow.findUnique({
          where: { userId },
          include: {
            quizExamSet: {
              include: {
                questions: {
                  include: { question: { select: { id: true, question: true, options: true } } },
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
        });
      } catch { /* ignore */ }
    }

    if (!uf || !uf.quizExamSet) throw new NotFoundError("Chưa có bài trắc nghiệm");
    if (uf.status !== "pending_quiz" && uf.status !== "pending_situations") {
      throw new BadRequestError("Không trong giai đoạn làm bài");
    }

    const questions = uf.quizExamSet.questions.map((eq) => ({
      id: eq.question.id,
      question: eq.question.question,
      options: Object.entries(eq.question.options as Record<string, string>).map(
        ([key, value]) => ({ key, value }),
      ),
    }));

    return {
      examSetId: uf.quizExamSet.id,
      examSetName: uf.quizExamSet.name,
      passScore: uf.quizExamSet.passScore,
      questions,
      total: questions.length,
    };
  },

  async submitQuiz(userId: string, answers: Record<string, string>) {
    let uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: {
        quizExamSet: {
          include: {
            questions: { include: { question: true } },
          },
        },
      },
    });
    if (!uf || !uf.quizExamSet) {
      if (uf && (uf.status === "pending_quiz" || uf.status === "pending_situations")) {
        try { await this.assignQuiz(userId); } catch { /* ignore */ }
        uf = await getDb().userMembershipFlow.findUnique({
          where: { userId },
          include: {
            quizExamSet: {
              include: {
                questions: { include: { question: true } },
              },
            },
          },
        });
      }
      if (!uf || !uf.quizExamSet) throw new NotFoundError("Chưa có bài trắc nghiệm");
    }
    if (uf.status !== "pending_quiz") throw new BadRequestError("Không trong giai đoạn làm bài");

    const examSet = uf.quizExamSet;
    let correctCount = 0;
    const total = examSet.questions.length;
    const results: { questionId: string; correct: boolean }[] = [];

    for (const eq of examSet.questions) {
      const userAnswer = answers[eq.question.id];
      const isCorrect = userAnswer === eq.question.correctAnswer;
      if (isCorrect) correctCount++;
      results.push({ questionId: eq.question.id, correct: isCorrect });
    }

    const passed = correctCount >= examSet.passScore;

    if (passed) {
      await getDb().userMembershipFlow.update({
        where: { userId },
        data: {
          quizScore: correctCount,
          quizCorrectCount: correctCount,
          quizPassed: true,
          status: "pending_situations",
        },
      });
    } else {
      await getDb().userMembershipFlow.update({
        where: { userId },
        data: {
          quizScore: correctCount,
          quizCorrectCount: correctCount,
          quizPassed: false,
          quizAttempts: { increment: 1 },
        },
      });
    }

    return { passed, correctCount, total, passScore: examSet.passScore };
  },

  async scoreQuiz(userId: string, answers: Record<string, string>) {
    let uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: {
        quizExamSet: {
          include: { questions: { include: { question: true } } },
        },
      },
    });
    if (!uf || !uf.quizExamSet) {
      if (uf && (uf.status === "pending_quiz" || uf.status === "pending_situations")) {
        try { await this.assignQuiz(userId); } catch { /* ignore */ }
        uf = await getDb().userMembershipFlow.findUnique({
          where: { userId },
          include: {
            quizExamSet: {
              include: { questions: { include: { question: true } } },
            },
          },
        });
      }
      if (!uf || !uf.quizExamSet) throw new NotFoundError("Chưa có bài trắc nghiệm");
    }

    const examSet = uf.quizExamSet;
    let correctCount = 0;
    const total = examSet.questions.length;

    for (const eq of examSet.questions) {
      const userAnswer = answers[eq.question.id];
      const isCorrect = userAnswer === eq.question.correctAnswer;
      if (isCorrect) correctCount++;
    }

    const passed = correctCount >= examSet.passScore;

    return { passed, correctCount, total, passScore: examSet.passScore };
  },

  async createQuizQuestion(data: { question: string; options: Record<string, string>; correctAnswer: string; orderIndex?: number }) {
    const flow = await flowService.getDefaultFlow();
    const { id: _, ...clean } = data as any;
    return getDb().quizQuestion.create({ data: { ...clean, membershipFlowId: flow.id, options: data.options } });
  },

  async updateQuizQuestion(id: string, data: { question?: string; options?: Record<string, string>; correctAnswer?: string }) {
    return getDb().quizQuestion.update({ where: { id }, data });
  },

  async deleteQuizQuestion(id: string) {
    return getDb().quizQuestion.delete({ where: { id } });
  },

  async createExamSet(data: {
    membershipFlowId: string; name: string; passScore?: number; questionIds?: string[];
  }) {
    const flow = await getDb().membershipFlow.findUnique({ where: { id: data.membershipFlowId } });
    if (!flow) throw new NotFoundError("Không tìm thấy flow");

    const examSet = await getDb().quizExamSet.create({
      data: {
        membershipFlowId: data.membershipFlowId,
        name: data.name,
        passScore: data.passScore ?? 9,
        questions: data.questionIds?.length
          ? { create: data.questionIds.map((qId, i) => ({ questionId: qId, orderIndex: i })) }
          : undefined,
      },
      include: { questions: { include: { question: true } } },
    });

    return examSet;
  },

  async updateExamSet(id: string, data: { name?: string; passScore?: number }) {
    const examSet = await getDb().quizExamSet.findUnique({ where: { id } });
    if (!examSet) throw new NotFoundError("Không tìm thấy bộ đề");

    return getDb().quizExamSet.update({
      where: { id },
      data,
      include: { questions: { include: { question: true }, orderBy: { orderIndex: "asc" } } },
    });
  },

  async deleteExamSet(id: string) {
    const examSet = await getDb().quizExamSet.findUnique({ where: { id } });
    if (!examSet) throw new NotFoundError("Không tìm thấy bộ đề");

    await getDb().quizExamSet.delete({ where: { id } });
    return { message: "Đã xóa" };
  },

  async addQuestionsToExamSet(examSetId: string, questionIds: string[]) {
    const examSet = await getDb().quizExamSet.findUnique({
      where: { id: examSetId },
      include: { questions: true },
    });
    if (!examSet) throw new NotFoundError("Không tìm thấy bộ đề");

    const existingIds = new Set(examSet.questions.map((q) => q.questionId));
    const newIds = questionIds.filter((qId) => !existingIds.has(qId));

    if (newIds.length === 0) return examSet;

    await getDb().quizExamSetQuestion.createMany({
      data: newIds.map((qId, i) => ({
        examSetId,
        questionId: qId,
        orderIndex: examSet.questions.length + i,
      })),
    });

    return getDb().quizExamSet.findUnique({
      where: { id: examSetId },
      include: { questions: { include: { question: true }, orderBy: { orderIndex: "asc" } } },
    });
  },

  async removeQuestionFromExamSet(examSetId: string, questionId: string) {
    const link = await getDb().quizExamSetQuestion.findUnique({
      where: { examSetId_questionId: { examSetId, questionId } },
    });
    if (!link) throw new NotFoundError("Câu hỏi không thuộc bộ đề này");

    await getDb().quizExamSetQuestion.delete({
      where: { examSetId_questionId: { examSetId, questionId } },
    });

    return { message: "Đã xóa" };
  },

  async getExamSets(membershipFlowId: string) {
    return getDb().quizExamSet.findMany({
      where: { membershipFlowId },
      include: {
        questions: { include: { question: true }, orderBy: { orderIndex: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
