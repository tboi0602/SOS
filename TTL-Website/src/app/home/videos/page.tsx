/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  Video,
  Plus,
  X,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link as LinkIcon,
  MessageSquare,
} from "lucide-react";
import { useVideoSubmissions } from "@/hook/submission/useVideoSubmissions";

export default function TacPhamPage() {
  const {
    submissions,
    loading,
    title,
    setTitle,
    videoUrl,
    setVideoUrl,
    note,
    setNote,
    creating,
    handleCreate,
    handleDelete,
    penalty,
    approvedCount,
    totalPoints,
  } = useVideoSubmissions();

  const [showForm, setShowForm] = useState(false);

  const statusBadge = (status: string) => {
    if (status === "pending")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[11px] font-medium text-yellow-400">
          <Clock size={10} /> Chờ duyệt
        </span>
      );
    if (status === "approved")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-[11px] font-medium text-green-400">
          <CheckCircle size={10} /> Đã duyệt
        </span>
      );
    if (status === "rejected")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-[11px] font-medium text-red-400">
          <XCircle size={10} /> Từ chối
        </span>
      );
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Video size={20} className="text-primary" /> Tác phẩm
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Gửi video bài dự thi của bạn
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 cursor-pointer"
        >
          <Plus size={16} /> {showForm ? "Đóng" : "Gửi bài"}
        </button>
      </div>

      {/* Penalty Warning */}
      {penalty?.penalized && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-400/5 border border-red-400/20">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              Bạn đã bị trừ 1 điểm!
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Đã {penalty.daysOverdue} ngày bạn không gửi tác phẩm. Hãy gửi bài
              mới để tránh bị trừ thêm điểm.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-strong rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{approvedCount}</p>
          <p className="text-xs text-zinc-500 mt-1">Đã duyệt</p>
        </div>
        <div className="glass-strong rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{totalPoints}</p>
          <p className="text-xs text-zinc-500 mt-1">Điểm</p>
        </div>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="glass-strong rounded-2xl p-5 border border-white/6">
          <h2 className="text-sm font-semibold text-white mb-4">
            Gửi tác phẩm mới
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate(e);
              setShowForm(false);
            }}
            className="space-y-3"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề tác phẩm..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
            />
            <div className="relative">
              <LinkIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Link video (YouTube, TikTok...)"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
              />
            </div>
            <div className="relative">
              <MessageSquare
                size={14}
                className="absolute left-3 top-3 text-zinc-500"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú thêm (tuỳ chọn)..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors resize-none"
              />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
              <Clock size={14} className="text-amber-400 shrink-0" />
              <p className="text-xs text-zinc-400">
                Tác phẩm sẽ được{" "}
                <span className="text-amber-400 font-semibold">
                  quản trị viên duyệt
                </span>{" "}
                trước khi cộng{" "}
                <span className="text-amber-400 font-semibold">
                  +1 điểm Truyền cảm hứng
                </span>
              </p>
            </div>
            <button
              type="submit"
              disabled={!title.trim() || creating}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {creating ? "Đang gửi..." : "Gửi tác phẩm"}
            </button>
          </form>
        </div>
      )}

      {/* Submission List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Video size={14} className="text-primary" /> Bài đã gửi (
          {submissions.length})
        </h2>

        {loading ? (
          <div className="glass-strong rounded-2xl p-8 text-center">
            <p className="text-xs text-zinc-500">Đang tải...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="glass-strong rounded-2xl p-8 text-center">
            <Video size={24} className="text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">
              Chưa có tác phẩm nào. Hãy gửi bài đầu tiên!
            </p>
          </div>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub.id}
              className="glass-strong rounded-2xl p-4 border border-white/6 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {sub.title}
                    </h3>
                    {statusBadge(sub.status)}
                  </div>
                  {sub.videoUrl && (
                    <a
                      href={sub.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-light mt-1"
                    >
                      <LinkIcon size={10} /> {sub.videoUrl}
                    </a>
                  )}
                  {sub.note && (
                    <p className="text-xs text-zinc-400 mt-1">{sub.note}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-zinc-600">
                      {new Date(sub.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {sub.points > 0 && (
                      <span className="text-[10px] font-bold text-amber-400">
                        +{sub.points}
                      </span>
                    )}
                  </div>
                  {sub.adminNote && (
                    <p className="text-[10px] text-red-400/70 mt-1 italic">
                      Phản hồi: {sub.adminNote}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-white/5 transition-all cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
