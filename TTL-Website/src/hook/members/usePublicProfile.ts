"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { profileService } from "@/service/profile.service";
import { postService } from "@/service/post.service";
import type { PublicProfileResponse, Comment } from "@/service/api";
import { useAuth } from "@/lib/auth-context";

export function usePublicProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [data, setData] = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mountedAt] = useState(() => Date.now());
  const [tab, setTab] = useState<"profile" | "posts">("profile");

  useEffect(() => {
    profileService
      .getPublicProfile(id)
      .then(setData)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const res = await postService.toggleLike(postId);
      setData((prev) =>
        prev
          ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? {
                  ...p,
                  liked: res.liked,
                  likeCount: p.likeCount + (res.liked ? 1 : -1),
                }
                : p,
            ),
          }
          : null,
      );
    } catch { }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user) return;
    try {
      const res = await postService.addComment(postId, content);
      const newComment: Comment = {
        ...res.comment,
        isOwner: true,
        user: {
          id: user?.id ?? "",
          name: user?.name ?? "",
          email: user?.email ?? "",
          avatar: user?.avatar ?? null,
        },
      }
      setData((prev) =>
        prev
          ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? { ...p, comments: [...p.comments, newComment], commentCount: p.commentCount + 1 }
                : p,
            ),
          }
          : null,
      );
    } catch { }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!user) return;
    try {
      await postService.deleteComment(postId, commentId);
      setData((prev) =>
        prev
          ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? {
                  ...p,
                  comments: p.comments.filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (c: any) => c.id !== commentId,
                  ),
                  commentCount: p.commentCount - 1,
                }
                : p,
            ),
          }
          : null,
      );
    } catch { }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    try {
      await postService.delete(postId);
      setData((prev) =>
        prev
          ? { ...prev, posts: prev.posts.filter((p) => p.id !== postId) }
          : null,
      );
    } catch {}
  };

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/home/members/${id}`
      : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&color=FFFFFF&bgcolor=1A1A1A`;

  const memberDays = data?.user?.createdAt
    ? Math.floor((mountedAt - new Date(data.user.createdAt).getTime()) / 86400000)
    : 0;

  const totalCompetency =
    Math.round(
      ((data?.user.kyLuat ?? 0) + (data?.user.daoDuc ?? 0) + (data?.user.truyenCamHung ?? 0) + (data?.user.postScore ?? 0) + (data?.user.referredScore ?? 0)) / 5,
    ) || 0;

  return {
    data,
    loading,
    tab,
    setTab,
    handleLike,
    handleComment,
    handleDeleteComment,
    handleDeletePost,
    totalCompetency,
    memberDays,
    profileUrl,
    qrUrl,
    id,
    user,
  };
}
