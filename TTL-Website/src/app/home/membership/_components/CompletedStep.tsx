"use client"

import { CheckCircle2 } from "lucide-react"
import { type UserFlow } from "@/service/membership.service"

export default function CompletedStep({ flow }: { flow: UserFlow }) {
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
