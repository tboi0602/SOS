import { NotFoundError, BadRequestError } from "../lib/errors";
import { getDb } from "../db";
import { notificationService } from "./notificationService";

export const membershipService = {
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

  async uploadDocuments(userId: string, documentsUrl: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");
    const allowed = ["pending_docs", "docs_submitted"];
    if (!allowed.includes(uf.status)) throw new BadRequestError("Trạng thái không hợp lệ");

    const mergedUrl = uf.documentsUrl
      ? `${uf.documentsUrl},${documentsUrl}`
      : documentsUrl;
    const newStatus = uf.status === "pending_docs" ? "docs_submitted" : uf.status;

    const updated = await getDb().userMembershipFlow.update({
      where: { userId },
      data: { documentsUrl: mergedUrl, status: newStatus },
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
      await this.assignQuiz(userId);
    }

    return ul;
  },

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

    const examSets = uf.membershipFlow.quizExamSets;
    if (examSets.length === 0) throw new BadRequestError("Chưa có bộ đề trắc nghiệm");

    const randomIdx = Math.floor(Math.random() * examSets.length);
    const examSet = examSets[randomIdx];

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "pending_quiz", quizExamSetId: examSet.id },
    });
  },

  async getQuiz(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({
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
    const uf = await getDb().userMembershipFlow.findUnique({
      where: { userId },
      include: {
        quizExamSet: {
          include: {
            questions: { include: { question: true } },
          },
        },
      },
    });
    if (!uf || !uf.quizExamSet) throw new NotFoundError("Chưa có bài trắc nghiệm");
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

  /* ===== Admin methods ===== */

  async getSettings() {
    const flow = await this.getDefaultFlow();
    const [lessons, quizQuestions, situationQuestions, examSets] = await Promise.all([
      getDb().lessonDef.findMany({ where: { membershipFlowId: flow.id }, orderBy: { orderIndex: "asc" } }),
      getDb().quizQuestion.findMany({ where: { membershipFlowId: flow.id }, orderBy: { orderIndex: "asc" } }),
      getDb().situationQuestion.findMany({ where: { membershipFlowId: flow.id }, orderBy: { orderIndex: "asc" } }),
      this.getExamSets(flow.id),
    ]);
    return { flow, lessons, quizQuestions, examSets, situationQuestions };
  },

  async updateFlow(data: { name?: string; price?: number; rules?: string }) {
    const flow = await this.getDefaultFlow();
    return getDb().membershipFlow.update({ where: { id: flow.id }, data });
  },

  async createLesson(data: { title: string; description?: string; type?: string; orderIndex?: number; content?: string }) {
    const flow = await this.getDefaultFlow();
    return getDb().lessonDef.create({ data: { ...data, membershipFlowId: flow.id } });
  },

  async updateLesson(id: string, data: { title?: string; description?: string; type?: string; orderIndex?: number; content?: string }) {
    return getDb().lessonDef.update({ where: { id }, data });
  },

  async deleteLesson(id: string) {
    return getDb().lessonDef.delete({ where: { id } });
  },

  async createQuizQuestion(data: { question: string; options: Record<string, string>; correctAnswer: string; orderIndex?: number }) {
    const flow = await this.getDefaultFlow();
    return getDb().quizQuestion.create({ data: { ...data, membershipFlowId: flow.id, options: data.options } });
  },

  async updateQuizQuestion(id: string, data: { question?: string; options?: Record<string, string>; correctAnswer?: string }) {
    return getDb().quizQuestion.update({ where: { id }, data });
  },

  async deleteQuizQuestion(id: string) {
    return getDb().quizQuestion.delete({ where: { id } });
  },

  async createSituationQuestion(data: { title: string; description: string; orderIndex?: number }) {
    const flow = await this.getDefaultFlow();
    return getDb().situationQuestion.create({ data: { ...data, membershipFlowId: flow.id } });
  },

  async updateSituationQuestion(id: string, data: { title?: string; description?: string }) {
    return getDb().situationQuestion.update({ where: { id }, data });
  },

  async deleteSituationQuestion(id: string) {
    return getDb().situationQuestion.delete({ where: { id } });
  },

  async getPendingDocs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: "docs_submitted" as const };
    const [flows, total] = await Promise.all([
      getDb().userMembershipFlow.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatar: true, memberId: true } } },
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
        include: { user: { select: { id: true, name: true, email: true, avatar: true, memberId: true } } },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().userMembershipFlow.count({ where }),
    ]);
    return { users: flows, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getActiveMembers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const statuses = ["in_lessons", "pending_quiz", "pending_situations", "pending_review", "completed"];
    const where = { status: { in: statuses } };
    const [flows, total] = await Promise.all([
      getDb().userMembershipFlow.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatar: true, memberId: true } } },
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

  async scoreLesson(lessonId: string, score: number, adminNote?: string) {
    const ul = await getDb().userLesson.findUnique({ where: { id: lessonId } });
    if (!ul) throw new NotFoundError("Không tìm thấy bài nộp");

    const updated = await getDb().userLesson.update({
      where: { id: lessonId },
      data: { score, adminNote, status: "scored" },
    });

    await this.recalcTotalScore(ul.userId);

    await notificationService.create({
      userId: ul.userId,
      title: "Bài học đã được chấm",
      content: `Bài học của bạn đã được chấm: ${score} điểm`,
      type: "membership",
      link: "/home/membership",
    });

    return updated;
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

    await this.recalcTotalScore(userId);

    await notificationService.create({
      userId,
      title: `Tình huống ${situationIndex} đã được chấm`,
      content: `Tình huống ${situationIndex} của bạn đã được chấm: ${score} điểm`,
      type: "membership",
      link: "/home/membership",
    });

    return { message: "Đã chấm điểm" };
  },

  async completeFlow(userId: string) {
    const uf = await getDb().userMembershipFlow.findUnique({ where: { userId } });
    if (!uf) throw new NotFoundError("Không tìm thấy flow");

    await getDb().userMembershipFlow.update({
      where: { userId },
      data: { status: "completed", completedAt: new Date() },
    });

    await getDb().user.update({
      where: { id: userId },
      data: { role: "user" },
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

  /* ─── Exam Set CRUD ─── */

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
