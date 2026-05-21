"use client";

import Image from "next/image";
import { Briefcase, Trophy, Star, Users } from "lucide-react";
import type { User } from "@/service/api";

interface ProfileHeroProps {
  user: User;
  totalCompetency: number;
  rank: string;
  score: number;
  referredCount: number;
}

export default function ProfileHero({ user, totalCompetency, rank, score, referredCount }: ProfileHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#0b1536] to-[#040a21] border border-white/10 p-6 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative shrink-0 animate-[scaleUp_0.5s_ease-out]">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-primary via-cyan to-emerald-400 opacity-40 blur-md group-hover:opacity-70 transition duration-500" />
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={110}
              height={110}
              className="relative size-28 rounded-[1.8rem] object-cover ring-2 ring-white/20"
            />
          ) : (
            <div className="relative size-28 rounded-[1.8rem] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 flex items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {user.name}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold text-cyan uppercase tracking-widest backdrop-blur-md">
                {totalCompetency >= 80
                  ? "Chuyên Gia Đỉnh Cao"
                  : "Thành Viên Ưu Tú"}
              </span>
            </div>
            <p className="text-zinc-400 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
              <Briefcase size={14} className="text-cyan" />{" "}
              {user.job || "Nhà Phát Triển Hệ Thống"}
            </p>
          </div>

          <p className="text-xs text-zinc-400 max-w-xl italic font-light leading-relaxed">
            `&quot;`
            {user.bio ||
              "Hồ sơ năng lực số hóa chuẩn mực cao. Không ngừng rèn luyện Kỷ luật, Đạo đức và Khả năng Truyền cảm hứng xây dựng cộng đồng vững mạnh."}
            `&quot;`
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner">
              <Trophy
                size={14}
                className="text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
              />
              <span className="text-xs text-zinc-300 font-medium">
                {rank}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner">
              <Star
                size={14}
                className="text-primary drop-shadow-[0_0_6px_rgba(24,86,255,0.5)]"
              />
              <span className="text-xs text-zinc-300 font-semibold">
                {score}{" "}
                <span className="text-[10px] text-zinc-500 font-normal">
                  Điểm tích lũy
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner">
              <Users
                size={14}
                className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]"
              />
              <span className="text-xs text-zinc-300 font-medium">
                {referredCount}{" "}
                <span className="text-[10px] text-zinc-500 font-normal">
                  Đối tác
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
