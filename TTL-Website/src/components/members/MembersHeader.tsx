"use client";

import { Users, Search } from "lucide-react";

interface MembersHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
}

export default function MembersHeader({ search, onSearchChange, total }: MembersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-cyan/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(24,86,255,0.15)]">
          <Users size={22} className="text-cyan animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            CỘNG ĐỒNG ĐỐI TÁC
          </h1>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
            Tổng số tinh anh: <span className="text-cyan font-mono font-bold">{total}</span> thành viên
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-72 group">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan transition-colors" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm danh tính thành viên..."
          className="w-full rounded-xl bg-black/40 border border-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-cyan/40 focus:ring-1 focus:ring-cyan/10 outline-none transition-all duration-300 shadow-inner"
        />
      </div>
    </div>
  );
}
