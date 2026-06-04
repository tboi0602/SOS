import { useState, useEffect, useCallback, useRef } from "react";
import { postService } from "@/service/post.service";
import { uploadFiles } from "@/service/client";
import type { Post } from "@/types/post";

export function useAdminPostManage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [content, setContent] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = useCallback(() => {
    const id = setTimeout(() => {
      setLoading(true);
      postService.myPosts({ page, limit })
        .then((res) => {
          setPosts(res.posts);
          setTotal(res.total);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 0);
    return id;
  }, [page]);

  useEffect(() => {
    const id = fetch();
    return () => clearTimeout(id);
  }, [fetch]);

  const resetForm = () => {
    setContent("");
    setHashtags([]);
    setHashtagInput("");
    setMediaFiles([]);
    setMediaPreviews([]);
    setEditId(null);
  };

  const openEdit = (post: Post) => {
    setContent(post.content);
    setHashtags(post.hashtags as string[] || []);
    setMediaPreviews(post.images as string[] || []);
    setEditId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setMediaFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const url = URL.createObjectURL(f);
      setMediaPreviews((prev) => [...prev, url]);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, "");
    if (tag && !hashtags.includes(tag)) {
      setHashtags((prev) => [...prev, tag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      let images: string[] | undefined;
      if (mediaFiles.length > 0) {
        const res = await uploadFiles<{ urls: string[] }>("/api/v1/posts/upload", mediaFiles, "files");
        images = res.urls;
      } else if (mediaPreviews.length > 0) {
        images = mediaPreviews;
      }

      const data = {
        content: content.trim(),
        images,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      };

      if (editId) {
        await postService.update(editId, data);
      } else {
        await postService.create(data);
      }
      resetForm();
      setPage(1);
      fetch();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await postService.delete(deleteId);
      setDeleteId(null);
      fetch();
    } catch {}
  };

  return {
    posts,
    loading,
    page,
    total,
    totalPages: Math.ceil(total / limit),
    setPage,
    fetch,
    content,
    setContent,
    hashtagInput,
    setHashtagInput,
    hashtags,
    addHashtag,
    removeHashtag,
    mediaPreviews,
    removeMedia,
    fileRef,
    handleFiles,
    submitting,
    editId,
    deleteId,
    setDeleteId,
    openEdit,
    resetForm,
    handleSubmit,
    handleDelete,
  };
}
