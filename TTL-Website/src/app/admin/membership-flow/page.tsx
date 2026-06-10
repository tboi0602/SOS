"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Upload, CreditCard, Users, Settings, FileText, BookOpen,
  Brain, CheckCircle2, Clock, AlertCircle, X, Plus,
  Loader2, ChevronRight, Trash2, Edit3,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { adminService } from "@/service/admin.service"
import { membershipService, type MembershipSettings } from "@/service/membership.service"
import { Skeleton } from "@/components/ui/Skeleton"
import Pagination from "@/components/admin/Pagination"

gsap.registerPlugin(ScrollTrigger)

const TABS = [
  { key: "pending-docs", label: "Chờ duyệt hồ sơ", icon: Upload },
  { key: "pending-payments", label: "Chờ xác minh TT", icon: CreditCard },
  { key: "active", label: "Hội viên đang học", icon: Users },
  { key: "settings", label: "Cấu hình", icon: Settings },
] as const

type TabKey = (typeof TABS)[number]["key"]

export default function AdminMembershipFlowPage() {
  const [tab, setTab] = useState<TabKey>("pending-docs")
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tabsRef.current
    const indicator = indicatorRef.current
    if (!el || !indicator) return
    const active = el.querySelector<HTMLButtonElement>(`[data-mf-tab="${tab}"]`)
    if (!active) return
    indicator.style.width = `${active.offsetWidth}px`
    indicator.style.transform = `translateX(${active.offsetLeft}px)`
  }, [tab])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        if (headerRef.current) {
          gsap.from(headerRef.current, { y: 20, opacity: 0, duration: 0.4, ease: "power3.out", scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none none" } })
        }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div ref={headerRef}>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Users size={20} /> Quản lý đăng ký thành viên
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            Quản lý các bước trong luồng đăng ký hội viên
          </p>
        </div>

        {/* Tab bar */}
        <div className="relative flex gap-1 p-1 rounded-2xl w-fit" style={{
          background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
          boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
          border: "0.5px solid var(--border-base)",
        }}>
          <div ref={tabsRef} className="flex gap-1">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  data-mf-tab={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors duration-200 cursor-pointer min-h-10 ${
                    active ? "text-primary" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              )
            })}
          </div>
          <div
            ref={indicatorRef}
            className="absolute top-1 bottom-1 rounded-xl transition-all duration-300 pointer-events-none"
            style={{ width: 0, transform: "translateX(0)", background: "color-mix(in srgb, var(--clr-primary) 25%, transparent)", border: "0.5px solid color-mix(in srgb, var(--clr-primary) 40%, transparent)" }}
          />
        </div>

        {/* Tab content */}
        <div ref={contentRef}>
          {tab === "pending-docs" && <PendingDocsTab />}
          {tab === "pending-payments" && <PendingPaymentsTab />}
          {tab === "active" && <ActiveMembersTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

/* ─── Pending Docs Tab ─── */
function PendingDocsTab() {
  const [data, setData] = useState<{
    users: { user: { id: string; name: string; email: string; memberId: string | null }; flow: import("@/service/membership.service").UserFlow }[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await adminService.getPendingDocs(page); setData(d) }
    catch {} finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  const handleApprove = async (userId: string) => {
    try { setActionLoading(userId); await adminService.approveDocs(userId); fetchData() }
    catch {} finally { setActionLoading(null) }
  }
  const handleReject = async (userId: string) => {
    const note = prompt("Lý do từ chối:")
    if (!note) return
    try { setActionLoading(userId); await adminService.rejectDocs(userId, note); fetchData() }
    catch {} finally { setActionLoading(null) }
  }

  return (
    <Skeleton name="mf-pending-docs" loading={loading} rows={5}>
      {!data || data.users.length === 0 ? (
        <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <Upload size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium opacity-60">Không có hồ sơ chờ duyệt</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="grid gap-3">
            {data.users.map((entry) => (
              <div key={entry.user.id} className="mf-item rounded-2xl p-4 border card-hover transition-all" style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}>
                      {entry.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{entry.user.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{entry.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(entry.user.id)}
                      disabled={actionLoading === entry.user.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)", color: "var(--color-success)" }}
                    >
                      {actionLoading === entry.user.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(entry.user.id)}
                      disabled={actionLoading === entry.user.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, var(--danger) 15%, transparent)", color: "var(--danger)" }}
                    >
                      <X size={12} /> Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} variant="simple" />
        </>
      )}
    </Skeleton>
  )
}

/* ─── Pending Payments Tab ─── */
function PendingPaymentsTab() {
  const [data, setData] = useState<{
    users: { user: { id: string; name: string; email: string; memberId: string | null }; flow: import("@/service/membership.service").UserFlow }[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await adminService.getPendingPayments(page); setData(d) }
    catch {} finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  const handleVerify = async (userId: string) => {
    try { setActionLoading(userId); await adminService.verifyPayment(userId); fetchData() }
    catch {} finally { setActionLoading(null) }
  }
  const handleReject = async (userId: string) => {
    const note = prompt("Lý do từ chối:")
    if (!note) return
    try { setActionLoading(userId); await adminService.rejectPayment(userId, note); fetchData() }
    catch {} finally { setActionLoading(null) }
  }

  return (
    <Skeleton name="mf-pending-payments" loading={loading} rows={5}>
      {!data || data.users.length === 0 ? (
        <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium opacity-60">Không có thanh toán chờ xác minh</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="grid gap-3">
            {data.users.map((entry) => (
              <div key={entry.user.id} className="mf-item rounded-2xl p-4 border card-hover transition-all" style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}>
                      {entry.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{entry.user.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{entry.user.email}</p>
                      {entry.flow.paymentConfirmedAt && (
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-dim)" }}>
                          Xác nhận: {new Date(entry.flow.paymentConfirmedAt).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(entry.user.id)}
                      disabled={actionLoading === entry.user.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)", color: "var(--color-success)" }}
                    >
                      {actionLoading === entry.user.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Xác nhận
                    </button>
                    <button
                      onClick={() => handleReject(entry.user.id)}
                      disabled={actionLoading === entry.user.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, var(--danger) 15%, transparent)", color: "var(--danger)" }}
                    >
                      <X size={12} /> Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} variant="simple" />
        </>
      )}
    </Skeleton>
  )
}

/* ─── Active Members Tab ─── */
function ActiveMembersTab() {
  const [data, setData] = useState<{
    users: { user: { id: string; name: string; email: string; memberId: string | null }; flow: import("@/service/membership.service").UserFlow }[]
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
                        {entry.user.name.charAt(0).toUpperCase()}
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

/* ─── Settings Tab ─── */
function SettingsTab() {
  const [settings, setSettings] = useState<MembershipSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [flowName, setFlowName] = useState("")
  const [flowPrice, setFlowPrice] = useState(6000000)
  const [flowRules, setFlowRules] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const s = await adminService.getMembershipSettings()
      setSettings(s)
      setFlowName(s.flow?.name || "")
      setFlowPrice(s.flow?.price || 6000000)
      setFlowRules(s.flow?.rules || "")
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-section"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [settings])

  const handleSaveFlow = async () => {
    try {
      setSaving(true); setMessage(null)
      await adminService.updateMembershipFlow({ name: flowName, price: flowPrice, rules: flowRules })
      setMessage("Đã lưu cấu hình luồng")
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Lỗi")
    } finally { setSaving(false) }
  }

  if (loading) {
    return <Skeleton name="mf-settings" loading rows={8}><div /></Skeleton>
  }

  return (
    <div ref={listRef} className="max-w-3xl space-y-6">
      {/* Flow settings */}
      <div className="mf-section rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings size={16} style={{ color: "var(--clr-primary)" }} />
          Cấu hình luồng hội viên
        </h3>

        <div className="grid gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-tertiary)" }}>Tên luồng</label>
            <input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-tertiary)" }}>Phí hội viên (VNĐ)</label>
            <input
              type="number"
              value={flowPrice}
              onChange={(e) => setFlowPrice(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-tertiary)" }}>Nội quy</label>
            <textarea
              value={flowRules}
              onChange={(e) => setFlowRules(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
              style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
            />
          </div>
        </div>

        {message && <p className="text-xs" style={{ color: message.startsWith("Đã") ? "var(--color-success)" : "var(--danger)" }}>{message}</p>}

        <button
          onClick={handleSaveFlow}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          style={{ background: "var(--clr-primary)", color: "#fff" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Lưu cấu hình
        </button>
      </div>

      {/* Lessons list */}
      <div className="mf-section rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <BookOpen size={16} style={{ color: "var(--clr-primary)" }} />
            Bài học ({settings?.lessons?.length || 0})
          </h3>
          <AddLessonButton onSuccess={fetchSettings} />
        </div>
        {settings && settings.lessons.length > 0 ? (
          <div className="space-y-2">
            {settings.lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onSuccess={fetchSettings} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>Chưa có bài học nào</p>
        )}
      </div>

      {/* Quiz questions */}
      <div className="mf-section rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Brain size={16} style={{ color: "var(--clr-primary)" }} />
            Câu hỏi trắc nghiệm ({settings?.quizQuestions?.length || 0})
          </h3>
          <AddQuizQuestionButton onSuccess={fetchSettings} />
        </div>
        {settings && settings.quizQuestions.length > 0 ? (
          <div className="space-y-2">
            {settings.quizQuestions.map((q) => (
              <QuizQuestionCard key={q.id} question={q} onSuccess={fetchSettings} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>Chưa có câu hỏi nào</p>
        )}
      </div>

      {/* Exam Sets */}
      <div className="mf-section rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Brain size={16} style={{ color: "var(--clr-primary)" }} />
            Bộ đề trắc nghiệm ({settings?.examSets?.length || 0})
          </h3>
          <AddExamSetButton
            flowId={settings?.flow?.id || ""}
            allQuestions={settings?.quizQuestions || []}
            onSuccess={fetchSettings}
          />
        </div>
        {settings && settings.examSets.length > 0 ? (
          <div className="space-y-3">
            {settings.examSets.map((examSet) => (
              <ExamSetCard
                key={examSet.id}
                examSet={examSet}
                allQuestions={settings?.quizQuestions || []}
                onSuccess={fetchSettings}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>
            Chưa có bộ đề nào. Tạo bộ đề để nhóm các câu hỏi trắc nghiệm.
          </p>
        )}
      </div>

      {/* Situation questions */}
      <div className="mf-section rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileText size={16} style={{ color: "var(--clr-primary)" }} />
            Câu hỏi tình huống ({settings?.situationQuestions?.length || 0})
          </h3>
          <AddSituationButton onSuccess={fetchSettings} />
        </div>
        {settings && settings.situationQuestions.length > 0 ? (
          <div className="space-y-2">
            {settings.situationQuestions.map((s) => (
              <SituationCard key={s.id} situation={s} onSuccess={fetchSettings} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>Chưa có câu hỏi tình huống nào</p>
        )}
      </div>
    </div>
  )
}

/* ─── Lesson Card ─── */
function LessonCard({ lesson, onSuccess }: { lesson: MembershipSettings["lessons"][0]; onSuccess: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(lesson.title)
  const [description, setDescription] = useState(lesson.description || "")
  const [type, setType] = useState(lesson.type)
  const [content, setContent] = useState(lesson.content || "")

  const handleSave = async () => {
    try { setDeleting(true); await adminService.updateLesson(lesson.id, { title, description, type, content }); onSuccess(); setEditing(false) }
    catch {} finally { setDeleting(false) }
  }
  const handleDelete = async () => {
    if (!confirm("Xóa bài học này?")) return
    try { setDeleting(true); await adminService.deleteLesson(lesson.id); onSuccess() }
    catch {} finally { setDeleting(false) }
  }

  if (editing) {
    return (
      <div className="rounded-xl p-3 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Tiêu đề" />
        <input value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Mô tả" />
        <input value={type} onChange={(e) => setType(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Loại (video/text)" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={2}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Nội dung" />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={deleting}
            className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}>
            {deleting ? <Loader2 size={12} className="animate-spin" /> : "Lưu"}
          </button>
          <button onClick={() => setEditing(false)}
            className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
            Hủy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{lesson.title}</p>
        <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>{lesson.type} &middot; Thứ tự {lesson.orderIndex}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}>
          <Edit3 size={12} />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--danger)" }}>
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>
    </div>
  )
}

/* ─── Add Lesson Button ─── */
function AddLessonButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("video")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    try {
      setSaving(true)
      await adminService.createLesson({
        id: "", title, description, type, orderIndex: 0, content,
      } as MembershipSettings["lessons"][0])
      onSuccess(); setOpen(false); setTitle(""); setDescription(""); setContent("")
    } catch {} finally { setSaving(false) }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
        <Plus size={12} /> Thêm
      </button>
    )
  }

  return (
    <div className="rounded-xl p-3 space-y-2 border" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", borderColor: "var(--border-base)" }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Tiêu đề bài học" />
      <input value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Mô tả" />
      <input value={type} onChange={(e) => setType(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Loại (video/text)" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={2}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Nội dung" />
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !title.trim()}
          className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
          style={{ background: "var(--clr-primary)", color: "#fff" }}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : "Thêm"}
        </button>
        <button onClick={() => setOpen(false)}
          className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
          Hủy
        </button>
      </div>
    </div>
  )
}

/* ─── Quiz Question Card ─── */
function QuizQuestionCard({ question, onSuccess }: { question: MembershipSettings["quizQuestions"][0]; onSuccess: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [qText, setQText] = useState(question.question)
  const [options, setOptions] = useState(question.options)
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer)

  const handleSave = async () => {
    try { setDeleting(true); await adminService.updateQuizQuestion(question.id, { question: qText, options, correctAnswer }); onSuccess(); setEditing(false) }
    catch {} finally { setDeleting(false) }
  }
  const handleDelete = async () => {
    if (!confirm("Xóa câu hỏi này?")) return
    try { setDeleting(true); await adminService.deleteQuizQuestion(question.id); onSuccess() }
    catch {} finally { setDeleting(false) }
  }

  const addOption = () => {
    const key = String.fromCharCode(97 + Object.keys(options).length)
    setOptions({ ...options, [key]: "" })
  }
  const updateOption = (key: string, value: string) => {
    setOptions({ ...options, [key]: value })
  }
  const removeOption = (key: string) => {
    const next = { ...options }
    delete next[key]
    setOptions(next)
  }

  if (editing) {
    return (
      <div className="rounded-xl p-3 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
        <textarea value={qText} onChange={(e) => setQText(e.target.value)} rows={2}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Câu hỏi" />
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold" style={{ color: correctAnswer === key ? "var(--color-success)" : "var(--text-dim)" }}>{key.toUpperCase()}</span>
            <input value={value} onChange={(e) => updateOption(key, e.target.value)}
              className="flex-1 px-2 py-1 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }} />
            <button onClick={() => { setCorrectAnswer(key) }}
              className="px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
              style={{ background: correctAnswer === key ? "color-mix(in srgb, var(--color-success) 20%, transparent)" : "transparent", color: correctAnswer === key ? "var(--color-success)" : "var(--text-dim)" }}>
              Đúng
            </button>
            <button onClick={() => removeOption(key)}
              className="p-1 rounded cursor-pointer" style={{ color: "var(--text-dim)" }}>
              <X size={10} />
            </button>
          </div>
        ))}
        <button onClick={addOption}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}>
          <Plus size={10} /> Thêm đáp án
        </button>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={deleting}
            className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}>
            {deleting ? <Loader2 size={12} className="animate-spin" /> : "Lưu"}
          </button>
          <button onClick={() => setEditing(false)}
            className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
            Hủy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
      <p className="text-xs truncate flex-1">{question.question}</p>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}>
          <Edit3 size={12} />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--danger)" }}>
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>
    </div>
  )
}

/* ─── Add Quiz Question Button ─── */
function AddQuizQuestionButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<Record<string, string>>({ a: "", b: "", c: "", d: "" })
  const [correctAnswer, setCorrectAnswer] = useState("a")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!question.trim() || !correctAnswer) return
    try {
      setSaving(true)
      await adminService.createQuizQuestion({ id: "", question, options, correctAnswer } as MembershipSettings["quizQuestions"][0])
      onSuccess(); setOpen(false); setQuestion(""); setOptions({ a: "", b: "", c: "", d: "" }); setCorrectAnswer("a")
    } catch {} finally { setSaving(false) }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
        <Plus size={12} /> Thêm
      </button>
    )
  }

  return (
    <div className="rounded-xl p-3 space-y-2 border" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", borderColor: "var(--border-base)" }}>
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={2}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Câu hỏi" />
      {Object.entries(options).map(([key, value]) => (
        <div key={key} className="flex items-center gap-1">
          <span className="text-[10px] font-mono font-bold" style={{ color: correctAnswer === key ? "var(--color-success)" : "var(--text-dim)" }}>{key.toUpperCase()}</span>
          <input value={value} onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
            className="flex-1 px-2 py-1 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }} />
          <button onClick={() => { setCorrectAnswer(key) }}
            className="px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
            style={{ background: correctAnswer === key ? "color-mix(in srgb, var(--color-success) 20%, transparent)" : "transparent", color: correctAnswer === key ? "var(--color-success)" : "var(--text-dim)" }}>
            Đúng
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !question.trim()}
          className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
          style={{ background: "var(--clr-primary)", color: "#fff" }}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : "Thêm"}
        </button>
        <button onClick={() => setOpen(false)}
          className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
          Hủy
        </button>
      </div>
    </div>
  )
}

/* ─── Situation Card ─── */
function SituationCard({ situation, onSuccess }: { situation: MembershipSettings["situationQuestions"][0]; onSuccess: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(situation.title)
  const [description, setDescription] = useState(situation.description)

  const handleSave = async () => {
    try { setDeleting(true); await adminService.updateSituationQuestion(situation.id, { title, description }); onSuccess(); setEditing(false) }
    catch {} finally { setDeleting(false) }
  }
  const handleDelete = async () => {
    if (!confirm("Xóa câu hỏi tình huống này?")) return
    try { setDeleting(true); await adminService.deleteSituationQuestion(situation.id); onSuccess() }
    catch {} finally { setDeleting(false) }
  }

  if (editing) {
    return (
      <div className="rounded-xl p-3 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Tiêu đề" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
          placeholder="Mô tả tình huống" />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={deleting}
            className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}>
            {deleting ? <Loader2 size={12} className="animate-spin" /> : "Lưu"}
          </button>
          <button onClick={() => setEditing(false)}
            className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
            Hủy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium truncate">{situation.title}</p>
        <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>{situation.description}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}>
          <Edit3 size={12} />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--danger)" }}>
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>
    </div>
  )
}

/* ─── Add Situation Button ─── */
function AddSituationButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    try {
      setSaving(true)
      await adminService.createSituationQuestion({ id: "", title, description } as MembershipSettings["situationQuestions"][0])
      onSuccess(); setOpen(false); setTitle(""); setDescription("")
    } catch {} finally { setSaving(false) }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
        <Plus size={12} /> Thêm
      </button>
    )
  }

  return (
    <div className="rounded-xl p-3 space-y-2 border" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", borderColor: "var(--border-base)" }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Tiêu đề tình huống" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Mô tả tình huống" />
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !title.trim()}
          className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
          style={{ background: "var(--clr-primary)", color: "#fff" }}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : "Thêm"}
        </button>
        <button onClick={() => setOpen(false)}
          className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
          Hủy
        </button>
      </div>
    </div>
  )
}

/* ─── Exam Set Card ─── */
function ExamSetCard({
  examSet,
  allQuestions,
  onSuccess,
}: {
  examSet: MembershipSettings["examSets"][0]
  allQuestions: MembershipSettings["quizQuestions"]
  onSuccess: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(examSet.name)
  const [passScore, setPassScore] = useState(examSet.passScore)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [addingQuestions, setAddingQuestions] = useState(false)
  const [selectedQIds, setSelectedQIds] = useState<string[]>([])

  const handleUpdate = async () => {
    try {
      setSaving(true)
      await adminService.updateExamSet(examSet.id, { name, passScore })
      onSuccess()
      setEditing(false)
    } catch {} finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm("Xóa bộ đề này?")) return
    try { setDeleting(true); await adminService.deleteExamSet(examSet.id); onSuccess() }
    catch {} finally { setDeleting(false) }
  }

  const handleAddQuestions = async () => {
    if (selectedQIds.length === 0) return
    try {
      setSaving(true)
      await adminService.addExamSetQuestions(examSet.id, selectedQIds)
      setSelectedQIds([])
      setAddingQuestions(false)
      onSuccess()
    } catch {} finally { setSaving(false) }
  }

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      await adminService.removeExamSetQuestion(examSet.id, questionId)
      onSuccess()
    } catch {}
  }

  const existingIds = new Set(examSet.questions.map((q) => q.questionId))
  const availableQuestions = allQuestions.filter((q) => !existingIds.has(q.id))

  return (
    <div className="rounded-xl p-3 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
        >
          <ChevronRight
            size={14}
            className="shrink-0 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-dim)" }}
          />
          <span className="text-xs font-medium truncate">{examSet.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
            {examSet.questions.length} câu
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-tertiary)" }}>
            Pass {examSet.passScore}
          </span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setEditing(!editing)}
            className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
            style={{ color: "var(--text-tertiary)" }}>
            <Edit3 size={12} />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
            style={{ color: "var(--danger)" }}>
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>

      {editing && (
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-2 py-1 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
            placeholder="Tên bộ đề"
          />
          <input
            type="number"
            value={passScore}
            onChange={(e) => setPassScore(parseInt(e.target.value, 10) || 1)}
            className="w-16 px-2 py-1 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-center"
            style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
            placeholder="Điểm đậu"
            title="Số câu đúng cần đạt"
          />
          <button onClick={handleUpdate} disabled={saving}
            className="px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}>
            {saving ? <Loader2 size={12} className="animate-spin" /> : "Lưu"}
          </button>
        </div>
      )}

      {expanded && (
        <div className="pt-2 space-y-1.5 border-t" style={{ borderColor: "var(--border-base)" }}>
          <p className="text-[10px] font-medium" style={{ color: "var(--text-dim)" }}>
            Câu hỏi trong bộ đề:
          </p>
          {examSet.questions.length === 0 ? (
            <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>Chưa có câu hỏi</p>
          ) : (
            examSet.questions.map((eq) => (
              <div key={eq.id} className="flex items-center gap-2 px-2 py-1 rounded-lg" style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }}>
                <span className="text-[10px] flex-1 truncate">{eq.question.question}</span>
                <button
                  onClick={() => handleRemoveQuestion(eq.questionId)}
                  className="p-0.5 rounded cursor-pointer hover:bg-[var(--glass-hover)]"
                  style={{ color: "var(--danger)" }}
                >
                  <X size={10} />
                </button>
              </div>
            ))
          )}

          {availableQuestions.length > 0 && (
            <>
              {!addingQuestions ? (
                <button
                  onClick={() => setAddingQuestions(true)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[var(--glass-hover)]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Plus size={10} /> Thêm câu hỏi từ ngân hàng
                </button>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-medium" style={{ color: "var(--text-dim)" }}>Chọn câu hỏi để thêm:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {availableQuestions.map((q) => (
                      <label key={q.id} className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-[var(--glass-hover)]" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                        <input
                          type="checkbox"
                          checked={selectedQIds.includes(q.id)}
                          onChange={() => {
                            setSelectedQIds((prev) =>
                              prev.includes(q.id)
                                ? prev.filter((id) => id !== q.id)
                                : [...prev, q.id],
                            )
                          }}
                          className="size-3 accent-[var(--clr-primary)] cursor-pointer"
                        />
                        <span className="text-[10px] truncate">{q.question}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddQuestions}
                      disabled={selectedQIds.length === 0 || saving}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer disabled:opacity-50"
                      style={{ background: "var(--clr-primary)", color: "#fff" }}
                    >
                      {saving ? <Loader2 size={10} className="animate-spin" /> : `Thêm (${selectedQIds.length})`}
                    </button>
                    <button
                      onClick={() => { setAddingQuestions(false); setSelectedQIds([]) }}
                      className="px-2 py-1 rounded-lg text-[10px] cursor-pointer"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Add Exam Set Button ─── */
function AddExamSetButton({
  flowId,
  allQuestions,
  onSuccess,
}: {
  flowId: string
  allQuestions: MembershipSettings["quizQuestions"]
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [passScore, setPassScore] = useState(9)
  const [selectedQIds, setSelectedQIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !flowId) return
    try {
      setSaving(true)
      await adminService.createExamSet({
        membershipFlowId: flowId,
        name: name.trim(),
        passScore,
        questionIds: selectedQIds,
      })
      onSuccess()
      setOpen(false)
      setName("")
      setPassScore(9)
      setSelectedQIds([])
    } catch {} finally { setSaving(false) }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
        <Plus size={12} /> Thêm bộ đề
      </button>
    )
  }

  return (
    <div className="rounded-xl p-3 space-y-2 border" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", borderColor: "var(--border-base)" }}>
      <input value={name} onChange={(e) => setName(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
        placeholder="Tên bộ đề (VD: Đề 1)" />
      <div className="flex items-center gap-2">
        <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>Điểm đậu:</span>
        <input type="number" value={passScore}
          onChange={(e) => setPassScore(parseInt(e.target.value, 10) || 1)}
          className="w-16 px-2 py-1 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-center"
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }} />
      </div>
      {allQuestions.length > 0 && (
        <div>
          <p className="text-[10px] font-medium mb-1" style={{ color: "var(--text-dim)" }}>Chọn câu hỏi cho bộ đề (không bắt buộc):</p>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {allQuestions.map((q) => (
              <label key={q.id} className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-[var(--glass-hover)]" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                <input type="checkbox" checked={selectedQIds.includes(q.id)}
                  onChange={() => setSelectedQIds((prev) => prev.includes(q.id) ? prev.filter((id) => id !== q.id) : [...prev, q.id])}
                  className="size-3 accent-[var(--clr-primary)] cursor-pointer" />
                <span className="text-[10px] truncate">{q.question}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !name.trim() || !flowId}
          className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
          style={{ background: "var(--clr-primary)", color: "#fff" }}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : "Tạo"}
        </button>
        <button onClick={() => setOpen(false)}
          className="px-3 py-1 rounded-lg text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
          Hủy
        </button>
      </div>
    </div>
  )
}
