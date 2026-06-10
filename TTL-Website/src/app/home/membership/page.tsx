"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Upload, CreditCard, BookOpen, Brain, FileText, CheckCircle2,
  Clock, AlertCircle, ChevronRight, Loader2, Download,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { membershipService, type UserFlow, type UserLesson, type QuizData, type SituationData } from "@/service/membership.service"
import { Skeleton } from "@/components/ui/Skeleton"

gsap.registerPlugin(ScrollTrigger)

const STATUS_LABELS: Record<string, { label: string; icon: typeof Upload; desc: string }> = {
  pending_docs: { label: "Chưa nộp hồ sơ", icon: Upload, desc: "Vui lòng tải lên các giấy tờ cần thiết" },
  docs_submitted: { label: "Hồ sơ đang chờ duyệt", icon: Clock, desc: "Quản trị viên đang xem xét hồ sơ của bạn" },
  pending_payment: { label: "Chờ thanh toán", icon: CreditCard, desc: "Vui lòng thanh toán để tiếp tục" },
  payment_pending_verification: { label: "Đang xác minh thanh toán", icon: Clock, desc: "Quản trị viên đang xác minh giao dịch" },
  in_lessons: { label: "Đang học bài học", icon: BookOpen, desc: "Hoàn thành các bài học bắt buộc" },
  pending_quiz: { label: "Chờ làm bài kiểm tra", icon: Brain, desc: "Hoàn thành bài kiểm tra trắc nghiệm" },
  pending_situations: { label: "Chờ nộp tình huống", icon: FileText, desc: "Nộp bài tập tình huống" },
  pending_review: { label: "Đang chấm điểm", icon: Clock, desc: "Quản trị viên đang chấm điểm bài của bạn" },
  completed: { label: "Hoàn thành", icon: CheckCircle2, desc: "Chúc mừng! Bạn đã hoàn thành luồng hội viên" },
}

