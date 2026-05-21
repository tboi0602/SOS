"use client";

import { useState } from "react";
import { BookOpen, Plus, Clock, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { useJournal } from "@/hook/journal";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalStats from "@/components/journal/JournalStats";
import JournalCreateModal from "@/components/journal/JournalCreateModal";
import JournalEntryCard from "@/components/journal/JournalEntryCard";

const FILTERS = [
  { key: "all", label: "Tất cả", icon: BookOpen },
  { key: "pending", label: "Chờ duyệt", icon: Clock },
  { key: "approved", label: "Đã duyệt", icon: CheckCircle },
  { key: "rejected", label: "Từ chối", icon: XCircle },
] as const;

export default function JournalPage() {
  const {
    entries,
    loading,
    showCreate,
    setShowCreate,
    title,
    setTitle,
    content,
    setContent,
    previews,
    uploading,
    creating,
    fileRef,
    handleSelectFiles,
    removeImage,
    handleCreate,
    handleDelete,
    totalPoints,
    getImgUrl,
  } = useJournal();

  const [filter, setFilter] = useState<string>("all");

  const filteredEntries = filter === "all"
    ? entries
    : entries.filter((e) => e.status === filter);

  const counts = {
    all: entries.length,
    pending: entries.filter((e) => e.status === "pending").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-6 text-white select-none">
      <div className="max-w-3xl mx-auto space-y-6">
        <JournalHeader onOpenCreate={() => setShowCreate(true)} />

        <JournalStats count={entries.length} totalPoints={totalPoints} />

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <Icon size={14} />
                {f.label}
                <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  active ? "bg-primary/20" : "bg-white/10"
                }`}>
                  {counts[f.key as keyof typeof counts]}
                </span>
              </button>
            )
          })}
        </div>

        {showCreate && (
          <JournalCreateModal
            title={title}
            content={content}
            previews={previews}
            uploading={uploading}
            creating={creating}
            fileRef={fileRef}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSelectFiles={handleSelectFiles}
            onRemoveImage={removeImage}
            onSubmit={handleCreate}
            onClose={() => setShowCreate(false)}
          />
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-strong rounded-2xl overflow-hidden border border-white/6 animate-pulse">
                <div className="aspect-video bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                      <div className="h-3 bg-white/5 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center border border-white/6">
            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              {filter === "pending" ? (
                <Clock size={28} className="text-zinc-600" />
              ) : filter === "approved" ? (
                <CheckCircle size={28} className="text-zinc-600" />
              ) : filter === "rejected" ? (
                <XCircle size={28} className="text-zinc-600" />
              ) : (
                <Sparkles size={28} className="text-zinc-600" />
              )}
            </div>
            <p className="text-zinc-500 text-sm mb-1">
              {filter === "all"
                ? "Chưa có nhật ký nào"
                : filter === "pending"
                  ? "Không có nhật ký đang chờ"
                  : filter === "approved"
                    ? "Chưa có nhật ký được duyệt"
                    : "Không có nhật ký bị từ chối"}
            </p>
            <p className="text-xs text-zinc-600 mb-4">
              {filter === "all"
                ? "Hãy viết nhật ký đầu tiên để bắt đầu"
                : "Chuyển tab để xem tất cả nhật ký"}
            </p>
            <button
              onClick={() => { setShowCreate(true); setFilter("all") }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-primary/25 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
            >
              <Plus size={16} /> Viết nhật ký
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                getImgUrl={getImgUrl}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
