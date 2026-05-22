"use client";

import { useState } from "react";
import { usePostDetail } from "@/hook/posts/usePostDetail";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import EditPostModal from "@/components/post/EditPostModal";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PostDetailPage() {
  const router = useRouter();
  const {
    post,
    loading,
    handleLike,
    handleComment,
    handleDeleteComment,
    handleDeletePost,
    setPost,
  } = usePostDetail();
  const [editingPost, setEditingPost] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <Skeleton name="post-detail" loading={loading}>
        {!post ? (
          <div className="text-center py-20 text-zinc-500">
            Bài viết không tồn tại
          </div>
        ) : (
          <PostCard
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onDeleteComment={handleDeleteComment}
            onDeletePost={handleDeletePost}
            onEditPost={() => setEditingPost(true)}
          />
        )}
      </Skeleton>

      {editingPost && post && (
        <EditPostModal
          post={post}
          onClose={() => setEditingPost(false)}
          onUpdated={(updated) => {
            setPost(updated);
            setEditingPost(false);
          }}
        />
      )}
    </div>
  );
}
