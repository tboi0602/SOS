"use client";

import { Trophy } from "lucide-react";

export default function TopSalesHeader() {
  return (
    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
      <div className="size-12 rounded-2xl bg-linear-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]">
        <Trophy size={22} className="text-amber-400 animate-pulse" />
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          ĐẤU TRƯỜNG TINH ANH
        </h1>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
          Vinh danh Top thành viên có điểm năng lực hệ thống cao nhất
        </p>
      </div>
    </div>
  );
}
