"use client";

import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProfileBanner({
  name,
  email,
  referralCode,
  avatar,
  bio,
  uploading,
  onFileChange,
}: {
  name: string;
  email: string;
  referralCode: string | null;
  avatar: string | null;
  bio: string;
  uploading: boolean;
  onFileChange: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const avatarSrc = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_URL}${avatar}`
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
  };

  return (
    <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* Avatar */}
      <div className="relative group shrink-0">
        <div
          className="size-24 sm:size-28 rounded-full p-1 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #00b7ff, #0066ff)",
            boxShadow: "0 0 25px rgba(0,183,255,0.35)",
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {avatarSrc ? (
              <Image
                src={avatarSrc.replace("http://", "https://")}
                alt="avatar"
                fill
                priority
                className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0f2546] flex items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-white" />
          ) : (
            <Camera size={20} className="text-white" />
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

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {name || "Người dùng"}
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">{email}</p>
        <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
          ID: {referralCode || "—"}
        </p>
        <p className="text-[11px] text-zinc-500 mt-2 max-w-md">
          {bio || "Chưa có giới thiệu"}
        </p>
      </div>

      <p className="hidden sm:block text-[9px] text-zinc-600 self-start shrink-0 mt-1 select-none">
        Di chuột lên ảnh để đổi
      </p>
    </div>
  );
}
