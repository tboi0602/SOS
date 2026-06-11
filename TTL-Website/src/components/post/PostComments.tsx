"use client";
import { getInitial } from "@/utils/cn";

import { Send } from "lucide-react";
import type { Comment } from "@/types/post";

interface PostCommentsProps {
  comments: Comment[];
  user: any;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  onDeleteComment: (commentId: string) => void;
  onLoginRequired: () => void;
  commenting: boolean;
}

export default function PostComments({
  comments,
  user,
  commentText,
  onCommentTextChange,
  onSubmitComment,
  onDeleteComment,
  onLoginRequired,
  commenting,
}: PostCommentsProps) {
  return (
    <div style={{ borderTop: "1px solid var(--border-base)" }}>
      {user ? (
        <form
          onSubmit={onSubmitComment}
          className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid var(--border-base)" }}
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary/30 transition-colors" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
          />
          <button
            type="submit"
            disabled={!commentText.trim() || commenting}
            className="text-primary hover:text-primary-light disabled:opacity-30 transition-colors cursor-pointer p-1"
          >
            <Send size={14} />
          </button>
        </form>
      ) : (
        <div className="px-3 py-2 text-center" style={{ borderBottom: "1px solid var(--border-base)" }}>
          <button
            onClick={onLoginRequired}
            className="text-[11px] text-primary hover:text-primary-light transition-colors cursor-pointer"
          >
            Đăng nhập để bình luận
          </button>
        </div>
      )}
      <div className="px-3 py-1.5 space-y-2 max-h-56 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-[11px] text-center py-2" style={{ color: "var(--text-tertiary)" }}>
            Chưa có bình luận nào
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2">
            <div className="size-6 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
              {getInitial(c.user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-lg px-2.5 py-1.5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)" }}>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.user?.name || "Người dùng"}
                </p>
                <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{c.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-0.5 px-1">
                  <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                  {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {c.isOwner && (
                  <button
                    onClick={() => onDeleteComment(c.id)}
                    className="text-[9px] hover:text-danger transition-colors cursor-pointer" style={{ color: "var(--text-tertiary)" }}
                  >
                    Xoá
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


