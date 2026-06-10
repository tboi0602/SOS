"use client";

import { Loader2, Send } from "lucide-react";

interface SubmitBarProps {
  contentLength: number;
  mediaCount: number;
  submitting: boolean;
  disabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SubmitBar({
  contentLength,
  mediaCount,
  submitting,
  disabled,
  onSubmit,
}: SubmitBarProps) {
  const progress = Math.min(contentLength / 5000, 1);

  return (
    <div className="glass-strong rounded-2xl p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress * 100}%`,
              background:
                progress > 0.9
                  ? "linear-gradient(90deg, #ef4444, #dc2626)"
                  : "linear-gradient(90deg, var(--clr-accent), var(--clr-accent-dark))",
            }}
          />
        </div>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>
          {contentLength}/5k
          {mediaCount > 0 && ` • ${mediaCount} file`}
        </p>
      </div>
      <button
        type="submit"
        disabled={disabled || submitting}
        onClick={onSubmit}
        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-primary)] text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer active:scale-98"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Đang đăng...
          </>
        ) : (
          <>
            <Send size={15} />
            Đăng bài
          </>
        )}
      </button>
    </div>
  );
}
