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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0c1e3a] rounded-2xl p-6 w-full max-w-lg border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Clock size={16} className="text-amber-400" /> Việc tốt hôm nay
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Tiêu đề việc tốt..."
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
          />
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Mô tả chi tiết việc tốt bạn đã làm..."
            rows={4}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors resize-none"
          />

          {/* Image Upload */}
          <div>
            <p className="text-xs text-zinc-500 mb-2">Hình ảnh (tuỳ chọn)</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/30 text-zinc-500 hover:text-primary transition-all cursor-pointer"
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
            />
          </div>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((p, i) => (
                <div
                  key={i}
                  className="relative size-20 rounded-xl overflow-hidden border border-white/10 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    className="absolute top-0.5 right-0.5 size-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
            <Clock size={14} className="text-amber-400 shrink-0" />
            <p className="text-xs text-zinc-400">
              Bài viết sẽ được <span className="text-amber-400 font-semibold">quản trị viên duyệt</span>{" "}
              trước khi cộng{" "}
              <span className="text-amber-400 font-semibold">+1 điểm Truyền cảm hứng</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || creating}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
