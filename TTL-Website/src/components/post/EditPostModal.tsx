"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, ImagePlus, Loader2, Trash2, Hash, Link2 } from "lucide-react"
import type { Post } from "@/service/api"
import { postService } from "@/service/post.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface EditPostModalProps {
  post: Post
  onClose: () => void
  onUpdated: (post: Post) => void
}

interface NewMedia {
  file: File
  preview: string
}

export default function EditPostModal({ post, onClose, onUpdated }: EditPostModalProps) {
  const [content, setContent] = useState(post.content)
  const [existingImages, setExistingImages] = useState<string[]>(post.images)
  const [newMedia, setNewMedia] = useState<NewMedia[]>([])
  const [productLink, setProductLink] = useState(post.productLink || "")
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags || [])
  const [hashtagInput, setHashtagInput] = useState("")
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return
      const preview = URL.createObjectURL(file)
      setNewMedia((prev) => [...prev, { file, preview }])
    })
  }

  const removeExisting = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNew = (index: number) => {
    setNewMedia((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, "")
    if (tag && !hashtags.includes(tag)) {
      setHashtags((prev) => [...prev, tag])
      setHashtagInput("")
    }
  }

  const handleHashtagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      addHashtag()
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      let uploadedUrls: string[] = []
      if (newMedia.length > 0) {
        const res = await postService.uploadMedia(newMedia.map((m) => m.file))
        uploadedUrls = res.urls
      }

      const allImages = [...existingImages, ...uploadedUrls]

      const res = await postService.update(post.id, {
        content: content.trim(),
        images: allImages,
        productLink: productLink.trim() || null,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      })
      onUpdated(res.post)
      onClose()
    } catch {
      // handled by api interceptor
    } finally {
      setSaving(false)
    }
  }

  const resolveUrl = (url: string) =>
    url.startsWith("http") || url.startsWith("blob:") ? url : `${API_URL}${url}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-base)] shadow-2xl shadow-primary/10 animate-[slideUp_0.3s_ease-out]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border-base)] bg-[var(--surface-elevated)]/95 backdrop-blur-xl rounded-t-2xl">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Chỉnh sửa bài viết</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
              Nội dung
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full resize-none bg-[var(--surface-strong)] border border-[var(--border-base)] rounded-xl px-4 py-3 pr-16 text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none focus:border-primary/40 transition-colors"
                placeholder="Nội dung bài viết..."
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-[var(--text-tertiary)] font-mono">
                {content.length}/5000
              </span>
            </div>
          </div>

          {existingImages.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Ảnh hiện tại ({existingImages.length})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--border-base)] cursor-pointer">
                    <Image src={resolveUrl(url)} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="size-7 rounded-full bg-danger/80 text-white flex items-center justify-center hover:bg-danger transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newMedia.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Ảnh mới ({newMedia.length})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {newMedia.map((m, i) => (
                  <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-accent/20 cursor-pointer">
                    <Image src={m.preview} alt="" fill unoptimized className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="size-7 rounded-full bg-danger/80 text-white flex items-center justify-center hover:bg-danger transition-all cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-accent/20 text-accent rounded text-[9px] font-medium">
                      Mới
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => { handleFiles(e.target.files); e.target.value = "" }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition-all w-full justify-center cursor-pointer"
            >
              <ImagePlus size={16} />
              Thêm ảnh / video
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Link2 size={12} /> Link sản phẩm
            </label>
            <input
              type="text"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[var(--surface-strong)] border border-[var(--border-base)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Hash size={12} /> Hashtag
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKey}
                onBlur={addHashtag}
                placeholder="Nhập hashtag, nhấn Space/Enter"
                className="flex-1 bg-[var(--surface-strong)] border border-[var(--border-base)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none focus:border-primary/30 transition-colors"
              />
            </div>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setHashtags((prev) => prev.filter((t) => t !== tag))}
                      className="hover:text-primary-light transition-colors cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-base)] bg-[var(--surface-elevated)]/95 backdrop-blur-xl rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-sm text-[var(--text-secondary)] bg-[var(--surface-strong)] border border-[var(--border-base)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim() || saving}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-primary)] text-sm font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-primary/25 cursor-pointer"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
