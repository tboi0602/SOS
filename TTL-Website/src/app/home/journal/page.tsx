"use client";

import { Plus, Sparkles, BookOpen } from "lucide-react";
import { useJournal } from "@/hook/journal";
import JournalCreateModal from "@/components/journal/JournalCreateModal";
import JournalEntryCard from "@/components/journal/JournalEntryCard";
import ContentListLayout from "@/components/ui/ContentListLayout";
import { statusFilters } from "@/components/ui/StatusFilterBar";

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
    filter,
    handleFilterChange,
    dateFrom,
    handleDateFromChange,
    dateTo,
    handleDateToChange,
    counts,
  } = useJournal();

  return (
    <ContentListLayout
      header={{
        title: "Nhật ký",
        subtitle: "Ghi lại hành trình của bạn",
        icon: BookOpen,
        iconClass: "bg-emerald-400/15",
        createLabel: "Viết nhật ký",
        onCreate: () => setShowCreate(true),
        createBtnClass:
          "bg-emerald-400 hover:bg-emerald-500 text-[#071224] shadow-emerald-400/25",
      }}
      stats={[
        {
          label: "Tổng nhật ký",
          value: entries.length,
          icon: BookOpen,
          iconBg: "bg-emerald-400/10",
          iconColor: "text-emerald-400",
        },
        {
          label: "Điểm",
          value: totalPoints,
          icon: Sparkles,
          iconBg: "bg-emerald-400/10",
          iconColor: "text-emerald-400",
          valueColor: "text-emerald-400",
        },
      ]}
      filters={statusFilters(BookOpen)}
      activeFilter={filter}
      onFilterChange={handleFilterChange}
      counts={counts}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onFromChange={handleDateFromChange}
      onToChange={handleDateToChange}
      skeletonName="journal-page"
      items={entries}
      loading={loading}
      createForm={
        showCreate && (
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
        )
      }
      renderEmptyState={() => (
        <div className="bg-white/1 rounded-2xl py-14 px-6 text-center border border-white/6 transition-none">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={26} className="text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-400 font-medium mb-1">
            Chưa có nhật ký nào
          </p>
          <p className="text-xs text-zinc-600 mb-5">
            Hãy viết nhật ký đầu tiên để nhận điểm
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-[#071224] text-sm font-semibold transition-all shadow-lg shadow-emerald-400/25 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            <Plus size={16} /> Viết nhật ký
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
        {entries.map((entry) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            getImgUrl={getImgUrl}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </ContentListLayout>
  );
}
