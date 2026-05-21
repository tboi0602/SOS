"use client";

import { Hash, X } from "lucide-react";

interface HashtagInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  hashtags: string[];
  onRemoveTag: (tag: string) => void;
}

export function HashtagInput({
  inputValue,
  onInputChange,
  onKeyDown,
  onBlur,
  hashtags,
  onRemoveTag,
}: HashtagInputProps) {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-3">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Hashtag (tùy chọn)
      </h3>
      <div className="flex items-center gap-2">
        <Hash size={16} className="text-zinc-500 shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder="Nhập hashtag và nhấn Space/Enter..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
        />
      </div>

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-primary-light transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
