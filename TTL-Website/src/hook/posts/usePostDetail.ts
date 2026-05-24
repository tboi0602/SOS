"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { postService } from "@/service/post.service";
import type { Post, Comment } from "@/service/api";
import { useAuth } from "@/lib/auth-context";

export function usePostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
postService
      .getById(id)
      .then((data) => setPost(data.post))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const res = await postService.toggleLike(postId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              liked: res.liked,
              likeCount: prev.likeCount + (res.liked ? 1 : -1),
            }
          : null,
      );
    } catch {}
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user) return;
    const res = await postService.addComment(postId, content);
    const newComment: Comment = {
      ...res.comment,
      isOwner: true,
      user: {
        id: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
        avatar: user?.avatar ?? "",
      },
    }
    setPost((prev) =>
      prev
        ? {
            ...prev,
            comments: [...prev.comments, newComment],
            commentCount: prev.commentCount + 1,
          }
        : null,
    );
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!user) return;
    await postService.deleteComment(postId, commentId);
    setPost((prev) =>
      prev
        ? {
            ...prev,
            comments: prev.comments.filter((c) => c.id !== commentId),
            commentCount: prev.commentCount - 1,
          }
        : null,
    );
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    await postService.delete(postId);
    setPost(null);
  };

  return { post, loading, handleLike, handleComment, handleDeleteComment, handleDeletePost, setPost };
}
