"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import type { MemberInfo } from "@/service/api";

interface ReferredMemberCardProps {
  member: MemberInfo;
  index: number;
}

export default function ReferredMemberCard({
  member,
  index,
}: ReferredMemberCardProps) {
  const router = useRouter();

  return (
    <div
      key={member.id}
      style={{ animationDelay: `${index * 35}ms` }}
      onClick={() => router.push(`/home/members/${member.id}`)}
      className="rounded-2xl bg-linear-to-b from-white/3 to-transparent border border-white/5 p-4 flex items-center gap-4 hover:border-emerald-500/30 hover:bg-black/40 transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 animate-[scaleUp_0.4s_ease-out_both]"
    >
      <div className="relative shrink-0">
        <div className="absolute -inset-0.5 rounded-xl bg-linear-to-br from-emerald-500 to-cyan opacity-0 group-hover:opacity-30 blur-sm transition duration-300" />
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            width={44}
            height={44}
            className="relative size-11 rounded-xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="relative size-11 rounded-xl bg-[#07141a] border border-emerald-500/10 flex items-center justify-center text-base font-black text-transparent bg-clip-text bg-linear-to-br from-white to-zinc-500 shadow-md">
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate tracking-wide">
          {member.name}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono truncate flex items-center gap-1.5">
          <QrCode size={11} className="text-zinc-600 shrink-0" />
          <span className="bg-white/3 px-1.5 py-0.5 rounded border border-white/5 text-zinc-400 group-hover:text-emerald-300 transition-colors">
            {member.referralCode || "No Code"}
          </span>
        </p>
      </div>

      <div className="shrink-0 pl-1">
        {member.isActive ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
            <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xl:inline">Hoạt Động</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-[9px] font-bold text-zinc-500">
            <span className="size-1 rounded-full bg-zinc-600" />
            <span className="hidden xl:inline">Chưa kích hoạt</span>
          </div>
        )}
      </div>
    </div>
  );
}
