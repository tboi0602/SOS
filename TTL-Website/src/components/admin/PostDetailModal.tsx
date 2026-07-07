/* eslint-disable @next/next/no-img-element */
"use client"

import { getInitial } from "@/utils/cn";
import { X, Heart, MessageSquare, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import type { Post } from "@/service/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface Props {
  post: Post
  onClose: () => void
}

function resolveUrl(url: string) {
  return url.startsWith("http") ? url : `${API_URL}${url}`
}

export default function PostDetailModal({ post, onClose }: Props) {
  const statusBadge = (status: string) => {
    if (status === "pending")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border text-[11px] font-medium text-yellow-400" style={{ borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}>
          <Clock size={10} /> Chờ duyệt
        </span>
      )
    if (status === "approved")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border text-[11px] font-medium text-green-400" style={{ borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
          <CheckCircle size={10} /> Đã duyệt
        </span>
      )
    if (status === "rejected")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border text-[11px] font-medium text-red-400" style={{ borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)" }}>
          <XCircle size={10} /> Từ chối
        </span>
      )
    return null
  }

  const images = (post.images as string[]) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Chi tiết bài viết">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-base)] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[var(--border-base)] bg-[var(--surface-elevated)]/95 backdrop-blur-xl rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full overflow-hidden shrink-0" style={{ background: "color-mix(in srgb, var(--text-primary) 10%, transparent)" }}>
              {post.user.avatar ? (
                <img src={resolveUrl(post.user.avatar)} alt="" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>
                  {getInitial(post.user.name)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{post.user.name}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(post.status)}
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">{post.content}</p>

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : images.length === 3 ? "grid-cols-2" : "grid-cols-3"}`}>
              {images.map((url, i) => (
                <a
                  key={i}
                  href={resolveUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-xl overflow-hidden border border-[var(--border-base)] group cursor-pointer ${
                    images.length === 3 && i === 0 ? "row-span-2" : ""
                  } ${images.length === 3 && i > 0 ? "col-span-1" : ""}`}
                >
                  <div className="relative w-full aspect-square">
                    <img src={resolveUrl(url)} alt="" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <ExternalLink size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {post.productLink && (
            <a
              href={post.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10 text-accent text-xs font-medium hover:bg-accent/10 transition-all"
            >
              <ExternalLink size={12} /> Liên kết
            </a>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-[var(--border-base)]">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
              <Heart size={12} /> {post.likeCount} lượt thích
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
              <MessageSquare size={12} /> {post.commentCount} bình luận
            </span>
          </div>

          {post.adminNote && (
            <div className="p-3 rounded-xl bg-red-400/5 border" style={{ borderColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)" }}>
              <p className="text-[10px] text-red-400/70 font-semibold mb-1">Phản hồi từ admin:</p>
              <p className="text-xs text-red-400/90 italic">{post.adminNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



