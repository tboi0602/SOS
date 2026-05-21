"use client";

import { Loader2 } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <p className="text-xs text-zinc-500">
        {contentLength} ký tự
        {mediaCount > 0 && ` • ${mediaCount} file`}
      </p>
      <button
        type="submit"
        disabled={disabled || submitting}
        onClick={onSubmit}
        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all flex items-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Đang đăng...
          </>
        ) : (
          "Đăng bài"
        )}
      </button>
    </div>
  );
}
