"use client";

import { Share2, Copy, Check } from "lucide-react";

interface ReferralLinkCardProps {
  link: string;
  copied: boolean;
  onCopy: () => void;
}

export default function ReferralLinkCard({ link, copied, onCopy }: ReferralLinkCardProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: "var(--text-secondary)" }}>
        <Share2 size={15} className="text-primary" /> Đường Dẫn Đăng Ký
      </h2>
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-xl px-4 py-3 min-w-0" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
          <p className="text-xs font-mono truncate" style={{ color: "var(--text-tertiary)" }}>
            {link}
          </p>
        </div>
        <button
          onClick={onCopy}
          className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-all cursor-pointer shrink-0 shadow-md"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}
