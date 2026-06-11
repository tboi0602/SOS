import { useState, useEffect } from "react";
import { postService } from "@/service/post.service";
import type { Post, Comment } from "@/types/post";

export function useNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(true);
      postService.getNews()
        .then((res: any) => {
          setPosts(res.posts);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const toggleLike = async (id: string) => {
    const prev = posts.find((p) => p.id === id);
    if (!prev) return;
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p,
      ),
    );
    try {
      await postService.toggleLike(id);
    } catch {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === id ? { ...p, liked: prev.liked, likeCount: prev.likeCount } : p,
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
          ? { ...p, comments: [...p.comments, newComment], commentCount: p.commentCount + 1 }
          : p,
      ),
    );
  };

  const deleteComment = async (postId: string, commentId: string) => {
    await postService.deleteComment(postId, commentId);
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId), commentCount: p.commentCount - 1 }
          : p,
      ),
    );
  };

  const deletePost = async (id: string) => {
    await postService.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return { posts, loading, toggleLike, addComment, deleteComment, deletePost };
}
