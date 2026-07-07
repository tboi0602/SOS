"use client";
import { getInitial } from "@/utils/cn";

import { MessageCircle, ExternalLink } from "lucide-react";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const SOCIALS = [
  {
    key: "facebook" as const,
    label: "Facebook",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: "twitter" as const,
    label: "X (Twitter)",
    color: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    color: "#FE2C55",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: "zalo" as const,
    label: "Zalo",
    color: "#0068FF",
    icon: <MessageCircle size={16} />,
  },
];

export default function ProfileHeader({
  name,
  id,
  avatar,
  bio,
  job,
  rank,
  facebook,
  twitter,
  tiktok,
  youtube,
  zalo,
}: {
  name: string;
  id: string;
  avatar: string | null;
  bio: string | null;
  job: string | null;
  rank: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  zalo: string | null;
}) {
  const avatarSrc = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_URL}${avatar}`
    : null;


  const socialValues: Record<string, string | null> = {
    facebook,
    twitter,
    tiktok,
    youtube,
    zalo,
  };

  return (
    <div className="p-4 space-y-4">
      {/* Title */}
      <h3 className="text-[11px] font-bold tracking-[0.15em] text-[var(--clr-accent)]">
        HỒ SƠ NĂNG LỰC
      </h3>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="size-14 rounded-full p-0.5"
            style={{
              background:
                "linear-gradient(135deg, var(--clr-accent), var(--clr-accent-dark))",
              boxShadow:
                "0 0 15px color-mix(in srgb, var(--clr-accent) 40%, transparent)",
            }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
                width={56}
                height={56}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-lg font-bold">
                {getInitial(name)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-500 border-2 border-[var(--border-base)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="size-2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        </div>
        <div className="min-w-0">
          <h2
            className="text-base font-bold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h2>
          <p className="text-[10px] text-[var(--text-tertiary)] font-mono">
            ID: {id}
          </p>
        </div>
      </div>

      {/* job + rank */}
      <div className="flex gap-2">
        <span
          title="Công việc "
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border"
          style={{
            borderColor:
              "color-mix(in srgb, var(--color-success) 20%, transparent)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-2.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {job || "Chưa câp nhật"}
        </span>
        <span
          title="Rank"
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--clr-accent)]/10 text-[var(--clr-accent)] border border-[var(--clr-accent)]/20"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {rank || "Bronze"}
        </span>
      </div>

      {/* Bio */}
      <div
        className="rounded-xl border p-3"
        style={{
          background:
            "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
          boxShadow:
            "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
          borderColor: "var(--border-base)",
        }}
      >
        <p className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] mb-1.5 flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-3"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          GIỚI THIỆU
        </p>
        {bio ? (
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {bio}
          </p>
        ) : (
          <p className="text-[11px] text-[var(--text-dim)] italic">
            Chưa có giới thiệu
          </p>
        )}
      </div>

      {/* Social Links */}
      <div>
        <p className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] mb-2 flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-3"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          MẠNG XÃ HỘI
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SOCIALS.filter((s) => socialValues[s.key]).map((s) => {
            const value = socialValues[s.key];
            const connected = value;
            return (
              <a
                key={s.key}
                href={
                  connected
                    ? value!.startsWith("http")
                      ? value!
                      : `https://${value}`
                    : "#"
                }
                target={connected ? "_blank" : undefined}
                rel={connected ? "noopener noreferrer" : undefined}
                className="group relative flex flex-col items-center gap-1 rounded-xl py-2.5 transition-all cursor-pointer"
                style={{
                  background: connected ? `${s.color}15` : "transparent",
                  border: connected
                    ? `1px solid ${s.color}25`
                    : "1px solid color-mix(in srgb, var(--text-primary) 4%, transparent)",
                }}
                title={
                  connected
                    ? `${s.label}: ${value}`
                    : `${s.label} — Chưa kết nối`
                }
              >
                <span
                  className="flex items-center justify-center size-7 rounded-lg transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: connected
                      ? `${s.color}20`
                      : "color-mix(in srgb, var(--text-primary) 4%, transparent)",
                    color: connected ? s.color : "rgb(113,113,122)",
                  }}
                >
                  {connected ? (
                    s.icon
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-4"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </span>
                {connected && (
                  <ExternalLink
                    size={8}
                    className="text-[var(--text-dim)] absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <span className="text-[8px] font-medium text-[var(--text-tertiary)] leading-none">
                  {connected ? s.label : "Kết nối"}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
