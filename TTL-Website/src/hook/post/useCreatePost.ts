"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { postService } from "@/service/post.service";

export interface MediaFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

export function useCreatePost() {
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [productLink, setProductLink] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) return;

      const preview = URL.createObjectURL(file);
      setMediaFiles((prev) => [
        ...prev,
        {
          file,
          preview,
          type: isImage ? "image" : "video",
        },
      ]);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return newFiles;
    });
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, "");
    if (tag && !hashtags.includes(tag)) {
      setHashtags((prev) => [...prev, tag]);
      setHashtagInput("");
    }
  };

  const handleHashtagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addHashtag();
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    const res = await postService.uploadMedia(files);
    return res.urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const uploadedUrls = await uploadFiles(mediaFiles.map((m) => m.file));

      const images = mediaFiles
        .filter((m) => m.type === "image")
        .map((m, i) => uploadedUrls[mediaFiles.indexOf(m)] || m.preview);
      const videos = mediaFiles
        .filter((m) => m.type === "video")
        .map((m, i) => uploadedUrls[mediaFiles.indexOf(m)] || m.preview);

      await postService.create({
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        videos: videos.length > 0 ? videos : undefined,
        productLink: productLink.trim() || null,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      });
      router.push("/home");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // handled by api interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    content,
    setContent,
    mediaFiles,
    productLink,
    setProductLink,
    hashtagInput,
    setHashtagInput,
    hashtags,
    removeHashtag,
    submitting,
    dragActive,
    textareaRef,
    imageInputRef,
    videoInputRef,
    handleFiles,
    handleDrag,
    handleDrop,
    removeMedia,
    addHashtag,
    handleHashtagKey,
    handleSubmit,
  };
}
