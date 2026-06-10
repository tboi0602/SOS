/* eslint-disable @next/next/no-img-element */
"use client";

import { Clock, X, ImageUp } from "lucide-react";

interface JournalCreateModalProps {
  title: string;
  content: string;
  previews: string[];
  uploading: boolean;
  creating: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onSelectFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (i: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function JournalCreateModal({
  title,
  content,
  previews,
  uploading,
  creating,
  fileRef,
  onTitleChange,
  onContentChange,
  onSelectFiles,
  onRemoveImage,
  onSubmit,
  onClose,
}: JournalCreateModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Viết nhật ký mới"
    >
      <div
        className="bg-[var(--surface-elevated)] border border-[var(--border-base)] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Clock size={16} className="text-emerald-400" /> Việc tốt hôm nay
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="journal-title" className="sr-only">Tiêu đề</label>
            <input
              id="journal-title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tiêu đề việc tốt..."
              required
              className="w-full bg-[var(--surface-strong)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none focus:border-[color-mix(in_srgb,var(--color-success)_40%,transparent)] focus:ring-1 focus:ring-emerald-400/20 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="journal-content" className="sr-only">Nội dung</label>
            <textarea
              id="journal-content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Mô tả chi tiết việc tốt bạn đã làm..."
              rows={4}
              required
              className="w-full bg-[var(--surface-strong)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none focus:border-[color-mix(in_srgb,var(--color-success)_40%,transparent)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--color-success)_20%,transparent)] transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Hình ảnh (tuỳ chọn)</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-[var(--border-base)] hover:border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] text-[var(--text-tertiary)] hover:text-emerald-400 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400/50 outline-none"
            >
              <ImageUp size={20} /> Thêm ảnh
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectFiles}
              className="hidden"
              aria-hidden="true"
            />
          </div>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((p, i) => (
                <div key={i} className="relative size-20 rounded-xl overflow-hidden border border-[var(--border-base)] group">
                  <img src={p} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    aria-label={`Xoá ảnh ${i + 1}`}
                    className="absolute top-0.5 right-0.5 size-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-black/80"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-400/5 border" style={{ borderColor: "color-mix(in srgb, var(--color-success) 10%, transparent)" }}>
            <Clock size={14} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-[var(--text-secondary)]">
              Bài viết sẽ được <span className="text-emerald-400 font-semibold">quản trị viên duyệt</span> trước khi cộng{" "}
              <span className="text-emerald-400 font-semibold">+1 điểm Đạo đức</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || creating}
            className="w-full py-3 min-h-12 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-[var(--text-primary)] text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-400/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400/50 outline-none"
          >
            {creating
              ? uploading
                ? "Đang tải ảnh..."
                : "Đang lưu..."
              : "Lưu nhật ký"}
          </button>
        </form>
      </div>
    </div>
  );
}
