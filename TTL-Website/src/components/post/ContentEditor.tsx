"use client";

import { useEffect, useRef, type RefObject } from "react";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function ContentEditor({
  value,
  onChange,
  textareaRef,
}: ContentEditorProps) {
  const mirroredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mirroredRef.current && textareaRef.current) {
      mirroredRef.current.textContent = value + "\n";
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        mirroredRef.current.offsetHeight + "px";
    }
  }, [value, textareaRef]);

  return (
    <div className="glass-strong rounded-2xl p-5">
      <label className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
        Nội dung bài viết
      </label>
      <div className="relative">
        <div
          ref={mirroredRef}
          className="invisible whitespace-pre-wrap text-sm leading-relaxed px-1 min-h-[120px]"
          aria-hidden
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bạn đang nghĩ gì, chia sẻ với cộng đồng..."
          rows={5}
          className="absolute inset-0 w-full rounded-md p-1 resize-none bg-transparent outline-none text-sm leading-relaxed placeholder:text-[var(--placeholder)]" style={{ color: "var(--text-primary)", "--placeholder": "var(--text-dim)" } as React.CSSProperties}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
          {value.length > 4500 ? (
            <span className="text-danger font-medium">
              {5000 - value.length} ký tự còn lại
            </span>
          ) : (
            <span>{5000 - value.length} ký tự còn lại</span>
          )}
        </p>
      </div>
    </div>
  );
}
