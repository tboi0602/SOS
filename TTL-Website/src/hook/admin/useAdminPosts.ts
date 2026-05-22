"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/service/admin.service";
import type { Post } from "@/service/api";

export type PostTab = "pending" | "approved" | "all";

export function useAdminPosts() {
  const { toast } = useToast();
  const [tab, setTab] = useState<PostTab>("pending");
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [viewImageIndex, setViewImageIndex] = useState<number | null>(null);
  const [viewImageUrls, setViewImageUrls] = useState<string[]>([]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (tab === "pending") {
        res = await adminService.listPendingPosts();
        setPosts(res.posts);
        setTotal(res.total);
      } else if (tab === "approved") {
        res = await adminService.listApprovedPosts();
        setPosts(res.posts);
        setTotal(res.total);
      } else {
        res = await adminService.listPosts();
        setPosts(res.posts);
        setTotal(res.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchPosts();
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetchPosts]);

  useEffect(() => {
    if (error) toast(error, "error");
  }, [error, toast]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approvePost(id, note || undefined);
      toast("Đã duyệt bài viết", "success");
      setActionId(null);
      setNote("");
      fetchPosts();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi duyệt bài viết", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectPost(id, note || undefined);
      toast("Đã từ chối bài viết", "success");
      setActionId(null);
      setNote("");
      fetchPosts();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi từ chối bài viết",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deletePost(deleteTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      toast("Đã xoá bài viết", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá bài viết", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const switchTab = (t: PostTab) => {
    setTab(t);
    setActionId(null);
  };

  const openImageViewer = (urls: string[], index: number) => {
    const getImgUrl = (url: string) =>
      url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${url}`;
    setViewImageUrls(urls.map(getImgUrl));
    setViewImageIndex(index);
  };

  const closeImageViewer = () => {
    setViewImageIndex(null);
    setViewImageUrls([]);
  };

  return {
    tab,
    posts,
    total,
    loading,
    error,
    note,
    actionId,
    deleteTarget,
    deleting,
    viewPost,
    viewImageIndex,
    viewImageUrls,
    setNote,
    setActionId,
    setViewPost,
    setDeleteTarget,
    switchTab,
    handleApprove,
    handleReject,
    handleDelete,
    openImageViewer,
    closeImageViewer,
  };
}
