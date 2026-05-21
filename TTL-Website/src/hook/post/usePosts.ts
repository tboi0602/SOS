"use client"

import { useState, useEffect, useCallback } from "react"
import { postService } from "@/service/post.service"
import type { Post, PostListResponse } from "@/service/api"

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res: PostListResponse = await postService.list(p)
      setPosts(res.posts)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const createPost = async (data: { content: string; images?: string[]; videos?: string[]; productLink?: string | null; hashtags?: string[] }) => {
    const res = await postService.create(data)
    setPosts((prev) => [res.post, ...prev])
  }

  const deletePost = async (id: string) => {
    await postService.delete(id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleLike = async (id: string) => {
    const prev = posts.find((p) => p.id === id)
    if (!prev) return
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p,
      ),
    )
    try {
      await postService.toggleLike(id)
    } catch {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === id ? { ...p, liked: prev.liked, likeCount: prev.likeCount } : p,
        ),
      )
    }
  }

  const addComment = async (postId: string, content: string) => {
    const res = await postService.addComment(postId, content)
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
            ...p,
            comments: [...p.comments, { ...res.comment, isOwner: true }],
            commentCount: p.commentCount + 1,
          }
          : p,
      ),
    )
  }

  const deleteComment = async (postId: string, commentId: string) => {
    await postService.deleteComment(postId, commentId)
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
    )
  }

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) fetchPosts(p)
  }

  return {
    posts,
    loading,
    page,
    totalPages,
    fetchPosts,
    createPost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    goToPage,
  }
}
