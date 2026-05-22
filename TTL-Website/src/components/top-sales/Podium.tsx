"use client";

import { Trophy, Medal, Crown, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { TopSalesResponse } from "@/service/api";

type Member = TopSalesResponse["members"][number];

const scoreLabel = (label: string, value: number, color: string) => (
  <div className="flex items-center gap-1.5">
    <div className={`size-1.5 rounded-full ${color}`} />
    <span className="text-[9px] font-mono text-zinc-500">{label}:</span>
    <span className={`text-[9px] font-bold font-mono ${color.replace('bg-', 'text-')}`}>{value}</span>
  </div>
);

function PodiumCard({
  member,
  rank,
  heightClass,
  borderColor,
  glowColor,
  avatarBorder,
  icon: Icon,
  isFirst,
}: {
  member: Member;
  rank: number;
  heightClass: string;
  borderColor: string;
  glowColor: string;
  avatarBorder: string;
  icon: typeof Trophy;
  isFirst?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/home/members/${member.id}`)}
      className={`flex flex-col items-center w-28 sm:w-36 group cursor-pointer ${isFirst ? "-mt-8" : ""}`}
    >
      <div className={`relative mb-3 ${isFirst ? "mb-4" : ""}`}>
        <div className={`absolute -inset-1.5 rounded-full ${glowColor} opacity-60 group-hover:opacity-100 transition duration-300 ${isFirst ? "animate-pulse" : ""}`} />
        {member.avatar ? (
          <Image
            src={member.avatar.replace("http://", "https://")}
            alt={member.name}
            width={isFirst ? 64 : 56}
            height={isFirst ? 64 : 56}
            className={`relative ${isFirst ? "size-14 sm:size-16" : "size-12 sm:size-14"} rounded-full object-cover border-2 ${avatarBorder} shadow-lg group-hover:scale-105 transition duration-300`}
          />
        ) : (
          <div className={`relative ${isFirst ? "size-14 sm:size-16" : "size-12 sm:size-14"} rounded-full bg-[#111827] border-2 ${avatarBorder} flex items-center justify-center ${isFirst ? "text-xl" : "text-lg"} font-black text-white shadow-lg group-hover:scale-105 transition duration-300`}>
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
        {isFirst && <Crown size={18} className="absolute -top-4 left-1/2 -translate-y-1/2 -translate-x-1/2 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce" />}
        {!isFirst && (
          <div className={`absolute -top-3 ${rank === 2 ? "-right-1" : "-left-1"} size-5 rounded-full ${borderColor.replace('border', 'bg')} text-[#0c1020] text-[10px] font-black flex items-center justify-center border-2 border-[#0c1020]`}>
            {rank}
          </div>
        )}
      </div>
      <p className={`${isFirst ? "text-sm font-black" : "text-xs font-bold"} text-white truncate max-w-full text-center group-hover:text-cyan transition-colors`}>
        {member.name}
      </p>
      <div className="flex flex-col items-center gap-0.5 mt-1.5 mb-2">
        {scoreLabel("KL", member.kyLuat ?? 0, "bg-blue-400")}
        {scoreLabel("ĐĐ", member.daoDuc ?? 0, "bg-green-400")}
        {scoreLabel("TCH", member.truyenCamHung ?? 0, "bg-amber-400")}
        <div className="flex items-center gap-1 mt-1 pt-1 border-t border-white/8 w-full justify-center">
          <Star size={9} className="text-cyan" />
          <span className={`font-mono font-black ${isFirst ? "text-sm text-amber-400" : "text-xs text-cyan"}`}>
            {member.score}
          </span>
          <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">TB</span>
        </div>
      </div>
      <div className={`w-full ${heightClass} rounded-t-2xl bg-linear-to-b ${borderColor.replace('border', 'from').replace(/(\/\d+)/, '/10').replace('border-', '')} to-transparent border-t border-x border-white/5 flex items-center justify-center shadow-inner group-hover:border-white/20 transition-all duration-300`}>
        <Icon size={isFirst ? 26 : 20} className={`${isFirst ? "text-amber-500/70 group-hover:text-amber-400" : "text-zinc-500/60 group-hover:text-zinc-300"} group-hover:scale-110 transition-all duration-300`} />
      </div>
    </div>
  );
}

export default function Podium({ members }: { members: Member[] }) {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 pt-12 pb-4 max-w-2xl mx-auto border-b border-white/2">
      {members[1] && (
        <PodiumCard
          member={members[1]}
          rank={2}
          heightClass="h-20 sm:h-24"
          borderColor="border-slate-400/40"
          glowColor="bg-slate-400/20"
          avatarBorder="border-slate-400/40"
          icon={Medal}
        />
      )}
      {members[0] && (
        <PodiumCard
          member={members[0]}
          rank={1}
          heightClass="h-28 sm:h-36"
          borderColor="border-amber-400/30"
          glowColor="bg-amber-400/30"
          avatarBorder="border-amber-400"
          icon={Trophy}
          isFirst
        />
      )}
      {members[2] && (
        <PodiumCard
          member={members[2]}
          rank={3}
          heightClass="h-16 sm:h-20"
          borderColor="border-orange-700/40"
          glowColor="bg-orange-700/20"
          avatarBorder="border-orange-700/40"
          icon={Medal}
        />
      )}
    </div>
  );
}
