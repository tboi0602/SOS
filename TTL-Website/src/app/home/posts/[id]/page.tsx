"use client";

import { usePostDetail } from "@/hook/posts/usePostDetail";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import PostCard from "@/components/feed/PostCard";

export default function PostDetailPage() {
  const router = useRouter();
  const { post, loading, handleLike, handleComment, handleDeleteComment } = usePostDetail();

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : !post ? (
        <div className="text-center py-20 text-zinc-500">
          Bài viết không tồn tại
        </div>
      ) : (
        <PostCard
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
}
