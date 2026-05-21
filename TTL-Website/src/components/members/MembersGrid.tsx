"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import type { MemberInfo } from "@/service/api";

interface MembersGridProps {
  filtered: MemberInfo[];
}

export default function MembersGrid({ filtered }: MembersGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filtered.map((m, index) => (
        <div
          key={m.id}
          style={{ animationDelay: `${index * 30}ms` }}
          onClick={() => router.push(`/home/members/${m.id}`)}
          className="rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-4 flex items-center gap-4 hover:border-cyan/30 hover:bg-black/40 transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 animate-[scaleUp_0.4s_ease-out_both]"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary to-cyan opacity-0 group-hover:opacity-30 blur-sm transition duration-300" />
            {m.avatar ? (
              <Image
                src={m.avatar}
                alt={m.name}
                width={44}
                height={44}
                className="relative size-11 rounded-xl object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="relative size-11 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-base font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 shadow-md">
                {m.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="text-xs font-bold text-white group-hover:text-cyan transition-colors truncate tracking-wide">
              {m.name}
            </p>
            <p className="text-[10px] text-zinc-500 truncate font-light flex items-center gap-1">
              <Briefcase size={10} className="text-zinc-600 shrink-0" /> {m.job || "Thành viên hệ thống"}
            </p>
          </div>

          <div className="shrink-0 pl-1">
            {m.isActive ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden xl:inline">Hoạt động</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-[9px] font-bold text-zinc-500">
                <span className="size-1 rounded-full bg-zinc-600" />
                <span className="hidden xl:inline">Chưa kích hoạt</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
