"use client"

import { useRef, useState } from "react"
import { Upload, X, Image, Film, FileText } from "lucide-react"

interface MediaUploaderProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
}

export default function MediaUploader({ onUpload, maxFiles = 5 }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList) => {
    const valid = Array.from(files).slice(0, maxFiles - previews.length)
    const urls = valid.map((f) => URL.createObjectURL(f))
    setPreviews((prev) => [...prev, ...urls].slice(0, maxFiles))
    onUpload(valid)
  }

  const remove = (i: number) => {
    URL.revokeObjectURL(previews[i])
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div
      className="relative rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer"
      style={{
        background: isDragging ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : "var(--surface-elevated)",
        border: `1.5px dashed ${isDragging ? "var(--color-accent)" : "var(--border-base)"}`,
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) }}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />

      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-2 justify-center">
          {previews.map((url, i) => (
            <div key={i} className="relative size-20 rounded-xl overflow-hidden" style={{ boxShadow: "inset 0 0 0 0.5px var(--glass-border)" }}>
              <img src={url} alt="" className="size-full object-cover" />
              <button onClick={(e) => { e.stopPropagation(); remove(i) }} className="absolute top-1 right-1 size-5 rounded-full bg-black/50 flex items-center justify-center cursor-pointer">
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}>
            <Upload size={20} className="text-accent" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
            Kéo thả hoặc nhấp để tải lên
          </p>
          <div className="flex gap-3 text-xs" style={{ color: "var(--text-dim)" }}>
            <span className="flex items-center gap-1"><Image size={12} /> Hình ảnh</span>
            <span className="flex items-center gap-1"><Film size={12} /> Video</span>
            <span className="flex items-center gap-1"><FileText size={12} /> Tài liệu</span>
          </div>
        </div>
      )}
    </div>
  )
}
