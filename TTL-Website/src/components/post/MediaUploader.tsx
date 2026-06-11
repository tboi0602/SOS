"use client";

import { Video, Upload, ImagePlus, FileImage, Film } from "lucide-react";
import Image from "next/image";
import { X } from "lucide-react";
import type { MediaFile } from "@/hook/post";

interface MediaUploaderProps {
  mediaFiles: MediaFile[];
  dragActive: boolean;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFiles: (files: FileList | null) => void;
  onRemoveMedia: (index: number) => void;
}

export function MediaUploader({
  mediaFiles,
  dragActive,
  imageInputRef,
  videoInputRef,
  onDrag,
  onDrop,
  onFiles,
  onRemoveMedia,
}: MediaUploaderProps) {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <h3
        className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        <Film size={12} /> Ảnh & Video
      </h3>

      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-6 text-center cursor-pointer ${
          dragActive
            ? "border-accent bg-accent/10 scale-[1.01]"
            : "border-[var(--border-base)] hover:border-[var(--text-tertiary)]"
        }`}
      >
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div
            className={`size-12 rounded-xl flex items-center justify-center transition-all duration-200 ${dragActive ? "bg-accent/20 scale-110" : ""}`}
            style={{
              background: dragActive
                ? undefined
                : "color-mix(in srgb, var(--text-primary) 5%, transparent)",
            }}
          >
            <Upload
              size={22}
              className={`transition-colors ${dragActive ? "text-accent" : ""}`}
              style={{ color: dragActive ? undefined : "var(--text-tertiary)" }}
            />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {dragActive ? "Thả file để tải lên" : "Kéo ảnh/video vào đây"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              hoặc chọn file từ máy tính
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{
              background:
                "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              color: "var(--color-accent)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--color-accent) 20%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--color-accent) 10%, transparent)";
            }}
          >
            <ImagePlus size={14} /> Ảnh
          </button>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{
              background:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              color: "var(--color-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--color-primary) 20%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--color-primary) 10%, transparent)";
            }}
          >
            <Video size={14} /> Video
          </button>
        </div>
      </div>

      {mediaFiles.length > 0 && (
        <div>
          <p
            className="text-[11px] uppercase tracking-wider mb-3 flex items-center gap-1.5"
            style={{ color: "var(--text-dim)" }}
          >
            <FileImage size={11} />
            {mediaFiles.length} file đã chọn
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {mediaFiles.map((media, i) => (
              <div key={i} className="relative group aspect-square w-full">
                {media.type === "image" ? (
                  <Image
                    src={media.preview}
                    alt="upload-preview"
                    className="rounded-lg object-cover"
                    fill
                    style={{ border: "0.5px solid var(--border-base)" }}
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                      background:
                        "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                      border: "0.5px solid var(--border-base)",
                    }}
                  >
                    <video
                      src={media.preview}
                      className="w-full h-full object-cover absolute inset-0 opacity-40"
                    />
                    <Video
                      size={20}
                      className="relative z-10"
                      style={{ color: "var(--text-tertiary)" }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(i)}
                    className="size-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                    style={{ background: "var(--color-danger)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
                <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm text-white">
                  {media.file.size > 1024 * 1024
                    ? (media.file.size / (1024 * 1024)).toFixed(1) + " MB"
                    : (media.file.size / 1024).toFixed(0) + " KB"}
                </span>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-medium  backdrop-blur-sm text-white">
                  {media.type === "image" ? "IMG" : "VID"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
