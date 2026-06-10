'use client'

import { useRef, useState } from "react"
import { Upload, Trash2 } from "lucide-react"
import { uploadFiles } from "@/service/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface LessonFormData {
  title: string
  content: string
  videoUrl: string
  images: string[]
}

interface LessonFormProps {
  initialData?: LessonFormData
  onSubmit: (data: LessonFormData) => Promise<void>
  submitLabel: string
  loading?: boolean
}

export default function LessonForm({ initialData, onSubmit, submitLabel, loading }: LessonFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? '')
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const res = await uploadFiles<{ urls: string[] }>('/api/v1/lessons/upload', Array.from(files))
      setImages((prev) => [...prev, ...res.urls])
    } catch {}
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    await onSubmit({ title, content, videoUrl, images })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề bài học"
        className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all"
        style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Mô tả"
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all resize-none"
        style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
      />
      <input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Link video (YouTube URL) — không bắt buộc"
        className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all"
        style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
      />

      <div>
        <p className="text-[11px] mb-2" style={{ color: "var(--text-tertiary)" }}>Hình ảnh — không bắt buộc</p>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.startsWith('http') ? img : `${API_URL}${img}`}
                alt=""
                className="size-20 rounded-xl object-cover border" style={{ borderColor: "var(--border-base)" }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="size-20 rounded-xl border-2 border-dashed flex items-center justify-center transition-all cursor-pointer"
            style={{ borderColor: "var(--border-base)", color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 40%, transparent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.borderColor = "var(--border-base)"; }}
          >
            {uploading ? (
              <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={18} />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !title}
          className="px-4 py-2 rounded-xl bg-primary text-[var(--text-primary)] text-sm font-semibold hover:bg-primary-light transition-all cursor-pointer disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
