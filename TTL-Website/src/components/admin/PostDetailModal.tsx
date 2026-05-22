/* eslint-disable @next/next/no-img-element */
"use client"

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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[11px] font-medium text-yellow-400">
          <Clock size={10} /> Chờ duyệt
        </span>
      )
    if (status === "approved")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-[11px] font-medium text-green-400">
          <CheckCircle size={10} /> Đã duyệt
        </span>
      )
    if (status === "rejected")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-[11px] font-medium text-red-400">
          <XCircle size={10} /> Từ chối
        </span>
      )
    return null
  }

  const images = (post.images as string[]) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Chi tiết bài viết">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c1e3a] border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#0c1e3a]/95 backdrop-blur-xl rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-white/10 overflow-hidden shrink-0">
              {post.user.avatar ? (
                <img src={post.user.avatar} alt="" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center text-xs font-bold text-zinc-500">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.user.name}</p>
              <p className="text-[10px] text-zinc-500">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(post.status)}
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-white whitespace-pre-line leading-relaxed">{post.content}</p>

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
                  className={`block rounded-xl overflow-hidden border border-white/6 group cursor-pointer ${
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
              className="flex items-center gap-2 p-3 rounded-xl bg-cyan/5 border border-cyan/10 text-cyan text-xs font-medium hover:bg-cyan/10 transition-all"
            >
              <ExternalLink size={12} /> Link sản phẩm
            </a>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-white/8">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Heart size={12} /> {post.likeCount} lượt thích
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <MessageSquare size={12} /> {post.commentCount} bình luận
            </span>
          </div>

          {post.adminNote && (
            <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
              <p className="text-[10px] text-red-400/70 font-semibold mb-1">Phản hồi từ admin:</p>
              <p className="text-xs text-red-400/90 italic">{post.adminNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
