"use client"

import { AlertTriangle, X } from "lucide-react"
import { useEffect, useRef } from "react"

interface Props {
  open: boolean
  title: string
  message: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ open, title, message, loading, onConfirm, onCancel }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-base)] p-6 shadow-2xl">
        <button
          onClick={onCancel}
          aria-label="Đóng"
          className="absolute right-4 top-4 p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <X size={16} />
        </button>

        <div className="size-12 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>

        <h2 className="text-base font-bold text-[var(--text-primary)] text-center mb-2">{title}</h2>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border-base)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--glass-hover)] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Hủy
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
          >
            {loading ? "Đang xoá..." : "Xác nhận xoá"}
          </button>
        </div>
      </div>
    </div>
  )
}
