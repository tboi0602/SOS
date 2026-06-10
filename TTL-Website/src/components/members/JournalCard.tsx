"use client";

import { Sparkles } from "lucide-react";
import type { JournalEntry } from "@/service/api";

interface JournalCardProps {
  journal: JournalEntry;
}

export default function JournalCard({ journal }: JournalCardProps) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 group/j" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)", boxShadow: "0 1px 3px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px color-mix(in srgb, var(--clr-primary) 18%, transparent)"; e.currentTarget.style.borderColor = "var(--clr-accent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px color-mix(in srgb, var(--clr-primary) 10%, transparent)"; e.currentTarget.style.borderColor = "var(--border-base)"; }}
    >
      <div className="size-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0 group-hover/j:scale-110 transition-transform">
        <Sparkles
          size={16}
          className="text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
          {journal.title}
        </p>
        <p className="text-[11px] font-light line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {journal.content}
        </p>
      </div>
      {journal.points > 0 && (
        <div className="text-right shrink-0 flex flex-col justify-center">
          <span className="text-sm font-black text-amber-400">
            +{journal.points}
          </span>
          <span className="text-[9px] uppercase font-bold" style={{ color: "var(--text-tertiary)" }}>
            pts
          </span>
        </div>
      )}
    </div>
  );
}
