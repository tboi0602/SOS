"use client"

import { AlertTriangle, Loader2 } from "lucide-react"

interface ConfirmDeleteModalProps {
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}

export default function ConfirmDeleteModal({ onConfirm, onCancel, deleting }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-base)] shadow-2xl p-6 text-center space-y-4">
        <div className="size-14 rounded-full bg-danger/15 flex items-center justify-center mx-auto">
          <AlertTriangle size={26} className="text-danger" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Xác nhận xoá bài viết</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Bài viết sẽ bị xoá vĩnh viễn và không thể khôi phục.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] bg-[var(--surface-strong)] border border-[var(--border-base)] hover:bg-[var(--glass-hover)] transition-all"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-danger hover:bg-danger/80 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            {deleting ? "Đang xoá..." : "Xoá bài viết"}
          </button>
        </div>
      </div>
    </div>
  )
}
