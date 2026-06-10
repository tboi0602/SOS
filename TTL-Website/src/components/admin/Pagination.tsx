"use client"

import { memo, useState } from "react"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  variant?: "full" | "simple"
}

function Pagination({ page, totalPages, onPageChange, variant = "full" }: PaginationProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  if (totalPages <= 1) return null

  if (variant === "simple") {
    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
          style={{
            color: hovered === "simple-prev" ? "var(--text-primary)" : "var(--text-tertiary)",
            background: hovered === "simple-prev"
              ? "color-mix(in srgb, var(--text-primary) 10%, transparent)"
              : "color-mix(in srgb, var(--text-primary) 5%, transparent)",
          }}
          onMouseEnter={() => setHovered("simple-prev")}
          onMouseLeave={() => setHovered(null)}
          aria-label="Trang trước"
        >
          Trước
        </button>
        <span className="px-3 py-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
          Trang {page}/{totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-30 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
          style={{
            color: hovered === "simple-next" ? "var(--text-primary)" : "var(--text-tertiary)",
            background: hovered === "simple-next"
              ? "color-mix(in srgb, var(--text-primary) 10%, transparent)"
              : "color-mix(in srgb, var(--text-primary) 5%, transparent)",
          }}
          onMouseEnter={() => setHovered("simple-next")}
          onMouseLeave={() => setHovered(null)}
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
        className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
        style={{
          color: hovered === "prev" ? "var(--text-primary)" : "var(--text-tertiary)",
          background: hovered === "prev" ? "color-mix(in srgb, var(--text-primary) 6%, transparent)" : undefined,
        }}
        onMouseEnter={() => setHovered("prev")}
        onMouseLeave={() => setHovered(null)}
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-1">
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <span className="px-1" style={{ color: "var(--text-dim)" }}>...</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all ${
                p === page ? "bg-primary text-[var(--text-primary)] font-medium" : ""
              }`}
              style={
                p !== page
                  ? {
                      color: hovered === `page-${p}` ? "var(--text-primary)" : "var(--text-tertiary)",
                      background: hovered === `page-${p}`
                        ? "color-mix(in srgb, var(--text-primary) 6%, transparent)"
                        : undefined,
                    }
                  : undefined
              }
              onMouseEnter={() => setHovered(`page-${p}`)}
              onMouseLeave={() => setHovered(null)}
            >
              {p}
            </button>
          </span>
        ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all"
        style={{
          color: hovered === "next" ? "var(--text-primary)" : "var(--text-tertiary)",
          background: hovered === "next" ? "color-mix(in srgb, var(--text-primary) 6%, transparent)" : undefined,
        }}
        onMouseEnter={() => setHovered("next")}
        onMouseLeave={() => setHovered(null)}
      >
        Sau
      </button>
    </div>
  )
}

export default memo(Pagination)
