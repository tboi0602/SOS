"use client"

import { getInitial } from "@/utils/cn";
import { useEffect, useRef, useState, useCallback } from "react"
import { Users, Clock, ChevronRight, CheckCircle2, Edit3, Loader2, BookOpen, ExternalLink, FileText, Star } from "lucide-react"
import gsap from "gsap"
import { adminService } from "@/service/admin.service"
import { Skeleton } from "@/components/ui/Skeleton"
import Pagination from "@/components/admin/Pagination"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import { useToast } from "@/components/ui/Toast"
import type { UserLesson, UserFlow } from "@/service/membership.service"

const STATUS_LABELS: Record<string, string> = {
  in_lessons: "Đang học",
  pending_quiz: "Chờ kiểm tra",
  pending_situations: "Chờ nộp tình huống",
  pending_review: "Đang chấm",
  completed: "Hoàn thành",
}

export default function ActiveMembersTab() {
  const { toast } = useToast()
  const [data, setData] = useState<{
    users: (UserFlow & { user: { id: string; name: string; email: string } })[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [expandedLessons, setExpandedLessons] = useState<Record<string, UserLesson[]>>({})
  const [loadingLessons, setLoadingLessons] = useState<Record<string, boolean>>({})
  const [confirmComplete, setConfirmComplete] = useState<string | null>(null)
  const [scoringLesson, setScoringLesson] = useState<string | null>(null)
  const [scoringSituation, setScoringSituation] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [scoreInputs, setScoreInputs] = useState<Record<string, { score: string; note: string }>>({})
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await adminService.getActiveMembers(page, 20); setData(d) }
    catch {} finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  const toggleExpand = async (userId: string) => {
    if (expanded === userId) { setExpanded(null); return }
    setExpanded(userId)
    if (!expandedLessons[userId]) {
      setLoadingLessons((prev) => ({ ...prev, [userId]: true }))
      try {
        const res = await adminService.getUserLessons(userId)
        setExpandedLessons((prev) => ({ ...prev, [userId]: res.lessons }))
      } catch { /* ignore */ }
      finally { setLoadingLessons((prev) => ({ ...prev, [userId]: false })) }
    }
  }

  const handleScoreLesson = async (lessonId: string) => {
    const input = scoreInputs[`lesson-${lessonId}`]
    if (!input) return
    const score = parseInt(input.score, 10)
    if (isNaN(score) || score < 0 || score > 10) { toast("Điểm phải từ 0-10", "error"); return }
    try {
      setScoringLesson(lessonId)
      await adminService.scoreLesson(lessonId, score, input.note || undefined)
      toast("Đã chấm điểm", "success")
      setScoreInputs((prev) => { const n = { ...prev }; delete n[`lesson-${lessonId}`]; return n })
      fetchData()
    } catch (err) { toast(err instanceof Error ? err.message : "Lỗi", "error") }
    finally { setScoringLesson(null) }
  }

  const handleScoreSituation = async (userId: string, index: number) => {
    const key = `situation-${userId}-${index}`
    const input = scoreInputs[key]
    if (!input) return
    const score = parseInt(input.score, 10)
    if (isNaN(score) || score < 0 || score > 10) { toast("Điểm phải từ 0-10", "error"); return }
    try {
      setScoringSituation(`${userId}-${index}`)
      await adminService.scoreSituation(userId, index, score, input.note || undefined)
      toast("Đã chấm điểm", "success")
      setScoreInputs((prev) => { const n = { ...prev }; delete n[key]; return n })
      fetchData()
    } catch (err) { toast(err instanceof Error ? err.message : "Lỗi", "error") }
    finally { setScoringSituation(null) }
  }

  const handleComplete = async (userId: string) => {
    try { setActionLoading(userId); await adminService.completeFlow(userId); toast("Đã hoàn thành luồng", "success"); setConfirmComplete(null); fetchData() }
    catch (err) { toast(err instanceof Error ? err.message : "Lỗi", "error") }
    finally { setActionLoading(null) }
  }

  return (
    <Skeleton name="mf-active" loading={loading} rows={5}>
      {!data || data.users.length === 0 ? (
        <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium opacity-60">Không có hội viên đang học</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="grid gap-3">
            {data.users.map((entry) => {
              const flow = entry as UserFlow & { user: { id: string; name: string; email: string }; situation1?: { title: string; description: string }; situation2?: { title: string; description: string } }
              const isExpanded = expanded === flow.user.id
              const lessons = expandedLessons[flow.user.id]
              const loadingLessonsForUser = loadingLessons[flow.user.id]
              return (
                <div key={flow.user.id} className="mf-item rounded-2xl border card-hover transition-all" style={{
                  background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                  boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  border: "0.5px solid var(--border-base)",
                }}>
                  <button
                    onClick={() => toggleExpand(flow.user.id)}
                    className="w-full flex items-center justify-between gap-3 p-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}>
                        {getInitial(flow.user.name)}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold truncate">{flow.user.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{flow.user.email}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
                            <Clock size={8} /> {STATUS_LABELS[flow.status] || flow.status}
                          </span>
                          {flow.totalScore != null && (
                            <span className="text-[10px] inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--color-warning) 12%, transparent)", color: "var(--color-warning)" }}>
                              <Star size={8} /> {flow.totalScore}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="shrink-0 transition-transform" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-dim)" }} />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="border-t pt-3" style={{ borderColor: "var(--border-base)" }} />

                      {/* Lessons section */}
                      <div>
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                          <BookOpen size={12} /> Bài học
                        </p>
                        {loadingLessonsForUser ? (
                          <div className="flex items-center gap-2 py-2">
                            <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-dim)" }} />
                            <span className="text-xs" style={{ color: "var(--text-dim)" }}>Đang tải...</span>
                          </div>
                        ) : lessons && lessons.length > 0 ? (
                          <div className="space-y-2">
                            {lessons.map((lesson) => {
                              const isSubmitted = lesson.userLesson?.status === "submitted" || lesson.userLesson?.status === "scored"
                              const isScored = lesson.userLesson?.status === "scored"
                              return (
                                <div key={lesson.id} className="rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium">{lesson.title}</p>
                                      {lesson.description && <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{lesson.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {isSubmitted && (
                                        <span className="text-[10px] inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                          <CheckCircle2 size={8} /> Đã nộp
                                        </span>
                                      )}
                                      {isScored && lesson.userLesson?.score != null && (
                                        <span className="text-xs font-bold" style={{ color: "var(--clr-primary)" }}>{lesson.userLesson.score}/10</span>
                                      )}
                                    </div>
                                  </div>
                                  {lesson.userLesson?.productUrl && (
                                    <a href={lesson.userLesson.productUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] mt-1 hover:underline" style={{ color: "var(--clr-primary)" }}>
                                      <ExternalLink size={8} /> Xem sản phẩm
                                    </a>
                                  )}
                                  {lesson.userLesson?.adminNote && (
                                    <p className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>Ghi chú: {lesson.userLesson.adminNote}</p>
                                  )}
                                  {isSubmitted && !isScored && (() => {
                                    const lessonKey = `lesson-${lesson.userLesson!.id}`
                                    const isEditing = lessonKey in scoreInputs
                                    return isEditing ? (
                                      <div className="mt-2 space-y-1.5">
                                        <input
                                          type="number" min={0} max={10}
                                          value={scoreInputs[lessonKey].score}
                                          onChange={(e) => setScoreInputs((prev) => ({ ...prev, [lessonKey]: { ...prev[lessonKey], score: e.target.value } }))}
                                          placeholder="0-10"
                                          className="w-20 px-2 py-1 rounded-lg text-[10px] border outline-none"
                                          style={{ background: "transparent", borderColor: "var(--border-base)", color: "var(--text-primary)" }}
                                        />
                                        <input
                                          type="text"
                                          value={scoreInputs[lessonKey].note}
                                          onChange={(e) => setScoreInputs((prev) => ({ ...prev, [lessonKey]: { ...prev[lessonKey], note: e.target.value } }))}
                                          placeholder="Ghi chú (không bắt buộc)"
                                          className="w-full px-2 py-1 rounded-lg text-[10px] border outline-none"
                                          style={{ background: "transparent", borderColor: "var(--border-base)", color: "var(--text-primary)" }}
                                        />
                                        <div className="flex gap-1.5">
                                          <button
                                            onClick={() => handleScoreLesson(lesson.userLesson!.id)}
                                            disabled={scoringLesson === lesson.userLesson!.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                                            style={{ background: "var(--color-success)", color: "#fff" }}
                                          >
                                            {scoringLesson === lesson.userLesson!.id ? <Loader2 size={10} className="animate-spin" /> : null}
                                            Lưu
                                          </button>
                                          <button
                                            onClick={() => setScoreInputs((prev) => { const n = { ...prev }; delete n[lessonKey]; return n })}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                                            style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-secondary)" }}
                                          >
                                            Huỷ
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setScoreInputs((prev) => ({ ...prev, [lessonKey]: { score: "", note: "" } }))}
                                        disabled={scoringLesson === lesson.userLesson!.id}
                                        className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                                        style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}
                                      >
                                        {scoringLesson === lesson.userLesson!.id ? <Loader2 size={10} className="animate-spin" /> : <Edit3 size={10} />}
                                        Chấm điểm
                                      </button>
                                    )
                                  })()}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-xs" style={{ color: "var(--text-dim)" }}>Chưa có bài học</p>
                        )}
                      </div>

                      {/* Situations section */}
                      {(flow.situation1Link || flow.situation2Link) && (
                        <div>
                          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                            <FileText size={12} /> Tình huống
                          </p>
                          <div className="space-y-2">
                            {flow.situation1Link && (
                              <div className="rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium">
                                      Tình huống 1: {flow.situation1?.title || ""}
                                    </p>
                                    {flow.situation1?.description && (
                                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{flow.situation1.description}</p>
                                    )}
                                    <a href={flow.situation1Link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] mt-1 hover:underline" style={{ color: "var(--clr-primary)" }}>
                                      <ExternalLink size={8} /> Xem bài nộp
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {((): React.ReactNode => {
                                      const sitKey1 = `situation-${flow.user.id}-1`
                                      if (flow.situation1Score != null) {
                                        return <span className="text-xs font-bold" style={{ color: "var(--clr-primary)" }}>{flow.situation1Score}/10</span>
                                      }
                                      if (sitKey1 in scoreInputs) {
                                        return (
                                          <div className="space-y-1.5">
                                            <input type="number" min={0} max={10} value={scoreInputs[sitKey1].score} onChange={(e) => setScoreInputs((prev) => ({ ...prev, [sitKey1]: { ...prev[sitKey1], score: e.target.value } }))} placeholder="0-10" className="w-20 px-2 py-1 rounded-lg text-[10px] border outline-none" style={{ background: "transparent", borderColor: "var(--border-base)", color: "var(--text-primary)" }} />
                                            <input type="text" value={scoreInputs[sitKey1].note} onChange={(e) => setScoreInputs((prev) => ({ ...prev, [sitKey1]: { ...prev[sitKey1], note: e.target.value } }))} placeholder="Ghi chú" className="w-full px-2 py-1 rounded-lg text-[10px] border outline-none" style={{ background: "transparent", borderColor: "var(--border-base)", color: "var(--text-primary)" }} />
                                            <div className="flex gap-1.5">
                                              <button onClick={() => handleScoreSituation(flow.user.id, 1)} disabled={scoringSituation === `${flow.user.id}-1`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50" style={{ background: "var(--color-success)", color: "#fff" }}>
                                                {scoringSituation === `${flow.user.id}-1` ? <Loader2 size={10} className="animate-spin" /> : null} Lưu
                                              </button>
                                              <button onClick={() => setScoreInputs((prev) => { const n = { ...prev }; delete n[sitKey1]; return n })} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer" style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-secondary)" }}>
                                                Huỷ
                                              </button>
                                            </div>
                                          </div>
                                        )
                                      }
                                      return (
                                        <button
                                          onClick={() => setScoreInputs((prev) => ({ ...prev, [sitKey1]: { score: "", note: "" } }))}
                                          disabled={scoringSituation === `${flow.user.id}-1`}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                                          style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}
                                        >
                                          {scoringSituation === `${flow.user.id}-1` ? <Loader2 size={10} className="animate-spin" /> : <Edit3 size={10} />}
                                          Chấm
                                        </button>
                                      )
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}
                            {flow.situation2Link && (
                              <div className="rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium">
                                      Tình huống 2: {flow.situation2?.title || ""}
                                    </p>
                                    {flow.situation2?.description && (
                                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{flow.situation2.description}</p>
                                    )}
                                    <a href={flow.situation2Link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] mt-1 hover:underline" style={{ color: "var(--clr-primary)" }}>
                                      <ExternalLink size={8} /> Xem bài nộp
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {((): React.ReactNode => {
                                      const sitKey2 = `situation-${flow.user.id}-2`
                                      if (flow.situation2Score != null) {
                                        return <span className="text-xs font-bold" style={{ color: "var(--clr-primary)" }}>{flow.situation2Score}/10</span>
                                      }
                                      if (sitKey2 in scoreInputs) {
                                        return (
                                          <div className="space-y-1.5">
                                            <input type="number" min={0} max={10} value={scoreInputs[sitKey2].score} onChange={(e) => setScoreInputs((prev) => ({ ...prev, [sitKey2]: { ...prev[sitKey2], score: e.target.value } }))} placeholder="0-10" className="w-20 px-2 py-1 rounded-lg text-[10px] border outline-none" style={{ background: "transparent", borderColor: "var(--border-base)", color: "var(--text-primary)" }} />
                                            <input type="text" value={scoreInputs[sitKey2].note} onChange={(e) => setScoreInputs((prev) => ({ ...prev, [sitKey2]: { ...prev[sitKey2], note: e.target.value } }))} placeholder="Ghi chú" className="w-full px-2 py-1 rounded-lg text-[10px] border outline-none" style={{ background: "transparent", borderColor: "var(--border-base)", color: "var(--text-primary)" }} />
                                            <div className="flex gap-1.5">
                                              <button onClick={() => handleScoreSituation(flow.user.id, 2)} disabled={scoringSituation === `${flow.user.id}-2`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50" style={{ background: "var(--color-success)", color: "#fff" }}>
                                                {scoringSituation === `${flow.user.id}-2` ? <Loader2 size={10} className="animate-spin" /> : null} Lưu
                                              </button>
                                              <button onClick={() => setScoreInputs((prev) => { const n = { ...prev }; delete n[sitKey2]; return n })} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer" style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-secondary)" }}>
                                                Huỷ
                                              </button>
                                            </div>
                                          </div>
                                        )
                                      }
                                      return (
                                        <button
                                          onClick={() => setScoreInputs((prev) => ({ ...prev, [sitKey2]: { score: "", note: "" } }))}
                                          disabled={scoringSituation === `${flow.user.id}-2`}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                                          style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}
                                        >
                                          {scoringSituation === `${flow.user.id}-2` ? <Loader2 size={10} className="animate-spin" /> : <Edit3 size={10} />}
                                          Chấm
                                        </button>
                                      )
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Complete button */}
                      {flow.status === "pending_review" && (
                        <button
                          onClick={() => setConfirmComplete(flow.user.id)}
                          disabled={actionLoading === flow.user.id}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                          style={{ background: "var(--color-success)", color: "#fff" }}
                        >
                          {actionLoading === flow.user.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Hoàn thành luồng
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} variant="simple" />
        </>
      )}

      <ConfirmDialog
        open={!!confirmComplete}
        title="Hoàn thành luồng"
        message="Xác nhận hoàn thành luồng hội viên này? Hành động này không thể hoàn tác."
        confirmLabel="Hoàn thành"
        variant="primary"
        onConfirm={() => confirmComplete && handleComplete(confirmComplete)}
        onCancel={() => setConfirmComplete(null)}
      />
    </Skeleton>
  )
}
