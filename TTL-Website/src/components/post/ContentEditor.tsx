"use client";

import type { RefObject } from "react";

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
  return (
    <div className="glass-strong rounded-2xl p-5">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Bạn đang nghĩ gì?"
        rows={6}
        className="w-full rounded-md p-1 resize-none bg-transparent text-white placeholder:text-zinc-500 outline-none text-sm leading-relaxed"
      />
    </div>
  );
}
