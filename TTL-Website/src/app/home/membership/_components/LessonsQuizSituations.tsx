"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import {
  membershipService,
  type UserFlow,
  type UserLesson,
  type QuizData,
  type SituationData,
} from "@/service/membership.service";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

export default function LessonsQuizSituations({
  flow,
  onSuccess,
}: {
  flow: UserFlow;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<UserLesson[]>([]);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [situations, setSituations] = useState<SituationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"lessons" | "quiz" | "situations">("lessons");
  // Lesson submission
  const [submittingLesson, setSubmittingLesson] = useState<string | null>(null);
  const [lessonUrl, setLessonUrl] = useState("");
  // Quiz
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    correctCount: number;
    total: number;
    passScore: number;
  } | null>(null);
  // Situations
  const [situationLinks, setSituationLinks] = useState<Record<number, string>>(
    {},
  );
  const [submittingSituation, setSubmittingSituation] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        if (
          [
            "in_lessons",
            "pending_quiz",
            "pending_situations",
            "pending_review",
          ].includes(flow.status)
        ) {
          const [l, q, s] = await Promise.all([
            membershipService
              .getLessons()
              .catch(() => ({ lessons: [] as UserLesson[] })),
            membershipService.getQuiz().catch(() => null),
            membershipService.getSituations().catch(() => null),
          ]);
          setLessons(l.lessons);
          setQuiz(q);
          setSituations(s);
        }
      } catch (err: unknown) {
        toast(err instanceof Error ? err.message : "Lỗi tải dữ liệu", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [flow.status]);

  const handleSubmitLesson = async (lessonId: string) => {
    if (!lessonUrl.trim()) return;
    try {
      setSubmittingLesson(lessonId);
      await membershipService.submitLesson(lessonId, lessonUrl.trim());
      setLessonUrl("");
      toast("Đã nộp bài báo cáo thành công", "success");
      onSuccess();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Nộp bài báo cáo thất bại", "error");
    } finally {
      setSubmittingLesson(null);
    }
  };

  const handleSubmitQuiz = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (!quiz || answeredCount < quiz.questions.length) return;
    try {
      setSubmittingQuiz(true);
      const result = await membershipService.submitQuiz(selectedAnswers);
      setQuizResult(result);
      toast(
        result.passed
          ? "Chúc mừng! Bạn đã qua bài kiểm tra"
          : "Bài kiểm tra chưa đạt, hãy thử lại",
        result.passed ? "success" : "error",
      );
      onSuccess();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Nộp bài thất bại", "error");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleSubmitSituation = async (index: number) => {
    const link = situationLinks[index];
    if (!link?.trim()) return;
    try {
      setSubmittingSituation(index);
      await membershipService.submitSituation(index, link.trim());
      setSituationLinks((prev) => ({ ...prev, [index]: "" }));
      toast(`Đã nộp tình huống ${index}`, "success");
      onSuccess();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Nộp bài thất bại", "error");
    } finally {
      setSubmittingSituation(null);
    }
  };

  if (loading) {
    return (
      <div
        className="step-card rounded-2xl p-6"
        style={{
          background:
            "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
          boxShadow:
            "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
          border: "0.5px solid var(--border-base)",
        }}
      >
        <Skeleton name="lessons-loading" loading rows={4}>
          <div />
        </Skeleton>
      </div>
    );
  }

  const tabs = [
    {
      key: "lessons" as const,
      label: "Buổi học",
      icon: BookOpen,
      show:
        flow.status === "in_lessons" ||
        flow.status === "pending_quiz" ||
        flow.status === "pending_situations" ||
        flow.status === "pending_review",
    },
    {
      key: "quiz" as const,
      label: "Kiểm tra",
      icon: Brain,
      show:
        flow.status === "pending_quiz" ||
        flow.status === "pending_situations" ||
        flow.status === "pending_review",
    },
    {
      key: "situations" as const,
      label: "Tình huống",
      icon: FileText,
      show:
        flow.status === "pending_situations" ||
        flow.status === "pending_review",
    },
  ].filter((t) => t.show);

  return (
    <div
      className="step-card rounded-2xl p-6 space-y-4"
      style={{
        background:
          "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow:
          "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}
    >
      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{
          background: "color-mix(in srgb, var(--text-primary) 4%, transparent)",
        }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                active
                  ? "text-primary bg-primary/15"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Lessons tab */}
      {tab === "lessons" && (
        <div className="space-y-3">
          {lessons.length === 0 ? (
            <p
              className="text-xs text-center py-4"
              style={{ color: "var(--text-dim)" }}
            >
              Chưa có buổi học nào
            </p>
          ) : (
            lessons.map((lesson) => {
              const submitted =
                lesson.userLesson?.status === "submitted" ||
                lesson.userLesson?.status === "scored";
              const scored = lesson.userLesson?.status === "scored";
              return (
                <div
                  key={lesson.id}
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background:
                      "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{lesson.title}</p>
                      {lesson.description && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {lesson.description}
                        </p>
                      )}
                    </div>
                    {submitted && (
                      <span className="badge-approved text-[10px] shrink-0 rounded-lg px-2 py-1 flex justify-center items-center gap-1">
                        <CheckCircle2 size={10} /> Đã nộp
                      </span>
                    )}
                    {scored && lesson.userLesson?.score != null && (
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--clr-primary)" }}
                      >
                        {lesson.userLesson.score}/10
                      </span>
                    )}
                  </div>

                  {!submitted && (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={lessonUrl}
                        onChange={(e) => setLessonUrl(e.target.value)}
                        placeholder="Đường dẫn sản phẩm (URL)..."
                        className="flex-1 px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        style={{
                          background:
                            "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                          color: "var(--text-primary)",
                          border: "0.5px solid var(--border-base)",
                        }}
                      />
                      <button
                        onClick={() => handleSubmitLesson(lesson.id)}
                        disabled={
                          submittingLesson === lesson.id || !lessonUrl.trim()
                        }
                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={{
                          background: "var(--clr-primary)",
                          color: "#fff",
                        }}
                      >
                        {submittingLesson === lesson.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Nộp"
                        )}
                      </button>
                    </div>
                  )}

                  {lesson.userLesson?.adminNote && (
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--text-dim)" }}
                    >
                      Ghi chú: {lesson.userLesson.adminNote}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Quiz tab */}
      {tab === "quiz" && (
        <div className="space-y-4">
          {quizResult ? (
            <div className="text-center py-6 space-y-2">
              {quizResult.passed ? (
                <CheckCircle2
                  size={40}
                  className="mx-auto"
                  style={{ color: "var(--color-success)" }}
                />
              ) : (
                <AlertCircle
                  size={40}
                  className="mx-auto"
                  style={{ color: "var(--color-warning)" }}
                />
              )}
              <p className="text-sm font-semibold">
                {quizResult.passed ? "Chúc mừng!" : "Chưa đạt"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {quizResult.passed
                  ? "Bạn đã vượt qua bài kiểm tra!"
                  : "Bài kiểm tra chưa đạt. Vui lòng thử lại."}
              </p>
            </div>
          ) : quiz ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Bộ đề: {quiz.examSetName}
                </p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                  Cần đạt {quiz.passScore}/{quiz.total} câu &middot; Lần{" "}
                  {flow.quizAttempts + 1}
                </p>
              </div>

              {quiz.questions.map((q, qi) => (
                <div
                  key={q.id}
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background:
                      "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                  }}
                >
                  <p className="text-sm font-medium mb-2">
                    <span
                      className="text-xs font-bold mr-2"
                      style={{ color: "var(--clr-primary)" }}
                    >
                      Câu {qi + 1}.
                    </span>
                    {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt) => {
                      const selected = selectedAnswers[q.id] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.key,
                            }))
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all cursor-pointer ${
                            selected
                              ? "border-primary/40"
                              : "border-transparent hover:bg-[var(--glass-hover)]"
                          }`}
                          style={{
                            background: selected
                              ? "color-mix(in srgb, var(--clr-primary) 10%, transparent)"
                              : "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                          }}
                        >
                          <span className="font-medium mr-2">
                            {opt.key.toUpperCase()}.
                          </span>{" "}
                          {opt.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmitQuiz}
                disabled={
                  Object.keys(selectedAnswers).length < quiz.questions.length ||
                  submittingQuiz
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
                style={{ background: "var(--clr-primary)", color: "#fff" }}
              >
                {submittingQuiz ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {submittingQuiz
                  ? "Đang nộp..."
                  : `Nộp bài (${Object.keys(selectedAnswers).length}/${quiz.questions.length})`}
              </button>
            </div>
          ) : (
            <p
              className="text-xs text-center py-4"
              style={{ color: "var(--text-dim)" }}
            >
              Chưa có bài kiểm tra
            </p>
          )}
        </div>
      )}

      {/* Situations tab */}
      {tab === "situations" && (
        <div className="space-y-4">
          {situations?.situations && situations.situations.length > 0 ? (
            situations.situations.map((sit) => {
              const submitted = !!sit.link;
              return (
                <div
                  key={sit.id}
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background:
                      "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">
                        Tình huống {sit.index}: {sit.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {sit.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {submitted && (
                        <span className="badge-approved text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded-lg">
                          <CheckCircle2 size={10} /> Đã nộp
                        </span>
                      )}
                      {sit.score != null && (
                        <span
                          className="text-xs font-bold"
                          style={{ color: "var(--clr-primary)" }}
                        >
                          {sit.score}/10
                        </span>
                      )}
                    </div>
                  </div>

                  {!submitted && (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={situationLinks[sit.index] || ""}
                        onChange={(e) =>
                          setSituationLinks((prev) => ({
                            ...prev,
                            [sit.index]: e.target.value,
                          }))
                        }
                        placeholder="Đường dẫn Google Drive..."
                        className="flex-1 px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        style={{
                          background:
                            "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                          color: "var(--text-primary)",
                          border: "0.5px solid var(--border-base)",
                        }}
                      />
                      <button
                        onClick={() => handleSubmitSituation(sit.index)}
                        disabled={
                          submittingSituation === sit.index ||
                          !situationLinks[sit.index]?.trim()
                        }
                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={{
                          background: "var(--clr-primary)",
                          color: "#fff",
                        }}
                      >
                        {submittingSituation === sit.index ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Nộp"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p
              className="text-xs text-center py-4"
              style={{ color: "var(--text-dim)" }}
            >
              Chưa có tình huống
            </p>
          )}
        </div>
      )}

      {flow.status === "pending_review" && (
        <div className="text-center py-4 space-y-2">
          <Clock size={32} className="mx-auto opacity-40" />
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Quản trị viên đang chấm điểm bài của bạn. Vui lòng chờ kết quả.
          </p>
        </div>
      )}
    </div>
  );
}
