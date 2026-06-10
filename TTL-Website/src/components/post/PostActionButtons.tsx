"use client";

import {
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PostActionButtonsProps {
  liked: boolean;
  showComments: boolean;
  onLike: () => void;
  onToggleComments: () => void;
}

export default function PostActionButtons({
  liked,
  showComments,
  onLike,
  onToggleComments,
}: PostActionButtonsProps) {
  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={onLike}
        aria-label={liked ? "Bỏ thích" : "Thích"}
        className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm transition-all cursor-pointer ${liked ? "text-accent bg-accent/10" : "hover:text-accent"}`} style={liked ? {} : { color: "var(--text-tertiary)" }} onMouseEnter={(e) => { if (!liked) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; } }} onMouseLeave={(e) => { if (!liked) { e.currentTarget.style.background = "transparent"; } }}
      >
        <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
        Like
      </button>
      <button
        onClick={onToggleComments}
        aria-label="Bình luận"
        className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm hover:text-accent transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <MessageCircle size={16} />
        Bình luận
        {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
}
