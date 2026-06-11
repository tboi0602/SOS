"use client";

import {
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface PostActionButtonsProps {
  liked: boolean;
  showComments: boolean;
  postId: string;
  onLike: () => void;
  onToggleComments: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function PostActionButtons({
  liked,
  showComments,
  postId,
  onLike,
  onToggleComments,
}: PostActionButtonsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `${window.location.origin}/home/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Đã sao chép liên kết bài viết", "success");
    } catch {
      toast("Không thể sao chép liên kết", "error");
    }
  };

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
      <button
        onClick={handleShare}
        aria-label="Chia sẻ"
        className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm hover:text-accent transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <Share2 size={16} />
        Chia sẻ
      </button>
    </div>
  );
}
