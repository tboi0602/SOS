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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-medium text-yellow-400">
        <Clock size={9} /> Chờ duyệt
      </span>
    )
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-[10px] font-medium text-green-400">
        <CheckCircle size={9} /> Đã duyệt
      </span>
    )
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-[10px] font-medium text-red-400">
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

  const images = (entry.images as string[]) || []

  return (
    <div className="glass-strong rounded-2xl p-4 border border-white/6 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-xl bg-linear-to-br from-emerald-400/20 to-teal-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Sparkles size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-sm font-semibold text-white">{entry.title}</h3>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">
                {entry.content}
              </p>
              {images.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {images.slice(0, 4).map((url, i) => (
                    <button key={i} onClick={() => setViewIndex(i)}
                      className="size-14 rounded-lg overflow-hidden border border-white/6 shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors">
                      <img src={getImgUrl(url)} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                  {images.length > 4 && (
                    <button onClick={() => setViewIndex(4)}
                      className="size-14 rounded-lg overflow-hidden border border-white/6 bg-white/5 flex items-center justify-center shrink-0 text-[11px] text-zinc-500 font-medium cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors">
                      +{images.length - 4}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {entry.points > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] font-bold text-emerald-400">
                  +{entry.points}
                </span>
              )}
              <button
                onClick={() => onDelete(entry.id)}
                aria-label="Xoá nhật ký"
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-400/50 outline-none"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-[10px] text-zinc-600">
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
            <div className="mt-2 p-2.5 rounded-lg bg-red-400/5 border border-red-400/10">
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
