/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react"
import { Sparkles, Trash2, Clock, XCircle, CheckCircle } from "lucide-react";
import type { JournalEntry } from "@/service/api";
import ImageViewer from "@/components/shared/ImageViewer";

interface JournalEntryCardProps {
  entry: JournalEntry;
  getImgUrl: (url: string) => string;
  onDelete: (id: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border text-[10px] font-medium text-yellow-400" style={{ borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}>
        <Clock size={9} /> Chờ duyệt
      </span>
    )
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border text-[10px] font-medium text-green-400" style={{ borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
        <CheckCircle size={9} /> Đã duyệt
      </span>
    )
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border text-[10px] font-medium text-red-400" style={{ borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)" }}>
        <XCircle size={9} /> Từ chối
      </span>
    )
  return null
}

export default function JournalEntryCard({
  entry,
  getImgUrl,
  onDelete,
}: JournalEntryCardProps) {
  const [viewIndex, setViewIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const images = (entry.images as string[]) || []

  return (
    <div className="glass-strong rounded-2xl p-4 border transition-all duration-300 group"
        style={{ borderColor: isHovered ? "color-mix(in srgb, var(--text-primary) 20%, transparent)" : "var(--border-base)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-xl bg-linear-to-br from-emerald-400/20 to-teal-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Sparkles size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{entry.title}</h3>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                {entry.content}
              </p>
              {images.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {images.slice(0, 4).map((url, i) => (
                    <button key={i} onClick={() => setViewIndex(i)}
                      className="size-14 rounded-lg overflow-hidden border shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors" style={{ borderColor: "var(--border-base)" }}>
                      <img src={getImgUrl(url)} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                  {images.length > 4 && (
                    <button onClick={() => setViewIndex(4)}
                      className="size-14 rounded-lg overflow-hidden border shrink-0 text-[11px] font-medium cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors flex items-center justify-center" style={{ borderColor: "var(--border-base)", background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-tertiary)" }}>
                      +{images.length - 4}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {entry.points > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 border text-[10px] font-bold text-emerald-400" style={{ borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
                  +{entry.points}
                </span>
              )}
              <button
                onClick={() => onDelete(entry.id)}
                aria-label="Xoá nhật ký"
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-400/50 outline-none" style={{ color: "var(--text-tertiary)" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
              {new Date(entry.createdAt).toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {entry.adminNote && (
            <div className="mt-2 p-2.5 rounded-lg bg-red-400/5 border" style={{ borderColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)" }}>
              <p className="text-[10px] text-red-400/70 italic">Phản hồi: {entry.adminNote}</p>
            </div>
          )}
        </div>
      </div>

      {viewIndex !== null && (
        <ImageViewer
          images={images.map((u) => getImgUrl(u))}
          initialIndex={viewIndex}
          onClose={() => setViewIndex(null)}
        />
      )}
    </div>
  );
}
