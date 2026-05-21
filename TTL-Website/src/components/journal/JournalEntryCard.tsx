/* eslint-disable @next/next/no-img-element */
"use client";

import { Sparkles, Trash2, Clock, XCircle } from "lucide-react";
import type { JournalEntry } from "@/service/api";

interface JournalEntryCardProps {
  entry: JournalEntry;
  getImgUrl: (url: string) => string;
  onDelete: (id: string) => void;
}

export default function JournalEntryCard({
  entry,
  getImgUrl,
  onDelete,
}: JournalEntryCardProps) {
  const statusBadge = () => {
    if (entry.status === "pending")
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[11px] font-medium text-yellow-400">
          <Clock size={10} /> Chờ duyệt
        </span>
      )
    if (entry.status === "rejected")
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-[11px] font-medium text-red-400">
          <XCircle size={10} /> Từ chối
        </span>
      )
    return null
  }

  return (
    <div className="glass-strong rounded-2xl overflow-hidden border border-white/6 group">
      {entry.images && entry.images.length > 0 && (
        <div
          className={`grid ${entry.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-px`}
        >
          {entry.images.slice(0, 2).map((url, i) => (
            <div key={i} className="aspect-video overflow-hidden relative">
              <img
                src={getImgUrl(url)}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-xl bg-linear-to-br from-amber-400/20 to-orange-500/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">
                    {entry.title}
                  </h3>
                  {statusBadge()}
                </div>
                <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">
                  {entry.content}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] font-bold text-amber-400">
                  +{entry.points}
                </span>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-white/5 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">
              {new Date(entry.createdAt).toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </p>
            {entry.adminNote && (
              <p className="text-[10px] text-red-400/70 mt-1 italic">
                Phản hồi: {entry.adminNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