export default function MembershipPage() {
  const [flow, setFlow] = useState<UserFlow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  const fetchFlow = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await membershipService.getMyFlow()
      setFlow(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin luồng hội viên")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFlow() }, [fetchFlow])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        if (headerRef.current) {
          gsap.from(headerRef.current, { y: 30, opacity: 0, duration: 0.5, ease: "power3.out", scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none none" } })
        }
        if (stepsRef.current) {
          gsap.from(stepsRef.current.querySelectorAll(".step-card"), { y: 20, opacity: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: stepsRef.current, start: "top 88%", toggleActions: "play none none none" } })
        }
      })
    })
    return () => ctx.revert()
  }, [flow])

  if (loading) {
    return (
      <div className="min-h-dvh px-4 sm:px-6 py-8 animate-fade-up">
        <Skeleton name="membership-loading" loading rows={6}>
          <div />
        </Skeleton>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh px-4 sm:px-6 py-8 animate-fade-up">
        <div className="max-w-3xl mx-auto text-center py-16">
          <AlertCircle size={40} className="mx-auto mb-4 opacity-40" style={{ color: "var(--danger)" }} />
          <p className="text-sm mb-2" style={{ color: "var(--danger)" }}>{error}</p>
          <button onClick={fetchFlow} className="btn-primary text-sm px-4 py-2 rounded-xl">
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!flow) {
    return (
      <div className="min-h-dvh px-4 sm:px-6 py-8 animate-fade-up">
        <div className="max-w-3xl mx-auto text-center py-16">
          <Upload size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm font-medium">Bắt đầu quy trình hội viên</p>
          <button
            onClick={async () => {
              try {
                await membershipService.getMyFlow()
                fetchFlow()
              } catch { /* ignore */ }
            }}
            className="btn-primary text-sm px-6 py-2.5 rounded-xl mt-4"
          >
            Đăng ký hội viên
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = STATUS_LABELS[flow.status] || { label: flow.status, icon: Clock, desc: "" }
  const StatusIcon = statusInfo.icon

  const steps = [
    { key: "pending_docs", label: "Nộp hồ sơ", icon: Upload, done: flow.status !== "pending_docs" },
    { key: "docs_submitted", label: "Duyệt hồ sơ", icon: Clock, done: !["pending_docs", "docs_submitted"].includes(flow.status) },
    { key: "pending_payment", label: "Thanh toán", icon: CreditCard, done: flow.status !== "pending_payment" && flow.status !== "payment_pending_verification" && flow.status !== "pending_docs" && flow.status !== "docs_submitted" },
    { key: "in_lessons", label: "Bài học", icon: BookOpen, done: !["pending_docs", "docs_submitted", "pending_payment", "payment_pending_verification", "in_lessons"].includes(flow.status) },
    { key: "pending_quiz", label: "Kiểm tra", icon: Brain, done: !["pending_docs", "docs_submitted", "pending_payment", "payment_pending_verification", "in_lessons", "pending_quiz"].includes(flow.status) },
    { key: "pending_situations", label: "Tình huống", icon: FileText, done: !["pending_docs", "docs_submitted", "pending_payment", "payment_pending_verification", "in_lessons", "pending_quiz", "pending_situations"].includes(flow.status) },
    { key: "completed", label: "Hoàn thành", icon: CheckCircle2, done: flow.status === "completed" },
  ]

  const currentIndex = steps.findIndex((s) => s.key === flow.status)

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-8 select-none animate-fade-up">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div ref={headerRef} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
            <StatusIcon size={16} />
            <span className="text-xs font-semibold">{statusInfo.label}</span>
          </div>
          <h1 className="text-lg font-bold">Đăng ký thành viên</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            {statusInfo.desc}
          </p>
          {flow.membershipFlow?.price && (
            <p className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>
              Phí hội viên: <span className="font-bold" style={{ color: "var(--clr-primary)" }}>{flow.membershipFlow.price.toLocaleString("vi-VN")}đ</span>
            </p>
          )}
        </div>

        {/* Steps progress bar */}
        <div className="flex items-center gap-0.5 px-2">
          {steps.map((step, i) => {
            const StepIcon = step.icon
            const isActive = i === currentIndex
            const isPast = i < currentIndex
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="size-8 rounded-full flex items-center justify-center text-xs transition-all" style={{
                    background: isPast || isActive ? "var(--clr-primary)" : "color-mix(in srgb, var(--text-primary) 8%, transparent)",
                    color: isPast || isActive ? "#fff" : "var(--text-dim)",
                  }}>
                    {isPast ? <CheckCircle2 size={14} /> : <StepIcon size={14} />}
                  </div>
                  <span className="text-[9px] font-medium text-center leading-tight max-w-14" style={{ color: isActive ? "var(--clr-primary)" : "var(--text-dim)" }}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px mx-1 mt-[-16px]" style={{ background: isPast ? "var(--clr-primary)" : "color-mix(in srgb, var(--text-primary) 8%, transparent)" }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div ref={stepsRef}>
          {flow.status === "pending_docs" && <UploadDocsStep flow={flow} onSuccess={fetchFlow} />}
          {flow.status === "docs_submitted" && <DocsSubmittedStep flow={flow} onSuccess={fetchFlow} />}
          {(flow.status === "pending_payment" || flow.status === "payment_pending_verification") && (
            <PaymentStep flow={flow} onSuccess={fetchFlow} />
          )}
          {(flow.status === "in_lessons" || flow.status === "pending_quiz" || flow.status === "pending_situations" || flow.status === "pending_review") && (
            <LessonsQuizSituations flow={flow} onSuccess={fetchFlow} />
          )}
          {flow.status === "completed" && <CompletedStep flow={flow} />}
        </div>
      </div>
    </div>
  )
}

function UploadDocsStep({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
  const [agreed, setAgreed] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (files.length === 0) return
    try {
      setUploading(true)
      setError(null)
      await membershipService.uploadDocs(files)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload thất bại")
    } finally {
      setUploading(false)
    }
  }

  if (!agreed) {
    return (
      <div className="step-card rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FileText size={16} style={{ color: "var(--clr-primary)" }} />
          Thể lệ đăng ký
        </h3>

        {flow.membershipFlow?.rules ? (
          <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto" style={{
            background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
            color: "var(--text-secondary)",
          }}>
            {flow.membershipFlow.rules}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Vui lòng đọc kỹ thể lệ trước khi đăng ký.
          </p>
        )}

        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--clr-primary) 8%, transparent)" }}>
          <Download size={16} style={{ color: "var(--clr-primary)" }} />
          <a
            href="/files/mau-don-dang-ky.pdf"
            download
            className="text-xs font-medium underline underline-offset-2"
            style={{ color: "var(--clr-primary)" }}
          >
            Tải mẫu đơn đăng ký
          </a>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(true)}
            className="mt-0.5 size-4 accent-[var(--clr-primary)] cursor-pointer"
          />
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tôi đã đọc và đồng ý với thể lệ đăng ký thành viên
          </span>
        </label>

        <button
          onClick={() => setAgreed(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          style={{ background: "var(--clr-primary)", color: "#fff" }}
        >
          <CheckCircle2 size={16} />
          Đã hiểu, tiếp tục
        </button>
      </div>
    )
  }

  return (
    <div className="step-card rounded-2xl p-6 space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Upload size={16} style={{ color: "var(--clr-primary)" }} />
        Nộp hồ sơ
      </h3>
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        Vui lòng tải lên các giấy tờ: CMND/CCCD, ảnh thẻ, giấy tờ khác (PDF, DOC, JPG, PNG)
      </p>

      {flow.membershipFlow?.rules && (
        <details className="text-xs" style={{ color: "var(--text-dim)" }}>
          <summary className="cursor-pointer font-medium">Xem lại thể lệ</summary>
          <div className="mt-2 p-3 rounded-lg whitespace-pre-wrap" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
            {flow.membershipFlow.rules}
          </div>
        </details>
      )}

      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--clr-primary) 8%, transparent)" }}>
        <Download size={16} style={{ color: "var(--clr-primary)" }} />
        <a
          href="/files/mau-don-dang-ky.pdf"
          download
          className="text-xs font-medium underline underline-offset-2"
          style={{ color: "var(--clr-primary)" }}
        >
          Tải mẫu đơn đăng ký
        </a>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-primary/50"
        style={{ borderColor: "color-mix(in srgb, var(--text-primary) 15%, transparent)" }}
      >
        <Upload size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-xs font-medium">Nhấn để chọn file</p>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>Hỗ trợ: PDF, DOC, DOCX, JPG, PNG</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files || [])
            setFiles((prev) => [...prev, ...selected])
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>{files.length} file đã chọn:</p>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }}>
              <FileText size={12} />
              <span className="flex-1 truncate">{f.name}</span>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
        style={{ background: "var(--clr-primary)", color: "#fff" }}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Đang tải lên..." : "Gửi hồ sơ"}
      </button>
    </div>
  )
}

