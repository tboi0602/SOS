"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PostsPaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function PostsPagination({ page, totalPages, onPageChange }: PostsPaginationProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        style={{
          color: hovered === "pp-prev" ? "var(--text-primary)" : "var(--text-tertiary)",
          background: hovered === "pp-prev" ? "color-mix(in srgb, var(--text-primary) 6%, transparent)" : undefined,
        }}
        onMouseEnter={() => setHovered("pp-prev")}
        onMouseLeave={() => setHovered(null)}
      >
        <ChevronLeft size={16} /> Trước
      </button>
      <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        style={{
          color: hovered === "pp-next" ? "var(--text-primary)" : "var(--text-tertiary)",
          background: hovered === "pp-next" ? "color-mix(in srgb, var(--text-primary) 6%, transparent)" : undefined,
        }}
        onMouseEnter={() => setHovered("pp-next")}
        onMouseLeave={() => setHovered(null)}
      >
        Sau <ChevronRight size={16} />
      </button>
    </div>
  )
}
