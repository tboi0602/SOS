"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  List,
  Link as LinkIcon,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useVideoSubmissions } from "@/hook/submission/useVideoSubmissions";
import ContentListLayout from "@/components/ui/ContentListLayout";
import { statusFilters } from "@/components/ui/StatusFilterBar";

const FILTERS = statusFilters(List);

function StatusBadge({ status }: { status: string }) {
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-medium text-yellow-400">
        <Clock size={9} /> Chờ duyệt
      </span>
    );
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-[10px] font-medium text-green-400">
        <CheckCircle size={9} /> Đã duyệt
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-[10px] font-medium text-red-400">
        <XCircle size={9} /> Từ chối
      </span>
    );
  return null;
}

function truncateUrl(url: string, max = 50) {
  return url.length > max ? url.slice(0, max) + "..." : url;
}

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
    totalPoints,
    filter,
    handleFilterChange,
    dateFrom,
    handleDateFromChange,
    dateTo,
    handleDateToChange,
    counts,
  } = useVideoSubmissions();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (penalty?.penalized) {
      toast(
        "Bạn đã bị trừ 1 điểm! Đã " +
          penalty.daysOverdue +
          " ngày bạn không gửi tác phẩm.",
        "error",
      );
    }
  }, [penalty?.penalized]);

  return (
    <ContentListLayout
      header={{
        title: "Tác phẩm",
        subtitle: "Gửi video bài dự thi của bạn",
        icon: Video,
        createLabel: "Gửi bài",
        onCreate: () => setShowForm(true),
      }}
      stats={[
        {
          label: "Đã duyệt",
          value: submissions.filter((s) => s.status === "approved").length,
          icon: CheckCircle,
          iconBg: "bg-blue-400/10",
          iconColor: "text-blue-400",
        },
        {
          label: "Điểm",
          value: totalPoints,
          icon: Sparkles,
          iconBg: "bg-blue-400/10",
          iconColor: "text-blue-400",
          valueColor: "text-blue-400",
        },
      ]}
      filters={FILTERS}
      activeFilter={filter}
      onFilterChange={handleFilterChange}
      counts={counts}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onFromChange={handleDateFromChange}
      onToChange={handleDateToChange}
      skeletonName="submissions-list"
      items={submissions}
      loading={loading}
      createForm={
        showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c1e3a]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/10 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Video size={16} className="text-primary" /> Gửi tác phẩm mới
                </h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
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
                  className="w-full py-3 min-h-11 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {creating ? "Đang gửi..." : "Gửi tác phẩm"}
                </button>
              </form>
            </div>
          </div>
        )
      }
      renderEmptyState={() => (
        <div className="bg-white/1 rounded-2xl py-14 px-6 text-center border border-white/6 transition-none">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Video size={26} className="text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-400 font-medium mb-1">
            Chưa có tác phẩm nào
          </p>
          <p className="text-xs text-zinc-600 mb-5">
            Hãy gửi tác phẩm đầu tiên để nhận điểm
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Plus size={16} /> Gửi tác phẩm
          </button>
        </div>
      )}
    >
      <div className="space-y-3">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="glass-strong rounded-2xl p-4 border border-white/6 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {sub.title}
                  </h3>
                  <StatusBadge status={sub.status} />
                </div>
                {sub.videoUrl && (
                  <a
                    href={sub.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-light mt-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg px-2 py-1 -ml-2"
                  >
                    <LinkIcon size={10} /> {truncateUrl(sub.videoUrl)}
                  </a>
                )}
                {sub.note && (
                  <p className="text-xs text-zinc-400 mt-1.5">{sub.note}</p>
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
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold text-amber-400">
                      +{sub.points}
                    </span>
                  )}
                </div>
                {sub.adminNote && (
                  <div className="mt-2 p-2.5 rounded-lg bg-red-400/5 border border-red-400/10">
                    <p className="text-[10px] text-red-400/70 italic">
                      Phản hồi: {sub.adminNote}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(sub.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer shrink-0 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-400/50 outline-none"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ContentListLayout>
  );
}
