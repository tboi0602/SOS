"use client";

import { useState } from "react";
import { Link2, X, ExternalLink } from "lucide-react";

interface ProductLinkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductLinkInput({ value, onChange }: ProductLinkInputProps) {
  const [hovered, setHovered] = useState(false);
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
        <ExternalLink size={12} /> Liên kết sản phẩm
        <span className="font-normal normal-case tracking-normal" style={{ color: "var(--text-dim)" }}>
          (tùy chọn)
        </span>
      </h3>
      <div className="relative">
        <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-dim)" }} />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/san-pham"
          className="w-full rounded-lg pl-8 pr-9 py-2.5 text-sm outline-none focus:border-primary/30 transition-colors placeholder:text-[var(--placeholder)]" style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", borderColor: "var(--border-base)", color: "var(--text-primary)", "--placeholder": "var(--text-dim)" } as React.CSSProperties}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
            style={{ color: hovered ? "var(--text-primary)" : "var(--text-tertiary)" }}
          >
            <X size={15} />
          </button>
        )}
      </div>
      {value && !isValidUrl(value) && (
        <p className="text-[10px] text-danger/70 flex items-center gap-1">
          URL không hợp lệ
        </p>
      )}
    </div>
  );
}
