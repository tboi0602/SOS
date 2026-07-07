"use client";
import { getInitial } from "@/utils/cn";

import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
import {
  Briefcase,
  Trophy,
  Star,
  Users,
  MapPin,
  ExternalLink,
} from "lucide-react";
import type { User } from "@/service/api";

interface ProfileHeroProps {
  user: User;
  totalCompetency: number;
  rank: string;
  score: number;
  referredCount: number;
}

export default function ProfileHero({
  user,
  totalCompetency,
  rank,
  score,
  referredCount,
}: ProfileHeroProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 group"
      style={{
        background:
          "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow:
          "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative shrink-0 animate-[scaleUp_0.5s_ease-out]">
          <div className="absolute -inset-1 rounded-4xl bg-linear-to-tr from-primary via-accent to-emerald-400 opacity-40 blur-md group-hover:opacity-70 transition duration-500" />
          {user.avatar ? (
            <Image
              src={
                user.avatar.startsWith("http")
                  ? user.avatar
                  : `${API_URL}${user.avatar}`
              }
              alt={user.name}
              width={110}
              height={110}
              className="relative size-28 rounded-[1.8rem] object-cover ring-2 ring-white/20"
            />
          ) : (
            <div
              className="relative size-28 rounded-[1.8rem] bg-linear-to-r from-[var(--surface-elevated)] to-[var(--surface-base)] flex items-center justify-center text-4xl font-extrabold text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-base)" }}
            >
              {getInitial(user.name)}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                {user.name}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold text-accent uppercase tracking-widest backdrop-blur-md">
                {totalCompetency >= 100
                  ? "Chuyên Gia Đỉnh Cao"
                  : totalCompetency >= 50
                    ? "Thành Viên Ưu Tú"
                    : "Thành Viên"}
              </span>
            </div>
            <p
              title="Nghề nghiệp"
              className="text-sm font-medium flex items-center justify-center md:justify-start gap-1.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Briefcase size={14} className="text-accent" />{" "}
              {user.job || "Chưa cập nhật"}
            </p>
          </div>

          <p
            className="text-xs max-w-xl italic font-light leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            `&quot;`
            {user.bio ||
              "Hồ sơ năng lực số hóa chuẩn mực cao. Không ngừng rèn luyện Kỷ luật, Đạo đức và Khả năng Truyền cảm hứng xây dựng cộng đồng vững mạnh."}
            `&quot;`
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-inner"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                borderColor: "var(--border-base)",
              }}
            >
              <Trophy size={14} className="text-amber-400" />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {rank}
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-inner"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                borderColor: "var(--border-base)",
              }}
            >
              <Star size={14} className="text-primary" />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                {score}{" "}
                <span
                  className="text-[10px] font-normal"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Điểm
                </span>
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-inner"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                borderColor: "var(--border-base)",
              }}
            >
              <Users size={14} className="text-emerald-400" />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {referredCount}{" "}
                <span
                  className="text-[10px] font-normal"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Đối tác
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-5 pt-4 border-t"
        style={{ borderColor: "var(--border-base)" }}
      >
        {user.address && (
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 3%, transparent)",
              color: "var(--text-tertiary)",
            }}
          >
            <MapPin size={11} className="text-accent" /> {user.address}
          </span>
        )}
        {[
          { key: "facebook", label: "Facebook", url: user.facebook },
          { key: "twitter", label: "Twitter", url: user.twitter },
          { key: "zalo", label: "Zalo", url: user.zalo },
          { key: "tiktok", label: "TikTok", url: user.tiktok },
          { key: "youtube", label: "YouTube", url: user.youtube },
        ].map((s) =>
          s.url ? (
            <a
              key={s.key}
              href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all hover:-translate-y-0.5"
              style={{
                background:
                  "color-mix(in srgb, var(--clr-accent) 8%, transparent)",
                color: "var(--clr-accent)",
                border:
                  "0.5px solid color-mix(in srgb, var(--clr-accent) 15%, transparent)",
              }}
            >
              <ExternalLink size={10} /> {s.label}
            </a>
          ) : null,
        )}
      </div>
    </div>
  );
}
