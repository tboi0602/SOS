"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api, type Post } from "@/service/api";
import { useAuth } from "@/lib/auth-context";

export function usePostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.posts
      .getById(id)
      .then((data) => setPost(data.post))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async (postId: string) => {
    try {
      const res = await api.posts.toggleLike(postId);
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
    const res = await api.posts.addComment(postId, content);
    setPost((prev) =>
      prev
        ? {
            ...prev,
            comments: [
              ...prev.comments,
              {
                ...res.comment,
                isOwner: true,
                user: {
                  id: user?.id ?? "",
                  name: user?.name ?? "",
                  email: user?.email ?? "",
                  avatar: user?.avatar ?? "",
                },
              },
            ],
            commentCount: prev.commentCount + 1,
          }
        : null,
    );
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    await api.posts.deleteComment(postId, commentId);
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

  return { post, loading, handleLike, handleComment, handleDeleteComment };
}
