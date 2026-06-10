"use client";

import { Sparkles } from "lucide-react";
import type { JournalEntry } from "@/service/api";
import JournalCard from "./JournalCard";

interface JournalsListProps {
  journals: JournalEntry[];
}

export default function JournalsList({ journals }: JournalsListProps) {
  if (journals.length === 0) return null;

  return (
    <div className="rounded-3xl p-6 animate-fade-up" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4" style={{ color: "var(--text-tertiary)" }}>
        <Sparkles size={14} className="text-amber-400" /> Nhật Ký
        Đóng Góp Giá Trị
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {journals.map((j, index) => (
          <div key={j.id} className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
            <JournalCard journal={j} />
          </div>
        ))}
      </div>
    </div>
  );
}
