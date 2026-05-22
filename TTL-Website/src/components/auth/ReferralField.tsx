"use client";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ReferralField({
  label,
  id,
  value,
  onChange,
  placeholder,
  className,
  status,
  name,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  status: string;
  name: string;
}) {
  const borderColor =
    status === "valid"
      ? "border-emerald-500/50"
      : status === "invalid"
        ? "border-danger/50"
        : "border-white/10";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-zinc-400 font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl bg-white/5 border px-4 py-3 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all uppercase ${borderColor} ${className}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === "checking" && (
            <Loader2 size={16} className="animate-spin text-zinc-500" />
          )}
          {status === "valid" && (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          {status === "invalid" && (
            <AlertCircle size={16} className="text-danger" />
          )}
        </div>
      </div>
      {status === "valid" && name && (
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <CheckCircle2 size={12} /> Mã hợp lệ — Người giới thiệu: {name}
        </p>
      )}
      {status === "invalid" && (
        <p className="text-xs text-danger flex items-center gap-1">
          <AlertCircle size={12} /> Mã giới thiệu không tồn tại
        </p>
      )}
    </div>
  );
}
