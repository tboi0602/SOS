"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Post } from "@/service/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";
import { useToast } from "@/components/ui/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (postId: string, content: string) => Promise<void>;
  onDeleteComment: (postId: string, commentId: string) => Promise<void>;
  onDeletePost?: (id: string) => void;
  onEditPost?: (id: string) => void;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onDeleteComment,
  onDeletePost,
  onEditPost,
}: PostCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isOwner = user?.id === post.userId;
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDeleteConfirm = () => {
    setConfirmDelete(false);
    onDeletePost?.(post.id);
    toast("Đã xoá bài viết", "success");
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      await onComment(post.id, commentText.trim());
      setCommentText("");
    } finally {
      setCommenting(false);
    }
  };

  const handlePrevImage = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : post.images.length - 1,
    );
  }, [activeImageIndex, post.images.length]);

  const handleNextImage = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) =>
      prev !== null && prev < post.images.length - 1 ? prev + 1 : 0,
    );
  }, [activeImageIndex, post.images.length]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") setActiveImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, handlePrevImage, handleNextImage]);

  const getImageUrl = (url: string) => {
    return url.startsWith("http") || url.startsWith("blob:")
      ? url
      : `${API_URL}${url}`;
  };

  const MAX_DISPLAY_IMAGES = 2;
  const hasMoreImages = post.images.length > MAX_DISPLAY_IMAGES;
  const displayImages = post.images.slice(0, MAX_DISPLAY_IMAGES);

  return (
    <div className="post-card glass-strong rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px color-mix(in srgb, var(--clr-primary) 6%, transparent)" }}>
      <div className="p-5">
        {/* Header Post */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/home/members/${post.userId}`)}
          >
            {post.user.avatar ? (
              <Image
                src={getImageUrl(post.user.avatar)}
                alt={`${post.user.name}'s avatar`}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {post.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold hover:text-accent transition-colors" style={{ color: "var(--text-primary)" }}>
                {post.user.name}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* 3-dot menu for post owner */}
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg transition-all cursor-pointer"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Tùy chọn bài viết"
                onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 min-w-36 rounded-xl py-1 z-40" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)" }}>
                  {onEditPost && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEditPost(post.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-all cursor-pointer" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <Pencil size={14} /> Sửa bài
                    </button>
                  )}
                  {onDeletePost && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmDelete(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-danger hover:bg-danger/10 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} /> Xoá bài
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Post */}
        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {post.content}
        </p>

        {/* Product Link */}
        {post.productLink && (
          <a
            href={post.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm text-accent hover:bg-primary/20 transition-all group cursor-pointer"
          >
            <ExternalLink size={14} />
            <span className="flex-1 truncate">{post.productLink}</span>
            <span className="text-xs group-hover:text-accent transition-colors" style={{ color: "var(--text-tertiary)" }}>
              Mở link
            </span>
          </a>
        )}

        {/* Images Grid */}
        {post.images.length > 0 && (
          <div
            className={`mt-3 grid gap-2 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {displayImages.map((url, i) => {
              const isLastDisplay = i === MAX_DISPLAY_IMAGES - 1;
              return (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl aspect-square max-h-75 cursor-pointer group" style={{ border: "1px solid var(--border-base)" }}
                  onClick={() => setActiveImageIndex(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(url)}
                    alt={`Post attachment ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {isLastDisplay && hasMoreImages && (
                    <div className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center font-bold text-xl select-none" style={{ background: "color-mix(in srgb, var(--text-primary) 60%, transparent)", color: "var(--text-primary)" }}>
                      +{post.images.length - MAX_DISPLAY_IMAGES}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center gap-1 mt-4 pt-3 text-xs" style={{ borderTop: "1px solid var(--border-base)", color: "var(--text-tertiary)" }}>
          <span>{post.likeCount} lượt thích</span>
          <span className="mx-2">·</span>
          <button
            onClick={() => setShowComments(!showComments)}
            className="transition-colors cursor-pointer" style={{ color: "var(--text-tertiary)" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}
          >
            {post.commentCount} bình luận
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => user ? onLike(post.id) : setShowLoginModal(true)}
            aria-label={post.liked ? "Bỏ thích" : "Thích"}
            className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm transition-all cursor-pointer ${post.liked ? "text-accent bg-accent/10" : "hover:text-accent"}`} style={post.liked ? {} : { color: "var(--text-tertiary)" }} onMouseEnter={(e) => { if (!post.liked) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; } }} onMouseLeave={(e) => { if (!post.liked) { e.currentTarget.style.background = "transparent"; } }}
          >
            <ThumbsUp size={16} fill={post.liked ? "currentColor" : "none"} />
            Like
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            aria-label="Bình luận"
            className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm hover:text-accent transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <MessageCircle size={16} />
            Bình luận
            {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ borderTop: "1px solid var(--border-base)" }}>
          {user ? (
            <form
              onSubmit={handleComment}
              className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid var(--border-base)" }}
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận..."
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/30 transition-colors" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || commenting}
                className="text-primary hover:text-primary-light disabled:opacity-30 transition-colors cursor-pointer p-1"
              >
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div className="px-5 py-3 text-center" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs text-primary hover:text-primary-light transition-colors cursor-pointer"
              >
                Đăng nhập để bình luận
              </button>
            </div>
          )}
          <div className="px-5 py-2 space-y-3 max-h-64 overflow-y-auto">
            {post.comments.length === 0 && (
              <p className="text-xs text-center py-3" style={{ color: "var(--text-tertiary)" }}>
                Chưa có bình luận nào
              </p>
            )}
            {post.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <div className="size-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {(c.user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="rounded-xl px-3 py-2" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {c.user?.name || "Người dùng"}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {c.isOwner && (
                      <button
                        onClick={() => onDeleteComment(post.id, c.id)}
                        className="text-[10px] hover:text-danger transition-colors cursor-pointer" style={{ color: "var(--text-tertiary)" }}
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
      )}

      {/* Lightbox — portal ra body để tránh ảnh hưởng từ CSS cha */}
      {typeof window === "object" && activeImageIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
          style={{ background: "color-mix(in srgb, var(--surface-base) 80%, transparent)", backdropFilter: "blur(6px)" }}
          onClick={() => setActiveImageIndex(null)}
        >
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10" style={{ color: "var(--text-primary)" }}>
            <span className="text-sm text-accent font-bold">
              Ảnh {activeImageIndex + 1} trên {post.images.length}
            </span>
            <button
              onClick={() => setActiveImageIndex(null)}
              className="p-2 rounded-full transition-colors cursor-pointer" style={{ color: "var(--text-primary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>
          <div
            className="relative w-full max-w-5xl h-full flex items-center justify-center px-4 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(post.images[activeImageIndex])}
              alt={`Ảnh bài viết ${activeImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>
          {post.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 active:scale-95 rounded-full transition-all cursor-pointer z-10" style={{ border: "1px solid var(--border-base)", background: "var(--surface-elevated)", color: "var(--text-primary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 15%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-elevated)"; }}
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 active:scale-95 rounded-full transition-all cursor-pointer z-10" style={{ border: "1px solid var(--border-base)", background: "var(--surface-elevated)", color: "var(--text-primary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 15%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-elevated)"; }}
                aria-label="Ảnh tiếp"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>,
        document.body
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Xoá bài viết"
        message="Bạn có chắc chắn muốn xoá bài viết này? Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(false)}
      />

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Vui lòng đăng nhập để tương tác với bài viết."
      />
    </div>
  );
}
