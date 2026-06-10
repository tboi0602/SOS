"use client"

import { useState } from "react"
import { CreditCard, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { membershipService, type UserFlow } from "@/service/membership.service"

export default function PaymentStep({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
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
