"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, ImagePlus, Loader2, Trash2 } from "lucide-react"
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c1e3a]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/10 animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#0c1e3a]/95 backdrop-blur-xl rounded-t-2xl">
          <h2 className="text-base font-bold text-white">Chỉnh sửa bài viết</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Nội dung
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/40 transition-colors"
              placeholder="Nội dung bài viết..."
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Ảnh hiện tại ({existingImages.length})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-white/8">
                    <Image
                      src={resolveUrl(url)}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="size-7 rounded-full bg-danger/80 text-white flex items-center justify-center hover:bg-danger transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New uploads */}
          {newMedia.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Ảnh mới ({newMedia.length})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {newMedia.map((m, i) => (
                  <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-cyan/20">
                    <Image
                      src={m.preview}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="size-7 rounded-full bg-danger/80 text-white flex items-center justify-center hover:bg-danger transition-all"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-cyan/20 text-cyan rounded text-[9px] font-medium">
                      Mới
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add images button */}
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium hover:bg-cyan/20 transition-all w-full justify-center"
            >
              <ImagePlus size={16} />
              Thêm ảnh / video
            </button>
          </div>

          {/* Product Link */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Link sản phẩm
            </label>
            <input
              type="text"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-white/8 bg-[#0c1e3a]/95 backdrop-blur-xl rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/8 transition-all"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim() || saving}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 text-white text-sm font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-primary/25"
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
