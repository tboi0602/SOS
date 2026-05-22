"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface MembersPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MembersPagination({ page, totalPages, onPageChange }: MembersPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
        Trang hiện tại: <span className="font-mono text-white text-xs">{page}</span> / {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="size-8 rounded-lg flex items-center justify-center border border-white/5 text-zinc-400 hover:text-white bg-white/2 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="px-3 text-xs font-mono font-bold text-cyan bg-cyan/10 border border-cyan/20 h-8 flex items-center justify-center rounded-lg min-w-8">
          {page}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="size-8 rounded-lg flex items-center justify-center border border-white/5 text-zinc-400 hover:text-white bg-white/2 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
