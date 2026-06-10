"use client"

import { X, AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "primary"
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  const isDanger = variant === "danger"

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-[var(--surface-elevated)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border-base)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`size-12 rounded-full flex items-center justify-center mb-4 ${isDanger ? "bg-danger/10" : "bg-primary/10"}`}>
            <AlertTriangle size={24} className={isDanger ? "text-danger" : "text-primary"} />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--surface-strong)] border border-[var(--border-base)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer"
          >{cancelLabel}</button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isDanger ? "bg-danger hover:bg-danger/80 text-white" : "bg-primary hover:bg-primary-light text-[var(--text-primary)]"
            }`}
          >{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
