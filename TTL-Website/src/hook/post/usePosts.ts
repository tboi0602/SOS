"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { postService } from "@/service/post.service";
import type { Post, PostListResponse, Comment } from "@/service/api";
import { useDebounce } from "@/hook/common";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [searchQ, setSearchQ] = useState("");
  const debouncedSearch = useDebounce(searchQ, 500);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res: PostListResponse = await postService.list(p);
      setPosts(res.posts);
      setTotalPages(res.totalPages);
      setPage(res.page);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      fetchPosts(1);
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetchPosts]);

  const createPost = async (data: {
    content: string;
    images?: string[];
    videos?: string[];
    productLink?: string | null;
    hashtags?: string[];
  }) => {
    const res = await postService.create(data);
    setPosts((prev) => [res.post, ...prev]);
  };

  const deletePost = async (id: string) => {
    await postService.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleLike = async (id: string) => {
    const prev = posts.find((p) => p.id === id);
    if (!prev) return;
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p,
      ),
    );
    try {
      await postService.toggleLike(id);
    } catch {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === id
            ? { ...p, liked: prev.liked, likeCount: prev.likeCount }
            : p,
        ),
      );
    }
  };

  const addComment = async (postId: string, content: string) => {
    const res = await postService.addComment(postId, content);
    const newComment: Comment = { ...res.comment, isOwner: true };
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [...p.comments, newComment],
              commentCount: p.commentCount + 1,
            }
          : p,
      ),
    );
  };

  const deleteComment = async (postId: string, commentId: string) => {
    await postService.deleteComment(postId, commentId);
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => c.id !== commentId),
              commentCount: p.commentCount - 1,
            }
          : p,
      ),
    );
  };

  const updatePost = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    );
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) fetchPosts(p);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (debouncedSearch.trim().length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      setSearching(true);
      postService
        .search(debouncedSearch.trim())
        .then((data) => {
          setSearchResults(data.posts);
          setShowResults(true);
        })
        .catch(() => console.error("Search failed"))
        .finally(() => setSearching(false));
    }, 0);
    return () => window.clearTimeout(id);
  }, [debouncedSearch]);

  const handleSearch = (q: string) => {
    setSearchQ(q);
  };

  return {
    posts,
    loading,
    page,
    totalPages,
    fetchPosts,
    createPost,
    deletePost,
    updatePost,
    toggleLike,
    addComment,
    deleteComment,
    goToPage,
    handleSearch,
    searchRef,
    searchQ,
    searchResults,
    searching,
    showResults,
    setShowResults,
    editingPost,
    setEditingPost,
    setSearchQ,
  };
}
