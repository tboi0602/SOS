"use client";

import { Share2, Copy, Check } from "lucide-react";

interface ReferralCodeCardProps {
  code: string;
  copied: boolean;
  onCopy: () => void;
}

export default function ReferralCodeCard({ code, copied, onCopy }: ReferralCodeCardProps) {
  return (
    <div className="rounded-2xl bg-linear-to-b from-white/3 to-transparent border border-white/5 p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 mb-3">
        <Share2 size={15} className="text-primary" /> Mã Liên Kết
      </h2>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-black/25 rounded-xl px-4 py-3 border border-white/5">
          <code className="text-base font-mono font-black tracking-widest text-cyan">
            {code || "---"}
          </code>
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
