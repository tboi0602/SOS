"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, BookOpen, Brain, FileText, Star, Loader2 } from "lucide-react"
import { membershipService, type UserFlow, type UserLesson } from "@/service/membership.service"
import type { User } from "@/types/auth"

export default function CompletedStep({ flow, user }: { flow: UserFlow; user: User | null }) {
  const [lessons, setLessons] = useState<UserLesson[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    membershipService.getLessons()
      .then((res) => setLessons(res.lessons))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scoredLessons = lessons?.filter((l) => l.userLesson?.score != null) || []

  return (
    <div className="step-card rounded-2xl p-6 space-y-5" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <div className="text-center">
        <div className="size-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)" }}>
          <CheckCircle2 size={32} style={{ color: "var(--color-success)" }} />
        </div>
        <h3 className="text-lg font-bold mt-3">Chúc mừng!</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Bạn đã hoàn thành toàn bộ luồng hội viên. Chào mừng bạn đến với cộng đồng!
        </p>
        {user?.hasGraduated && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} style={{ color: "var(--color-success)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--color-success)" }}>
              Đã tốt nghiệp
            </span>
          </div>
        )}
      </div>

      {/* Score history */}
      <div className="rounded-xl p-4" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
        <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
          <Star size={12} /> Lịch sử điểm số
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-dim)" }} />
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>Đang tải...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Lessons */}
            {scoredLessons.length > 0 && (
              <div className="rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--clr-primary) 6%, transparent)" }}>
                <p className="text-[10px] font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                  <BookOpen size={10} /> Bài học
                </p>
                {scoredLessons.map((l) => (
                  <div key={l.id} className="flex items-center justify-between py-0.5">
                    <span className="text-xs">{l.title}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--clr-primary)" }}>{l.userLesson!.score}/10</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quiz */}
            {flow.quizScore != null && (
              <div className="rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--color-warning) 6%, transparent)" }}>
                <p className="text-[10px] font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                  <Brain size={10} /> Bài kiểm tra
                </p>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-xs">{flow.quizPassed ? "Đạt" : "Không đạt"}</span>
                  {flow.quizCorrectCount != null && (
                    <span className="text-xs font-bold" style={{ color: "var(--color-warning)" }}>{flow.quizCorrectCount} câu đúng</span>
                  )}
                </div>
              </div>
            )}

            {/* Situations */}
            {(flow.situation1Score != null || flow.situation2Score != null) && (
              <div className="rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--color-accent) 6%, transparent)" }}>
                <p className="text-[10px] font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                  <FileText size={10} /> Tình huống
                </p>
                {flow.situation1Score != null && (
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs">Tình huống 1</span>
                    <span className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>{flow.situation1Score}/10</span>
                  </div>
                )}
                {flow.situation2Score != null && (
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs">Tình huống 2</span>
                    <span className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>{flow.situation2Score}/10</span>
                  </div>
                )}
              </div>
            )}

            {/* Total */}
            {flow.totalScore != null && (
              <div className="flex items-center justify-between pt-2 mt-2 border-t" style={{ borderColor: "var(--border-base)" }}>
                <span className="text-xs font-semibold">Tổng điểm</span>
                <span className="text-sm font-bold" style={{ color: "var(--clr-primary)" }}>{flow.totalScore}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {flow.membershipFlow?.rules && (
        <div className="rounded-xl p-4" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>Nội quy:</p>
          <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-dim)" }}>{flow.membershipFlow.rules}</p>
        </div>
      )}
    </div>
  )
}