function DocsSubmittedStep({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
  const [showUpload, setShowUpload] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (files.length === 0) return
    try {
      setUploading(true)
      setError(null)
      await membershipService.uploadDocs(files)
      setShowUpload(false)
      setFiles([])
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload thất bại")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="step-card rounded-2xl p-6 space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <div className="text-center py-4 space-y-3">
        <Clock size={40} className="mx-auto opacity-40" />
        <h3 className="text-sm font-semibold">Hồ sơ đang chờ duyệt</h3>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Quản trị viên đang xem xét hồ sơ của bạn. Bạn có thể nộp bổ sung hồ sơ nếu cần.
        </p>
        {flow.adminNote && (
          <div className="rounded-xl p-3 text-left" style={{ background: "color-mix(in srgb, var(--color-warning) 10%, transparent)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--color-warning)" }}>Ghi chú từ quản trị viên:</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{flow.adminNote}</p>
          </div>
        )}
      </div>

      {!showUpload ? (
        <button
          onClick={() => setShowUpload(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}
        >
          <Upload size={16} />
          Nộp bổ sung hồ sơ
        </button>
      ) : (
        <div className="space-y-3 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary/50"
            style={{ borderColor: "color-mix(in srgb, var(--text-primary) 15%, transparent)" }}
          >
            <p className="text-xs font-medium">Nhấn để chọn file bổ sung</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>
          {files.length > 0 && (
            <div className="space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }}>
                  <FileText size={12} />
                  <span className="flex-1 truncate">{f.name}</span>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Gửi bổ sung
            </button>
            <button
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 rounded-xl text-xs cursor-pointer"
              style={{ color: "var(--text-tertiary)" }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PaymentStep({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const price = flow.membershipFlow?.price || 6000000

  const handleConfirm = async () => {
    try {
      setConfirming(true)
      setError(null)
      await membershipService.confirmPayment()
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xác nhận thất bại")
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="step-card rounded-2xl p-6 space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <CreditCard size={16} style={{ color: "var(--clr-primary)" }} />
        Thanh toán phí hội viên
      </h3>

      <div className="text-center py-4">
        <p className="text-2xl font-bold" style={{ color: "var(--clr-primary)" }}>
          {price.toLocaleString("vi-VN")}đ
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          Chuyển khoản qua ngân hàng hoặc ví điện tử
        </p>
      </div>

      {flow.documentsUrl && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)" }}>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Hồ sơ của bạn đã được duyệt. Vui lòng chuyển khoản và nhấn nút bên dưới để xác nhận.
          </p>

          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/pay/${price}`}
              alt="QR thanh toán"
              className="rounded-xl"
              style={{ width: 180, height: 180 }}
            />
          </div>

          {error && <p className="text-xs text-center" style={{ color: "var(--danger)" }}>{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}
          >
            {confirming ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {confirming ? "Đang xác nhận..." : "Tôi đã chuyển khoản"}
          </button>
        </div>
      )}

      {(flow.status === "pending_payment" && !flow.documentsUrl) && (
        <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
          Vui lòng đợi quản trị viên duyệt hồ sơ trước khi thanh toán.
        </p>
      )}

      {flow.status === "payment_pending_verification" && (
        <div className="text-center py-4">
          <Clock size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Quản trị viên đang xác minh giao dịch của bạn. Vui lòng chờ.
          </p>
        </div>
      )}
    </div>
  )
}

function LessonsQuizSituations({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
  const [lessons, setLessons] = useState<UserLesson[]>([])
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [situations, setSituations] = useState<SituationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"lessons" | "quiz" | "situations">("lessons")
  const [error, setError] = useState<string | null>(null)
  // Lesson submission
  const [submittingLesson, setSubmittingLesson] = useState<string | null>(null)
  const [lessonUrl, setLessonUrl] = useState("")
  // Quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState<{
    passed: boolean; correctCount: number; total: number; passScore: number
  } | null>(null)
  // Situations
  const [situationLink, setSituationLink] = useState("")
  const [submittingSituation, setSubmittingSituation] = useState<number | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        if (["in_lessons", "pending_quiz", "pending_situations", "pending_review"].includes(flow.status)) {
          const [l, q, s] = await Promise.all([
            membershipService.getLessons().catch(() => ({ lessons: [] as UserLesson[] })),
            membershipService.getQuiz().catch(() => null),
            membershipService.getSituations().catch(() => null),
          ])
          setLessons(l.lessons)
          setQuiz(q)
          setSituations(s)
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [flow.status])

  const handleSubmitLesson = async (lessonId: string) => {
    if (!lessonUrl.trim()) return
    try {
      setSubmittingLesson(lessonId)
      setError(null)
      await membershipService.submitLesson(lessonId, lessonUrl.trim())
      setLessonUrl("")
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Nộp bài thất bại")
    } finally {
      setSubmittingLesson(null)
    }
  }

  const handleSubmitQuiz = async () => {
    const answeredCount = Object.keys(selectedAnswers).length
    if (!quiz || answeredCount < quiz.questions.length) return
    try {
      setSubmittingQuiz(true)
      setError(null)
      const result = await membershipService.submitQuiz(selectedAnswers)
      setQuizResult(result)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Nộp bài thất bại")
    } finally {
      setSubmittingQuiz(false)
    }
  }

  const handleSubmitSituation = async (index: number) => {
    if (!situationLink.trim()) return
    try {
      setSubmittingSituation(index)
      setError(null)
      await membershipService.submitSituation(index, situationLink.trim())
      setSituationLink("")
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Nộp bài thất bại")
    } finally {
      setSubmittingSituation(null)
    }
  }

  if (loading) {
    return (
      <div className="step-card rounded-2xl p-6" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <Skeleton name="lessons-loading" loading rows={4}><div /></Skeleton>
      </div>
    )
  }

  const tabs = [
    { key: "lessons" as const, label: "Bài học", icon: BookOpen, show: flow.status === "in_lessons" || flow.status === "pending_quiz" || flow.status === "pending_situations" || flow.status === "pending_review" },
    { key: "quiz" as const, label: "Kiểm tra", icon: Brain, show: flow.status === "pending_quiz" || flow.status === "pending_situations" || flow.status === "pending_review" },
    { key: "situations" as const, label: "Tình huống", icon: FileText, show: flow.status === "pending_situations" || flow.status === "pending_review" },
  ].filter((t) => t.show)

  return (
    <div className="step-card rounded-2xl p-6 space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }}>
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
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
          )
        })}
      </div>

      {error && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>
      )}

      {/* Lessons tab */}
      {tab === "lessons" && (
        <div className="space-y-3">
          {lessons.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>Chưa có bài học nào</p>
          ) : (
            lessons.map((lesson) => {
              const submitted = lesson.userLesson?.status === "submitted" || lesson.userLesson?.status === "scored"
              const scored = lesson.userLesson?.status === "scored"
              return (
                <div key={lesson.id} className="rounded-xl p-4 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{lesson.title}</p>
                      {lesson.description && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{lesson.description}</p>}
                    </div>
                    {submitted && (
                      <span className="badge-approved text-[10px] shrink-0">
                        <CheckCircle2 size={10} /> Đã nộp
                      </span>
                    )}
                    {scored && lesson.userLesson?.score != null && (
                      <span className="text-xs font-bold" style={{ color: "var(--clr-primary)" }}>
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
                        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
                      />
                      <button
                        onClick={() => handleSubmitLesson(lesson.id)}
                        disabled={submittingLesson === lesson.id || !lessonUrl.trim()}
                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={{ background: "var(--clr-primary)", color: "#fff" }}
                      >
                        {submittingLesson === lesson.id ? <Loader2 size={14} className="animate-spin" /> : "Nộp"}
                      </button>
                    </div>
                  )}

                  {lesson.userLesson?.adminNote && (
                    <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                      Ghi chú: {lesson.userLesson.adminNote}
                    </p>
                  )}
                </div>
              )
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
                <CheckCircle2 size={40} className="mx-auto" style={{ color: "var(--color-success)" }} />
              ) : (
                <AlertCircle size={40} className="mx-auto" style={{ color: "var(--color-warning)" }} />
              )}
              <p className="text-sm font-semibold">{quizResult.passed ? "Chúc mừng!" : "Chưa đạt"}</p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {quizResult.passed
                  ? "Bạn đã vượt qua bài kiểm tra!"
                  : `Bài kiểm tra chưa đạt (${quizResult.correctCount}/${quizResult.total}, yêu cầu ${quizResult.passScore}/${quizResult.total}). Vui lòng thử lại.`}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)" }}>
                <span style={{ color: "var(--text-tertiary)" }}>Kết quả:</span>
                <span className="font-bold" style={{ color: quizResult.passed ? "var(--color-success)" : "var(--color-warning)" }}>
                  {quizResult.correctCount}/{quizResult.total}
                </span>
              </div>
            </div>
          ) : quiz ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                  Bộ đề: {quiz.examSetName}
                </p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                  Cần đạt {quiz.passScore}/{quiz.total} câu &middot; Lần {flow.quizAttempts + 1}
                </p>
              </div>

              {quiz.questions.map((q, qi) => (
                <div key={q.id} className="rounded-xl p-4 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                  <p className="text-sm font-medium mb-2">
                    <span className="text-xs font-bold mr-2" style={{ color: "var(--clr-primary)" }}>Câu {qi + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt) => {
                      const selected = selectedAnswers[q.id] === opt.key
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.key }))}
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
                          <span className="font-medium mr-2">{opt.key.toUpperCase()}.</span> {opt.value}
                        </button>
                      )
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
                {submittingQuiz ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {submittingQuiz
                  ? "Đang nộp..."
                  : `Nộp bài (${Object.keys(selectedAnswers).length}/${quiz.questions.length})`}
              </button>
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>Chưa có bài kiểm tra</p>
          )}
        </div>
      )}

      {/* Situations tab */}
      {tab === "situations" && (
        <div className="space-y-4">
          {situations?.situations && situations.situations.length > 0 ? (
            situations.situations.map((sit) => {
              const submitted = !!sit.link
              return (
                <div key={sit.id} className="rounded-xl p-4 space-y-2" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">Tình huống {sit.index + 1}: {sit.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sit.description}</p>
                    </div>
                    {submitted && (
                      <span className="badge-approved text-[10px] shrink-0">
                        <CheckCircle2 size={10} /> Đã nộp
                      </span>
                    )}
                    {sit.score != null && (
                      <span className="text-xs font-bold shrink-0" style={{ color: "var(--clr-primary)" }}>
                        {sit.score}/10
                      </span>
                    )}
                  </div>

                  {!submitted && (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={situationLink}
                        onChange={(e) => setSituationLink(e.target.value)}
                        placeholder="Đường dẫn Google Drive..."
                        className="flex-1 px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
                      />
                      <button
                        onClick={() => handleSubmitSituation(sit.index)}
                        disabled={submittingSituation === sit.index || !situationLink.trim()}
                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={{ background: "var(--clr-primary)", color: "#fff" }}
                      >
                        {submittingSituation === sit.index ? <Loader2 size={14} className="animate-spin" /> : "Nộp"}
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <p className="text-xs text-center py-4" style={{ color: "var(--text-dim)" }}>Chưa có tình huống</p>
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
  )
}

function CompletedStep({ flow }: { flow: UserFlow }) {
  return (
    <div className="step-card rounded-2xl p-6 text-center space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <div className="size-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)" }}>
        <CheckCircle2 size={32} style={{ color: "var(--color-success)" }} />
      </div>
      <h3 className="text-lg font-bold">Chúc mừng!</h3>
      <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
        Bạn đã hoàn thành toàn bộ luồng hội viên. Chào mừng bạn đến với cộng đồng!
      </p>
      {flow.totalScore != null && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)" }}>
          <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>Tổng điểm:</span>
          <span className="text-sm font-bold" style={{ color: "var(--clr-primary)" }}>{flow.totalScore}</span>
        </div>
      )}
      {flow.membershipFlow?.rules && (
        <div className="rounded-xl p-4 text-left" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>Nội quy:</p>
          <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-dim)" }}>{flow.membershipFlow.rules}</p>
        </div>
      )}
    </div>
  )
}
