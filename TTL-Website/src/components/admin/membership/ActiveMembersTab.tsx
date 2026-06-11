"use client"

import { getInitial } from "@/utils/cn";
import { useEffect, useRef, useState, useCallback } from "react"
import { Users, Clock, ChevronRight, CheckCircle2, Edit3, Loader2 } from "lucide-react"
import gsap from "gsap"
import { adminService } from "@/service/admin.service"
import { Skeleton } from "@/components/ui/Skeleton"
import Pagination from "@/components/admin/Pagination"

export default function ActiveMembersTab() {
  const [data, setData] = useState<{
    users: { user: { id: string; name: string; email: string }; flow: import("@/service/membership.service").UserFlow }[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [scoringLesson, setScoringLesson] = useState<string | null>(null)
  const [scoringSituation, setScoringSituation] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await adminService.getActiveMembers(page); setData(d) }
    catch {} finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  const handleScoreLesson = async (lessonId: string) => {
    const scoreStr = prompt("Điểm (0-10):")
    if (!scoreStr) return
    const score = parseInt(scoreStr, 10)
    if (isNaN(score) || score < 0 || score > 10) return alert("Điểm phải từ 0-10")
    const note = prompt("Ghi chú (không bắt buộc):")
    try { setScoringLesson(lessonId); await adminService.scoreLesson(lessonId, score, note || undefined); fetchData() }
    catch (err) { alert(err instanceof Error ? err.message : "Lỗi") }
    finally { setScoringLesson(null) }
  }

  const handleScoreSituation = async (userId: string, index: number) => {
    const scoreStr = prompt("Điểm (0-10):")
    if (!scoreStr) return
    const score = parseInt(scoreStr, 10)
    if (isNaN(score) || score < 0 || score > 10) return alert("Điểm phải từ 0-10")
    const note = prompt("Ghi chú (không bắt buộc):")
    try { setScoringSituation(`${userId}-${index}`); await adminService.scoreSituation(userId, index, score, note || undefined); fetchData() }
    catch (err) { alert(err instanceof Error ? err.message : "Lỗi") }
    finally { setScoringSituation(null) }
  }

  const handleComplete = async (userId: string) => {
    if (!confirm("Xác nhận hoàn thành luồng hội viên này?")) return
    try { setActionLoading(userId); await adminService.completeFlow(userId); fetchData() }
    catch (err) { alert(err instanceof Error ? err.message : "Lỗi") }
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
              const isExpanded = expanded === entry.user.id
              return (
                <div key={entry.user.id} className="mf-item rounded-2xl p-4 border card-hover transition-all" style={{
                  background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                  boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  border: "0.5px solid var(--border-base)",
                }}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : entry.user.id)}
                    className="w-full flex items-center justify-between gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}>
                        {getInitial(entry.user.name)}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold truncate">{entry.user.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{entry.user.email}</p>
                        <span className="text-[10px] mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
                          <Clock size={8} /> {entry.flow.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="shrink-0 transition-transform" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-dim)" }} />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: "var(--border-base)" }}>
                      {/* Score situation buttons */}
                      {entry.flow.status === "pending_review" && (
                        <div className="flex flex-wrap gap-2">
                          {entry.flow.situation1Link && entry.flow.situation1Score == null && (
                            <button
                              onClick={() => handleScoreSituation(entry.user.id, 0)}
                              disabled={scoringSituation === `${entry.user.id}-0`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                              style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}
                            >
                              {scoringSituation === `${entry.user.id}-0` ? <Loader2 size={12} className="animate-spin" /> : <Edit3 size={12} />}
                              Chấm tình huống 1
                            </button>
                          )}
                          {entry.flow.situation2Link && entry.flow.situation2Score == null && (
                            <button
                              onClick={() => handleScoreSituation(entry.user.id, 1)}
                              disabled={scoringSituation === `${entry.user.id}-1`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                              style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}
                            >
                              {scoringSituation === `${entry.user.id}-1` ? <Loader2 size={12} className="animate-spin" /> : <Edit3 size={12} />}
                              Chấm tình huống 2
                            </button>
                          )}
                        </div>
                      )}

                      {/* Complete button */}
                      {entry.flow.status === "pending_review" && (
                        <button
                          onClick={() => handleComplete(entry.user.id)}
                          disabled={actionLoading === entry.user.id}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                          style={{ background: "var(--color-success)", color: "#fff" }}
                        >
                          {actionLoading === entry.user.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
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
    </Skeleton>
  )
}



