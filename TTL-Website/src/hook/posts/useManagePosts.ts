"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { postService } from "@/service/post.service";
import type { Post } from "@/service/api";

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

  const [filter, setFilter] = useState("all");
  const [counts, setCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchMyPosts = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await postService.myPosts({
          page: p,
          limit: 10,
          status: filter,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        });
        setPosts(res.posts);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setTotal(res.total);
        if (res.counts) setCounts(res.counts);
      } catch {
        console.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    },
    [filter, dateFrom, dateTo],
  );

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/login");
      return;
    }
    const id = window.setTimeout(() => {
      void fetchMyPosts(1);
    }, 0);
    return () => window.clearTimeout(id);
  }, [user, fetchMyPosts]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (user) void fetchMyPosts();
    }, 0);
    return () => window.clearTimeout(id);
  }, [filter, dateFrom, dateTo]);

  const handleDelete = async () => {
    if (!deletePost) return;
    setDeleting(true);
    try {
      await postService.delete(deletePost.id);
      setPosts((prev) => prev.filter((p) => p.id !== deletePost.id));
      setTotal((prev) => prev - 1);
      setDeletePost(null);
    } catch {
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

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setPage(1);
  };

  const handleDateFromChange = (v: string) => {
    setDateFrom(v);
    setPage(1);
  };

  const handleDateToChange = (v: string) => {
    setDateTo(v);
    setPage(1);
  };

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
    filter,
    handleFilterChange,
    dateFrom,
    handleDateFromChange,
    dateTo,
    handleDateToChange,
    counts,
  };
}
