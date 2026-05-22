"use client";

import { Hash, X, Plus } from "lucide-react";

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
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <Hash size={12} /> Hashtag
        <span className="text-zinc-600 font-normal normal-case tracking-normal">
          (tùy chọn)
        </span>
      </h3>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder="Nhập hashtag, nhấn Space/Enter"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
          />
        </div>
        {inputValue.trim() && (
          <button
            type="button"
            onClick={() => {
              onBlur();
            }}
            className="size-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/15 text-primary text-[11px] font-medium"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-primary-light transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
