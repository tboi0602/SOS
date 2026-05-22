"use client";

import { Users, Award, ChevronRight } from "lucide-react";
import type { ReferredMember } from "@/service/api";

const RANK_COLORS: Record<string, string> = {
  "Xuất sắc": "#f59e0b",
  "Tốt": "#10b981",
  "Khá": "#00b7ff",
  "Cơ bản": "#8b8b8b",
};

export default function ReferredMembers({ members }: { members: ReferredMember[] }) {
  return (
    <div className="p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff] flex items-center gap-1.5">
          <Users size={12} /> THÀNH VIÊN GIỚI THIỆU
        </h3>
        <span className="text-[10px] font-mono text-[#00b7ff]/60">
          {members.length} người
        </span>
      </div>
      <div className="space-y-2">
        {members.map((m) => {
          const color = RANK_COLORS[m.rank] || "#00b7ff";
          return (
            <div
              key={m.id}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-black/20 border border-white/2 group cursor-pointer transition-all hover:bg-white/3"
            >
              <div
                className="size-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{
                  background: `${color}18`,
                  color,
                  border: `1px solid ${color}30`,
                }}
              >
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white leading-tight truncate">
                  {m.name}
                </p>
                <p className="text-[9px] font-mono text-zinc-500">{m.referralCode}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: `${color}15`,
                    color,
                  }}
                >
                  <Award size={9} className="inline mr-0.5" />
                  {m.rank}
                </span>
                <ChevronRight
                  size={12}
                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                />
              </div>
            </div>
          );
        })}
      </div>
      {members.length > 0 && (
        <button className="mt-2 w-full py-1.5 text-[10px] font-bold text-[#00b7ff]/60 hover:text-[#00b7ff] transition-colors cursor-pointer tracking-wider">
          XEM TẤT CẢ →
        </button>
      )}
    </div>
  );
}
