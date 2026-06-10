"use client";

import { useRef } from "react";
import { Calendar, X } from "lucide-react";

interface DateFilterProps {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

function formatDate(input: string) {
  if (!input) return "Chọn ngày";
  const d = new Date(input + "T00:00:00");
  return d.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export default function DateFilter({
  from,
  to,
  onFromChange,
  onToChange,
}: DateFilterProps) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const openFrom = () => {
    fromRef.current?.showPicker();
  };

  const openTo = () => {
    toRef.current?.showPicker();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={openFrom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[color-mix(in_srgb,_var(--text-primary)_5%,_transparent)] border border-[var(--border-base)] text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,_var(--text-primary)_10%,_transparent)] transition-all cursor-pointer min-h-8"
        >
          <Calendar size={12} />
          <span>{from ? formatDate(from) : "Từ ngày"}</span>
          {from && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onFromChange("");
              }}
              className="ml-0.5 p-0.5 rounded hover:bg-[color-mix(in_srgb,_var(--text-primary)_10%,_transparent)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={10} />
            </span>
          )}
        </button>
        <input
          ref={fromRef}
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-none"
          aria-label="Chọn ngày bắt đầu"
        />
      </div>
      <span className="text-[10px] text-[var(--text-tertiary)]">–</span>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={openTo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[color-mix(in_srgb,_var(--text-primary)_5%,_transparent)] border border-[var(--border-base)] text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,_var(--text-primary)_10%,_transparent)] transition-all cursor-pointer min-h-8"
        >
          <Calendar size={12} />
          <span>{to ? formatDate(to) : "Đến ngày"}</span>
          {to && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToChange("");
              }}
              className="ml-0.5 p-0.5 rounded hover:bg-[color-mix(in_srgb,_var(--text-primary)_10%,_transparent)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={10} />
            </span>
          )}
        </button>
        <input
          ref={toRef}
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-none"
          aria-label="Chọn ngày kết thúc"
        />
      </div>
    </div>
  );
}
