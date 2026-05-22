"use client";

import { Briefcase, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { TopSalesResponse } from "@/service/api";

type Member = TopSalesResponse["members"][number];

export default function RankingList({
  members,
  startIndex = 4,
}: {
  members: Member[];
  startIndex?: number;
}) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-white/5 bg-linear-to-b from-white/2 to-transparent overflow-hidden">
      <div className="divide-y divide-white/5">
        {members.map((m, i) => {
          const rank = startIndex + i;

          return (
            <div
              key={m.id}
              onClick={() => router.push(`/home/members/${m.id}`)}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-all duration-200 group cursor-pointer"
            >
              <div className="size-8 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center text-xs font-black text-zinc-500 shrink-0">
                {rank}
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
                <div className="size-10 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-sm font-black text-zinc-400 shrink-0 shadow-md">
                  {m.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-1 sm:gap-4">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-white group-hover:text-cyan transition-colors truncate tracking-wide">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1 font-light">
                    <Briefcase size={10} className="text-zinc-600 shrink-0" />
                    {m.job || "Thành viên"}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <ScoreChip label="KL" value={m.kyLuat ?? 0} color="text-blue-400" bg="bg-blue-400/10 border-blue-400/20" />
                  <ScoreChip label="ĐĐ" value={m.daoDuc ?? 0} color="text-green-400" bg="bg-green-400/10 border-green-400/20" />
                  <ScoreChip label="TCH" value={m.truyenCamHung ?? 0} color="text-amber-400" bg="bg-amber-400/10 border-amber-400/20" />
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan/10 border border-cyan/20">
                    <Star size={9} className="text-cyan" />
                    <span className="text-xs font-mono font-black text-cyan">{m.score}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreChip({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${bg}`}>
      <span className="text-[9px] font-mono font-bold text-zinc-500">{label}</span>
      <span className={`text-[11px] font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}
