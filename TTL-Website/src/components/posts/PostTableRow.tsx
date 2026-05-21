"use client"

import Image from "next/image"
import { Pencil, Trash2, ThumbsUp, MessageCircle, ImageIcon, Calendar, FileText } from "lucide-react"
import type { Post } from "@/service/api"

interface PostTableRowProps {
  post: Post
  resolveUrl: (url: string) => string
  onEdit: () => void
  onDelete: () => void
}

export default function PostTableRow({ post, resolveUrl, onEdit, onDelete }: PostTableRowProps) {
  return (
    <div className="group flex flex-col sm:grid sm:grid-cols-[1fr_100px_100px_100px] gap-3 sm:gap-4 sm:items-center px-5 py-4 hover:bg-white/2 transition-colors">
      {/* Post info */}
      <div className="flex items-start gap-3 min-w-0">
        {post.images.length > 0 ? (
          <Image
            src={resolveUrl(post.images[0])}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-lg object-cover border border-white/8 shrink-0"
          />
        ) : (
          <div className="size-12 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-zinc-600" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white font-medium line-clamp-2 leading-snug">
            {post.content}
          </p>
          {post.images.length > 0 && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-zinc-500">
              <ImageIcon size={10} />
              {post.images.length} ảnh
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0.5 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <ThumbsUp size={11} className="text-cyan/60" />
          {post.likeCount}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={11} className="text-primary/60" />
          {post.commentCount}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1 text-xs text-zinc-500 sm:justify-center">
        <Calendar size={11} className="shrink-0" />
        <span>
          {new Date(post.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:justify-center">
        <button
          onClick={onEdit}
          className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-cyan hover:bg-cyan/10 transition-all"
          title="Sửa bài viết"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all"
          title="Xoá bài viết"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
