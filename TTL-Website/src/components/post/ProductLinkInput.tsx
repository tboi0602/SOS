"use client";

import { Link2, X } from "lucide-react";

interface ProductLinkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductLinkInput({ value, onChange }: ProductLinkInputProps) {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-3">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Liên kết sản phẩm (tùy chọn)
      </h3>
      <div className="flex items-center gap-2">
        <Link2 size={16} className="text-zinc-500 shrink-0" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/product"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
