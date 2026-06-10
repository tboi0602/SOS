"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MembersPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MembersPagination({ page, totalPages, onPageChange }: MembersPaginationProps) {
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
        Trang hiện tại: <span className="font-mono text-xs" style={{ color: "var(--text-primary)" }}>{page}</span> / {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="size-8 rounded-lg flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
          onMouseEnter={() => setHoverPrev(true)}
          onMouseLeave={() => setHoverPrev(false)}
          style={{
            background: hoverPrev ? "color-mix(in srgb, var(--text-primary) 5%, transparent)" : "var(--surface-elevated)",
            border: "1px solid var(--border-base)",
            color: hoverPrev ? "var(--text-primary)" : "var(--text-tertiary)",
          }}
        >
          <ChevronLeft size={14} />
        </button>

        <div className="px-3 text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/20 h-8 flex items-center justify-center rounded-lg min-w-8">
          {page}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="size-8 rounded-lg flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
          onMouseEnter={() => setHoverNext(true)}
          onMouseLeave={() => setHoverNext(false)}
          style={{
            background: hoverNext ? "color-mix(in srgb, var(--text-primary) 5%, transparent)" : "var(--surface-elevated)",
            border: "1px solid var(--border-base)",
            color: hoverNext ? "var(--text-primary)" : "var(--text-tertiary)",
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
