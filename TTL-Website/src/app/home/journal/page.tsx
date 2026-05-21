"use client";

import { BookOpen, Plus } from "lucide-react";
import { useJournal } from "@/hook/journal";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalStats from "@/components/journal/JournalStats";
import JournalCreateModal from "@/components/journal/JournalCreateModal";
import JournalEntryCard from "@/components/journal/JournalEntryCard";
import Loading from "@/components/ui/Loading";

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

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-6 text-white select-none">
      <div className="max-w-3xl mx-auto space-y-6">
        <JournalHeader onOpenCreate={() => setShowCreate(true)} />

        <JournalStats count={entries.length} totalPoints={totalPoints} />

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
          <Loading />
        ) : entries.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center border border-white/6">
            <div className="size-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-sm mb-3">Chưa có nhật ký nào</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold transition-all hover:bg-primary-light shadow-lg shadow-primary/25 cursor-pointer"
            >
              <Plus size={15} /> Viết nhật ký đầu tiên
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
