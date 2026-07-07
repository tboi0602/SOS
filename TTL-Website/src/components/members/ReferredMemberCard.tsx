"use client";
import { getInitial } from "@/utils/cn";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import type { ReferredMember } from "@/service/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ReferredMemberCardProps {
  member: ReferredMember;
  index: number;
}

export default function ReferredMemberCard({
  member,
  index,
}: ReferredMemberCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      key={member.id}
      style={{ animationDelay: `${index * 35}ms`, background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}
      onClick={() => router.push(`/home/members/${member.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-2xl p-4 flex items-center gap-4 hover:border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 animate-[scaleUp_0.4s_ease-out_both]"
    >
      <div className="relative shrink-0">
        <div className="absolute -inset-0.5 rounded-xl bg-linear-to-br from-emerald-500 to-accent opacity-0 group-hover:opacity-30 blur-sm transition duration-300" />
        {member.avatar ? (
          <Image
            src={member.avatar.startsWith("http") ? member.avatar : `${API_URL}${member.avatar}`}
            alt={member.name}
            width={44}
            height={44}
            className="relative size-11 rounded-xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="relative size-11 rounded-xl flex items-center justify-center text-base font-black" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-secondary)" }}>
            {getInitial(member.name)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-xs font-bold group-hover:text-emerald-400 transition-colors truncate tracking-wide" style={{ color: isHovered ? undefined : "var(--text-primary)" }}>
          {member.name}
        </p>
        <p className="text-[10px] font-mono truncate flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
          <QrCode size={11} className="shrink-0" style={{ color: "var(--text-dim)" }} />
          <span className="px-1.5 py-0.5 rounded group-hover:text-emerald-300 transition-colors" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", borderColor: "var(--border-base)", color: isHovered ? undefined : "var(--text-tertiary)" }}>
            {member.id}
          </span>
        </p>
      </div>

      <div className="shrink-0 pl-1">
        {member.isActive ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-[9px] font-bold text-emerald-400" style={{ border: "1px solid color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
            <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xl:inline">Hoạt Động</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold" style={{ background: "color-mix(in srgb, var(--text-primary) 10%, transparent)", borderColor: "color-mix(in srgb, var(--text-primary) 20%, transparent)", color: "var(--text-tertiary)" }}>
            <span className="size-1 rounded-full" style={{ background: "var(--text-dim)" }} />
            <span className="hidden xl:inline">Chưa kích hoạt</span>
          </div>
        )}
      </div>
    </div>
  );
}


