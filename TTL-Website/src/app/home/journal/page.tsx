"use client";

import { Plus, Sparkles, BookOpen, Clock, ListChecks, ListX, XCircle } from "lucide-react";
import { useJournal } from "@/hook/journal";
import JournalCreateModal from "@/components/journal/JournalCreateModal";
import JournalEntryCard from "@/components/journal/JournalEntryCard";
import ContentListLayout from "@/components/ui/ContentListLayout";
import StatusFilterBar from "@/components/ui/StatusFilterBar";
const statusFilters = (Icon: any) => [
  { key: "", label: "Tất cả", icon: Icon },
  { key: "pending", label: "Chờ duyệt", icon: Icon },
  { key: "approved", label: "Đã duyệt", icon: Icon },
  { key: "rejected", label: "Từ chối", icon: XCircle },
];

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
    <>
    <ContentListLayout
      header={{
        title: "Đạo đức",
        subtitle: "Ghi lại hành trình của bạn",
        icon: BookOpen,
        iconClass: "bg-emerald-400/15",
        createLabel: "Viết đạo đức",
        onCreate: () => setShowCreate(true),
        createBtnClass:
          "bg-emerald-400 hover:bg-emerald-500 text-[var(--surface-base)] shadow-emerald-400/25",
      }}
      stats={[
        { label: "Tổng số", value: entries.length, icon: BookOpen, iconBg: "bg-emerald-400/10", iconColor: "text-emerald-400" },
        { label: "Điểm", value: totalPoints, icon: Sparkles, iconBg: "bg-amber-400/10", iconColor: "text-amber-400", valueColor: "text-amber-400" },
      ]}
      filters={statusFilters(BookOpen)}
      activeFilter={filter}
      onFilterChange={handleFilterChange}
      counts={counts}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onFromChange={handleDateFromChange}
      onToChange={handleDateToChange}
      skeletonName="journal-list"
      items={entries}
      loading={loading}
      renderEmptyState={() => (
        <div className="text-center py-16 rounded-2xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)" }}>
          <BookOpen size={32} className="mx-auto mb-3" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Chưa có nhật ký nào</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Hãy ghi lại những việc tốt của bạn mỗi ngày!</p>
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
    </>
  );
}
