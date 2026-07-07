"use client";
import { getInitial } from "@/utils/cn";

import { Camera, Loader2, Copy, Check } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProfileBanner({
  name,
  email,
  id,
  avatar,
  bio,
  uploading,
  onFileChange,
}: {
  name: string;
  email: string;
  id: string;
  avatar: string | null;
  bio: string;
  uploading: boolean;
  onFileChange: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const avatarSrc = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_URL}${avatar}`
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="relative group shrink-0">
        <div
          className="size-24 sm:size-28 rounded-full p-1 overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_0_40px_var(--clr-accent)]"
          style={{
            background:
              "linear-gradient(135deg, var(--clr-accent), var(--clr-accent-dark))",
            boxShadow:
              "0 0 25px color-mix(in srgb, var(--clr-accent) 35%, transparent)",
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="avatar"
                fill
                priority
                className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-3xl sm:text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {getInitial(name)}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {uploading ? (
            <Loader2
              size={20}
              style={{ color: "#fff" }}
              className="animate-spin"
            />
          ) : (
            <Camera size={20} style={{ color: "#fff" }} />
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className="flex-1 text-center sm:text-left space-y-2">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {name || "Người dùng"}
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">
            {email}
          </p>
        </div>

        <button
          type="button"
          onClick={copyReferral}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-base)] text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" /> Đã sao chép
            </>
          ) : (
            <>
              <Copy size={12} /> Mã giới thiệu:{" "}
              <span className="text-[var(--clr-accent)] font-mono font-bold">
                {id}
              </span>
            </>
          )}
        </button>

        <p className="text-xs text-[var(--text-tertiary)] leading-relaxed max-w-lg break-words">
          {bio || "Chưa có giới thiệu"}
        </p>
      </div>

      <p className="hidden sm:block text-[9px] text-[var(--text-dim)] self-start shrink-0 mt-1 select-none">
        Di chuột lên ảnh để đổi
      </p>
    </div>
  );
}
