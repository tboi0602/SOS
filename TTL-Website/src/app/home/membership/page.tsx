"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Upload, CreditCard, BookOpen, Brain, FileText, CheckCircle2,
  Clock, AlertCircle, Loader2,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { membershipService, type UserFlow } from "@/service/membership.service"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/Skeleton"
import UploadDocsStep from "./_components/UploadDocsStep"
import DocsSubmittedStep from "./_components/DocsSubmittedStep"
import PaymentStep from "./_components/PaymentStep"
import LessonsQuizSituations from "./_components/LessonsQuizSituations"
import CompletedStep from "./_components/CompletedStep"

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
  const { loading: authLoading } = useAuth()
  const [flow, setFlow] = useState<UserFlow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const fetchedRef = useRef(false)

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

  useEffect(() => {
    if (authLoading) return
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchFlow()
  }, [authLoading, fetchFlow])

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


