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
  const borderColorStyle =
    status === "valid"
      ? "color-mix(in srgb, var(--color-success) 50%, transparent)"
      : status === "invalid"
        ? "color-mix(in srgb, var(--color-danger) 50%, transparent)"
        : "var(--border-base)";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all uppercase ${className}`}
          style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-primary)", borderColor: borderColorStyle }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === "checking" && (
            <Loader2 size={16} className="animate-spin" style={{ color: "var(--text-tertiary)" }} />
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
