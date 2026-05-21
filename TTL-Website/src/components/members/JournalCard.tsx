"use client";

import { Sparkles } from "lucide-react";
import type { JournalEntry } from "@/service/api";

interface JournalCardProps {
  journal: JournalEntry;
}

export default function JournalCard({ journal }: JournalCardProps) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 hover:bg-black/50 transition-all duration-300 group/j">
      <div className="size-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0 group-hover/j:scale-110 transition-transform">
        <Sparkles
          size={16}
          className="text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-xs font-bold text-white truncate">
          {journal.title}
        </p>
        <p className="text-[11px] text-zinc-400 font-light line-clamp-2 leading-relaxed">
          {journal.content}
        </p>
      </div>
      {journal.points > 0 && (
        <div className="text-right shrink-0 flex flex-col justify-center">
          <span className="text-sm font-black text-amber-400">
            +{journal.points}
          </span>
          <span className="text-[9px] text-zinc-600 uppercase font-bold">
            pts
          </span>
        </div>
      )}
    </div>
  );
}
