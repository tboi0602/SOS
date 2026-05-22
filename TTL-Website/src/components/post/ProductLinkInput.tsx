"use client";

import { Link2, X, ExternalLink } from "lucide-react";

interface ProductLinkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductLinkInput({ value, onChange }: ProductLinkInputProps) {
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
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <ExternalLink size={12} /> Liên kết sản phẩm
        <span className="text-zinc-600 font-normal normal-case tracking-normal">
          (tùy chọn)
        </span>
      </h3>
      <div className="relative">
        <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/san-pham"
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-9 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
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
