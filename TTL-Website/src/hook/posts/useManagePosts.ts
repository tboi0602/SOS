"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { postService } from "@/service/post.service";
import type { Post, PostListResponse } from "@/service/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useManagePosts() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyPosts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res: PostListResponse = await postService.myPosts(p, 10);
      setPosts(res.posts);
      setTotalPages(res.totalPages);
      setPage(res.page);
      setTotal(res.total);
    } catch {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/login");
      return;
    }

    let active = true;
    const loadPosts = async () => {
      if (!active) return;
      await fetchMyPosts(1);
    };

    void loadPosts();

    return () => {
      active = false;
    };
  }, [user, router, fetchMyPosts]);

  const handleDelete = async () => {
    if (!deletePost) return;
    setDeleting(true);
    try {
      await postService.delete(deletePost.id);
      setPosts((prev) => prev.filter((p) => p.id !== deletePost.id));
      setTotal((prev) => prev - 1);
      setDeletePost(null);
    } catch {
      // handled by api interceptor
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdated = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    );
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) fetchMyPosts(p);
  };

  const resolveUrl = (url: string) =>
    url.startsWith("http") || url.startsWith("blob:")
      ? url
      : `${API_URL}${url}`;

  return {
    posts,
    loading,
    page,
    totalPages,
    total,
    editPost,
    setEditPost,
    deletePost,
    setDeletePost,
    deleting,
    handleDelete,
    handleUpdated,
    goToPage,
    resolveUrl,
  };
}
