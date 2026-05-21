"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PostsPaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function PostsPagination({ page, totalPages, onPageChange }: PostsPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} /> Trước
      </button>
      <span className="text-sm text-zinc-500">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Sau <ChevronRight size={16} />
      </button>
    </div>
  )
}
