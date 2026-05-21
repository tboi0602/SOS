"use client";

import { Crown, Medal, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { TopSalesResponse } from "@/service/api";

type Member = TopSalesResponse["members"][number];

const RANK_META = [
  {
    icon: Crown,
    color: "from-amber-300 via-yellow-400 to-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    label: "Vàng",
  },
  {
    icon: Medal,
    color: "from-slate-200 via-zinc-300 to-slate-400",
    text: "text-slate-300",
    bg: "bg-slate-300/10",
    border: "border-slate-400/20",
    glow: "shadow-[0_0_20px_rgba(203,213,225,0.1)]",
    label: "Bạc",
  },
  {
    icon: Medal,
    color: "from-amber-600 via-orange-700 to-amber-800",
    text: "text-orange-500",
    bg: "bg-amber-700/10",
    border: "border-amber-700/20",
    glow: "shadow-[0_0_20px_rgba(194,65,12,0.1)]",
    label: "Đồng",
  },
];

export default function RankingList({ members }: { members: Member[] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent overflow-hidden">
      <div className="divide-y divide-white/5">
        {members.map((m, i) => {
          const isTop3 = i < 3;
          const meta = RANK_META[i];

          return (
            <div
              key={m.id}
              onClick={() => router.push(`/home/members/${m.id}`)}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.03] transition-all duration-200 group cursor-pointer"
              style={
                isTop3
                  ? {
                    background: `linear-gradient(90deg, ${meta.bg.replace("bg-", "").replace("/10", "10").replace(/\//g, "")}05, transparent)`,
                  }
                  : undefined
              }
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`size-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${isTop3
                      ? `${meta.bg} ${meta.text} ${meta.border} ${meta.glow}`
                      : "bg-black/30 text-zinc-500 border-white/5"
                    }`}
                >
                  {isTop3 ? <meta.icon size={13} className="animate-pulse" /> : i + 1}
                </div>

                {m.avatar ? (
                  <Image
                    src={m.avatar.replace("http://", "https://")}
                    alt={m.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-xl object-cover shrink-0 shadow-md border border-white/10 group-hover:border-cyan/40 transition-colors"
                  />
                ) : (
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-md border ${i === 0
                        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                        : i === 1
                          ? "bg-slate-300/10 text-slate-300 border-slate-300/20"
                          : i === 2
                            ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            : "bg-[#0f172a] text-zinc-400 border-white/10"
                      }`}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-white group-hover:text-cyan transition-colors truncate tracking-wide">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1 font-light">
                    <Briefcase size={10} className="text-zinc-600 shrink-0" />
                    {m.job || "Thành viên liên kết"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-sm font-mono font-black tracking-wider ${isTop3 ? meta.text : "text-white"} group-hover:text-cyan transition-colors`}>
                  {m.score}
                </span>
                <span className="text-[9px] text-zinc-600 font-bold block uppercase tracking-widest mt-0.5">Điểm số</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
