"use client";

import { Trophy, Medal, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { TopSalesResponse } from "@/service/api";

type Member = TopSalesResponse["members"][number];

export default function Podium({ members }: { members: Member[] }) {
  const router = useRouter();

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 pt-12 pb-4 max-w-2xl mx-auto border-b border-white/[0.02]">
      {members[1] && (
        <div
          onClick={() => router.push(`/home/members/${members[1].id}`)}
          className="flex flex-col items-center w-28 sm:w-36 group animate-[scaleUp_0.5s_ease-out_both] cursor-pointer"
        >
          <div className="relative mb-2">
            <div className="absolute -inset-1 rounded-full bg-slate-400/20 blur-md opacity-0 group-hover:opacity-100 transition duration-300" />
            {members[1].avatar ? (
              <Image
                src={members[1].avatar.replace("http://", "https://")}
                alt={members[1].name}
                width={56}
                height={56}
                className="relative size-12 sm:size-14 rounded-full object-cover border-2 border-slate-400/40 shadow-lg group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="relative size-12 sm:size-14 rounded-full bg-[#111827] border-2 border-slate-400/40 flex items-center justify-center text-lg font-black text-slate-300 shadow-lg group-hover:scale-105 transition duration-300">
                {members[1].name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -top-3 -right-1 size-5 rounded-full bg-slate-400 text-[#0c1020] text-[10px] font-black flex items-center justify-center border-2 border-[#0c1020]">2</div>
          </div>
          <p className="text-xs font-bold text-zinc-300 truncate max-w-full text-center group-hover:text-white transition-colors">{members[1].name}</p>
          <p className="text-[10px] font-mono font-bold text-slate-400/80 mb-3">{members[1].score} Điểm</p>
          <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-b from-slate-400/15 to-transparent border-t border-x border-slate-400/20 flex items-center justify-center shadow-inner group-hover:border-slate-400/40 transition-all duration-300">
            <Medal size={20} className="text-slate-400/60 group-hover:text-slate-300 transition-colors" />
          </div>
        </div>
      )}

      {members[0] && (
        <div
          onClick={() => router.push(`/home/members/${members[0].id}`)}
          className="flex flex-col items-center w-32 sm:w-40 group -mt-8 animate-[scaleUp_0.6s_ease-out_both] cursor-pointer"
        >
          <div className="relative mb-3">
            <div className="absolute -inset-1.5 rounded-full bg-amber-400/30 blur-lg opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse" />
            {members[0].avatar ? (
              <Image
                src={members[0].avatar.replace("http://", "https://").replace(/\/avatar\/\d+/, "/avatar/512")}
                alt={members[0].name}
                width={64}
                height={64}
                className="relative size-14 sm:size-16 rounded-full object-cover border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="relative size-14 sm:size-16 rounded-full bg-[#1e1b4b] border-2 border-amber-400 flex items-center justify-center text-xl font-black text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition duration-300">
                {members[0].name.charAt(0).toUpperCase()}
              </div>
            )}
            <Crown size={18} className="absolute -top-4 left-1/2 -translate-y-1/2 -translate-x-1/2 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce" />
          </div>
          <p className="text-sm font-black text-white truncate max-w-full text-center tracking-wide group-hover:text-amber-300 transition-colors">{members[0].name}</p>
          <p className="text-xs font-mono font-black text-amber-400 mb-3 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">{members[0].score} Điểm</p>
          <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent border-t border-x border-amber-400/30 flex items-center justify-center shadow-2xl group-hover:border-amber-400/50 transition-all duration-300">
            <Trophy size={26} className="text-amber-500/70 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" />
          </div>
        </div>
      )}

      {members[2] && (
        <div
          onClick={() => router.push(`/home/members/${members[2].id}`)}
          className="flex flex-col items-center w-28 sm:w-36 group animate-[scaleUp_0.5s_ease-out_both] cursor-pointer"
        >
          <div className="relative mb-2">
            <div className="absolute -inset-1 rounded-full bg-orange-700/20 blur-md opacity-0 group-hover:opacity-100 transition duration-300" />
            {members[2].avatar ? (
              <Image
                src={members[2].avatar.replace("http://", "https://")}
                alt={members[2].name}
                width={56}
                height={56}
                className="relative size-12 sm:size-14 rounded-full object-cover border-2 border-orange-700/40 shadow-lg group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="relative size-12 sm:size-14 rounded-full bg-[#111827] border-2 border-orange-700/40 flex items-center justify-center text-lg font-black text-orange-500 shadow-lg group-hover:scale-105 transition duration-300">
                {members[2].name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -top-3 -left-1 size-5 rounded-full bg-orange-700 text-[#0c1020] text-[10px] font-black flex items-center justify-center border-2 border-[#0c1020]">3</div>
          </div>
          <p className="text-xs font-bold text-zinc-300 truncate max-w-full text-center group-hover:text-white transition-colors">{members[2].name}</p>
          <p className="text-[10px] font-mono font-bold text-orange-500/80 mb-3">{members[2].score} Điểm</p>
          <div className="w-full h-16 sm:h-20 rounded-t-2xl bg-gradient-to-b from-orange-700/15 to-transparent border-t border-x border-orange-700/20 flex items-center justify-center shadow-inner group-hover:border-orange-700/40 transition-all duration-300">
            <Medal size={20} className="text-orange-700/60 group-hover:text-orange-500 transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}
