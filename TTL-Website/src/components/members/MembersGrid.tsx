"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Briefcase, Shield, Medal, Sparkles } from "lucide-react";
import type { MemberInfo } from "@/service/api";

interface MembersGridProps {
  filtered: MemberInfo[];
}

export default function MembersGrid({ filtered }: MembersGridProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border bg-white/1 border-white/5 overflow-hidden">
      <div className="divide-y gap-1 divide-white/5">
        {filtered.map((m, i) => {
          const score = m.kyLuat != null ? Math.round((m.kyLuat + (m.daoDuc ?? 0) + (m.truyenCamHung ?? 0)) / 3) : null;
          return (
            <div
              key={m.id}
              onClick={() => router.push(`/home/members/${m.id}`)}
              className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-all cursor-pointer group"
            >
              <div className="shrink-0">
                {m.avatar ? (
                  <Image src={m.avatar} alt={m.name} width={40} height={40} className="size-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-primary/30 transition-all" />
                ) : (
                  <div className="size-10 rounded-xl bg-linear-to-br from-primary/15 to-cyan/10 flex items-center justify-center text-sm font-bold text-primary">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-6 gap-3 items-center">
                <div className="col-span-2 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-cyan transition-colors truncate">{m.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                    <Briefcase size={10} className="shrink-0 text-zinc-600" /> {m.job || "Thành viên"}
                  </p>
                </div>

                <div className="col-span-3 grid grid-cols-3 gap-2 text-center">
                  <div className="px-2 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-xs font-bold text-cyan">{m.kyLuat ?? 0}</p>
                    <p className="text-[9px] text-zinc-600 flex items-center justify-center gap-0.5"><Shield size={9} /> Kỷ luật</p>
                  </div>
                  <div className="px-2 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-xs font-bold text-emerald-400">{m.daoDuc ?? 0}</p>
                    <p className="text-[9px] text-zinc-600 flex items-center justify-center gap-0.5"><Medal size={9} /> Đạo đức</p>
                  </div>
                  <div className="px-2 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-xs font-bold text-amber-400">{m.truyenCamHung ?? 0}</p>
                    <p className="text-[9px] text-zinc-600 flex items-center justify-center gap-0.5"><Sparkles size={9} /> TH</p>
                  </div>
                </div>

                {score !== null && (
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-white">{score}</span>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Điểm</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
