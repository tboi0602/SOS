"use client"

import { memo } from "react"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  variant?: "full" | "simple"
}

function Pagination({ page, totalPages, onPageChange, variant = "full" }: PaginationProps) {
  if (totalPages <= 1) return null

  if (variant === "simple") {
    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs disabled:opacity-30 hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
          aria-label="Trang trước"
        >
          Trước
        </button>
        <span className="px-3 py-1.5 text-xs text-zinc-500">
          Trang {page}/{totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs disabled:opacity-30 hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
          aria-label="Trang sau"
        >
          Sau
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-1">
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <span className="text-zinc-600 px-1">...</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all ${
                p === page
                  ? "bg-primary text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/6"
              }`}
            >
              {p}
            </button>
          </span>
        ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
      >
        Sau
      </button>
    </div>
  )
}

export default memo(Pagination)
