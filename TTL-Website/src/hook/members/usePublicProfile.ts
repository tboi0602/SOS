"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api, type PublicProfileResponse } from "@/service/api";
import { useAuth } from "@/lib/auth-context";

export function usePublicProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [data, setData] = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mountedAt] = useState(() => Date.now());
  const [tab, setTab] = useState<"profile" | "posts">("profile");

  useEffect(() => {
    api.profile
      .getPublicProfile(id)
      .then(setData)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async (postId: string) => {
    try {
      const res = await api.posts.toggleLike(postId);
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
    try {
      const res = await api.posts.addComment(postId, content);
      setData((prev) =>
        prev
          ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? {
                  ...p,
                  comments: [
                    ...p.comments,
                    {
                      ...res.comment,
                      isOwner: true,
                      user: {
                        id: user?.id ?? "",
                        name: user?.name ?? "",
                        email: user?.email ?? "",
                        avatar: user?.avatar ?? null,
                      },
                    },
                  ],
                  commentCount: p.commentCount + 1,
                }
                : p,
            ),
          }
          : null,
      );
    } catch { }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await api.posts.deleteComment(postId, commentId);
      setData((prev) =>
        prev
          ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? {
                  ...p,
                  comments: p.comments.filter(
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

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/members/${id}`
      : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&color=001425&bgcolor=00c3ff`;

  const memberDays = data?.user?.createdAt
    ? Math.floor((mountedAt - new Date(data.user.createdAt).getTime()) / 86400000)
    : 0;

  const totalCompetency =
    Math.round(
      ((data?.user.kyLuat ?? 0) + (data?.user.daoDuc ?? 0) + (data?.user.truyenCamHung ?? 0)) / 3,
    ) || 0;

  return {
    data,
    loading,
    tab,
    setTab,
    handleLike,
    handleComment,
    handleDeleteComment,
    totalCompetency,
    memberDays,
    profileUrl,
    qrUrl,
    id,
    user,
  };
}
