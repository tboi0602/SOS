/* eslint-disable @next/next/no-img-element */
"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function ImageViewer({ images, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1))
      if (e.key === "ArrowRight") setIndex((i) => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [images.length, onClose])

  if (images.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[color-mix(in srgb, var(--text-primary) 80%, transparent)] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh"
    >
      <button
        onClick={onClose}
        aria-label="Đóng"
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[color-mix(in srgb, var(--text-primary) 50%, transparent)] text-[var(--text-primary)] hover:bg-[color-mix(in srgb, var(--text-primary) 20%, transparent)] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in srgb, var(--text-primary) 50%, transparent)]"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex((i) => Math.max(0, i - 1)) }}
            disabled={index === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[color-mix(in srgb, var(--text-primary) 50%, transparent)] text-[var(--text-primary)] hover:bg-[color-mix(in srgb, var(--text-primary) 20%, transparent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in srgb, var(--text-primary) 50%, transparent)] z-10"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex((i) => Math.min(images.length - 1, i + 1)) }}
            disabled={index === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[color-mix(in srgb, var(--text-primary) 50%, transparent)] text-[var(--text-primary)] hover:bg-[color-mix(in srgb, var(--text-primary) 20%, transparent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in srgb, var(--text-primary) 50%, transparent)] z-10"
            aria-label="Ảnh sau"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                className={`size-2 rounded-full transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in srgb, var(--text-primary) 50%, transparent)] ${
                  i === index ? "bg-[var(--text-primary)] w-4" : "bg-[color-mix(in srgb, var(--text-primary) 40%, transparent)] hover:bg-[color-mix(in srgb, var(--text-primary) 60%, transparent)]"
                }`}
                aria-label={`Ảnh ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt=""
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>

      {images.length > 1 && (
        <p className="absolute bottom-14 left-1/2 -translate-x-1/2 text-xs text-[color-mix(in srgb, var(--text-primary) 60%, transparent)] z-10">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  )
}
