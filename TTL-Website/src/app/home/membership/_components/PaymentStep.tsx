"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Copy,
  Banknote,
} from "lucide-react";
import { membershipService, type UserFlow } from "@/service/membership.service";
import { useToast } from "@/components/ui/Toast";

const BANK_INFO = {
  bank: "Ngân hàng ACB",
  accountNumber: "81286666",
  accountHolder: "NGUYEN HOAI VU",
} as const;

export default function PaymentStep({
  flow,
  userEmail,
  onSuccess,
}: {
  flow: UserFlow;
  userEmail: string;
  onSuccess: () => void;
}) {
  const { toast } = useToast()
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const price = flow.membershipFlow!.price;
  const transferContent = `THV-${flow.id?.slice(-6).toUpperCase() || "HOLDING"} ${userEmail}`;

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await membershipService.confirmPayment();
      onSuccess();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Xác nhận thất bại", "error");
    } finally {
      setConfirming(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

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
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <CreditCard size={16} style={{ color: "var(--clr-primary)" }} />
        Thanh toán phí hội viên
      </h3>

      {flow.status === "pending_payment" && flow.documentsUrl && (
        <div
          className="rounded-xl p-4 space-y-4"
          style={{
            background:
              "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Hồ sơ của bạn đã được duyệt. Vui lòng chuyển khoản theo thông tin
            bên dưới và nhấn xác nhận.
          </p>
          <div className="text-center py-4">
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--clr-primary)" }}
            >
              {price.toLocaleString("vi-VN")}đ
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Chuyển khoản đến tài khoản bên dưới
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src={`https://img.vietqr.io/image/ACB-${BANK_INFO.accountNumber}-compact2.png?amount=${price}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_INFO.accountHolder)}`}
              alt="Mã QR chuyển khoản"
              className="rounded-xl w-54 h-54"
              style={{
                boxShadow:
                  "0 4px 24px color-mix(in srgb, var(--clr-primary) 15%, transparent)",
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            Hoặc
          </p>
          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              background:
                "color-mix(in srgb, var(--clr-primary) 6%, transparent)",
              border:
                "0.5px solid color-mix(in srgb, var(--clr-primary) 15%, transparent)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
                }}
              >
                <Banknote size={18} style={{ color: "var(--clr-primary)" }} />
              </div>
              <div>
                <p
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-dim)" }}
                >
                  Ngân hàng
                </p>
                <p className="text-sm font-semibold">{BANK_INFO.bank}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-dim)" }}
                >
                  Số tài khoản
                </p>
                <p
                  className="text-base font-bold tracking-wider"
                  style={{ color: "var(--clr-primary)" }}
                >
                  {BANK_INFO.accountNumber}
                </p>
              </div>
              <button
                onClick={() => handleCopy(BANK_INFO.accountNumber)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                style={{
                  background:
                    "color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  color: "var(--clr-primary)",
                }}
              >
                <Copy size={12} />
                {copied ? "Đã sao chép" : "Sao chép"}
              </button>
            </div>

            <div>
              <p
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-dim)" }}
              >
                Chủ tài khoản
              </p>
              <p className="text-sm font-medium">{BANK_INFO.accountHolder}</p>
            </div>

            <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
              Nội dung chuyển khoản:{" "}
              <span
                className="font-mono font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {transferContent}
              </span>
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--clr-primary)", color: "#fff" }}
          >
            <CheckCircle2 size={16} />
            Tôi đã chuyển khoản
          </button>
        </div>
      )}

      {flow.status === "pending_payment" && !flow.documentsUrl && (
        <p
          className="text-xs text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
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
  );
}
