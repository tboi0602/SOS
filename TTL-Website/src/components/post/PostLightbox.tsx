"use client";

import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PostLightboxProps {
  images: string[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  getImageUrl: (url: string) => string;
}

export default function PostLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  getImageUrl,
}: PostLightboxProps) {
  if (typeof window !== "object" || activeIndex === null) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
      style={{ background: "color-mix(in srgb, var(--surface-base) 80%, transparent)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10" style={{ color: "var(--text-primary)" }}>
        <span className="text-sm text-accent font-bold">
          Ảnh {activeIndex + 1} trên {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-colors cursor-pointer" style={{ color: "var(--text-primary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          aria-label="Đóng"
        >
          <X size={24} />
        </button>
      </div>
      <div
        className="relative w-full max-w-5xl h-full flex items-center justify-center px-4 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(images[activeIndex])}
          alt={`Ảnh bài viết ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 active:scale-95 rounded-full transition-all cursor-pointer z-10" style={{ border: "1px solid var(--border-base)", background: "var(--surface-elevated)", color: "var(--text-primary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 15%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-elevated)"; }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 active:scale-95 rounded-full transition-all cursor-pointer z-10" style={{ border: "1px solid var(--border-base)", background: "var(--surface-elevated)", color: "var(--text-primary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 15%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-elevated)"; }}
            aria-label="Ảnh tiếp"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
