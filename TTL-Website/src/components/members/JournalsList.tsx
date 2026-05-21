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
    <div className="rounded-3xl bg-gradient-to-b from-[#08102b] to-[#04081c] p-6 border border-white/5 shadow-xl">
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-4">
        <Sparkles size={14} className="text-amber-400" /> Nhật Ký
        Đóng Góp Giá Trị
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {journals.map((j) => (
          <JournalCard key={j.id} journal={j} />
        ))}
      </div>
    </div>
  );
}
