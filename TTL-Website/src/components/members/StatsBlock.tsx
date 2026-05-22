"use client";

import { FileText, Calendar, Zap } from "lucide-react";

interface StatsBlockProps {
  postCount: number;
  memberDays: number;
}

export default function StatsBlock({ postCount, memberDays }: StatsBlockProps) {
  return (
    <div className="rounded-3xl bg-linear-to-b from-[#08102b] to-[#04081c] p-6 border border-white/5 shadow-xl">
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-4">
        <Zap size={14} className="text-emerald-400" /> Tiến Trình Hệ
        Thống
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            label: "Bài viết chia sẻ",
            value: postCount,
            sub: "Nội dung chất lượng",
            icon: FileText,
            color: "text-blue-400",
          },
          {
            label: "Thời gian đồng hành",
            value: memberDays,
            suffix: " Ngày",
            sub: "Thành viên trung thành",
            icon: Calendar,
            color: "text-emerald-400",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-black/30 rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors"
            >
              <div
                className={`size-12 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center ${s.color}`}
              >
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {s.value}
                  <span className="text-xs font-medium text-zinc-400">
                    {s.suffix || ""}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-zinc-300 mt-0.5">
                  {s.label}
                </p>
                <p className="text-[9px] text-zinc-500 font-light">
                  {s.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
