"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ExternalLink,
} from "lucide-react";
import type { Post } from "@/service/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";
import { useToast } from "@/components/ui/Toast";
import PostHeader from "@/components/post/PostHeader";
import PostImageGallery from "@/components/post/PostImageGallery";
import PostActionButtons from "@/components/post/PostActionButtons";
import PostComments from "@/components/post/PostComments";
import PostLightbox from "@/components/post/PostLightbox";

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

  return (
    <div className="post-card glass-strong max-w-2xl  rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px color-mix(in srgb, var(--clr-primary) 6%, transparent)" }}>
      <div className="p-3">
        {/* Header Post */}
        <PostHeader
          post={post}
          isOwner={isOwner}
          menuOpen={menuOpen}
          menuRef={menuRef}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
          onEdit={() => {
            setMenuOpen(false);
            onEditPost?.(post.id);
          }}
          onDelete={() => {
            setMenuOpen(false);
            setConfirmDelete(true);
          }}
          onUserClick={() => router.push(`/home/members/${post.userId}`)}
        />

        {/* Content Post */}
        <p className="text-[13px] whitespace-pre-line leading-[1.4]" style={{ color: "var(--text-secondary)" }}>
          {post.content}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.hashtags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-[10px] font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Product Link */}
        {post.productLink && (
          <a
            href={post.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-accent hover:bg-primary/20 transition-all group cursor-pointer"
          >
            <ExternalLink size={12} />
            <span className="flex-1 truncate">{post.productLink}</span>
            <span className="text-[10px] group-hover:text-accent transition-colors" style={{ color: "var(--text-tertiary)" }}>
              Mở link
            </span>
          </a>
        )}

        {/* Images Grid */}
        {post.images.length > 0 && (
          <PostImageGallery
            images={post.images}
            onImageClick={(i) => setActiveImageIndex(i)}
            getImageUrl={getImageUrl}
          />
        )}

        {/* Post Stats */}
        <div className="flex items-center gap-1 mt-2 pt-2 text-[11px]" style={{ borderTop: "1px solid var(--border-base)", color: "var(--text-tertiary)" }}>
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
        <PostActionButtons
          liked={post.liked}
          showComments={showComments}
          postId={post.id}
          onLike={() => user ? onLike(post.id) : setShowLoginModal(true)}
          onToggleComments={() => setShowComments(!showComments)}
        />
      </div>

      {/* Comments Section */}
      {showComments && (
        <PostComments
          comments={post.comments}
          user={user}
          commentText={commentText}
          onCommentTextChange={(t) => setCommentText(t)}
          onSubmitComment={handleComment}
          onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
          onLoginRequired={() => setShowLoginModal(true)}
          commenting={commenting}
        />
      )}

      {/* Lightbox */}
      <PostLightbox
        images={post.images}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        getImageUrl={getImageUrl}
      />

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
