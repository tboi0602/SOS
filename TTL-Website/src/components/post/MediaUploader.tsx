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
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <Film size={12} /> Ảnh & Video
      </h3>

      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-6 text-center cursor-pointer ${dragActive
            ? "border-cyan bg-cyan/10 scale-[1.01]"
            : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
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
          <div className={`size-12 rounded-xl flex items-center justify-center transition-all duration-200 ${dragActive ? "bg-cyan/20 scale-110" : "bg-white/5"}`}>
            <Upload size={22} className={`transition-colors ${dragActive ? "text-cyan" : "text-zinc-500"}`} />
          </div>
          <div>
            <p className="text-sm text-white font-medium">
              {dragActive ? "Thả file để tải lên" : "Kéo ảnh/video vào đây"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              hoặc chọn file từ máy tính
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan text-xs font-medium hover:bg-cyan/20 transition-all cursor-pointer"
          >
            <ImagePlus size={14} /> Ảnh
          </button>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-400/10 text-purple-400 text-xs font-medium hover:bg-purple-400/20 transition-all cursor-pointer"
          >
            <Video size={14} /> Video
          </button>
        </div>
      </div>

      {mediaFiles.length > 0 && (
        <div>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileImage size={11} />
            {mediaFiles.length} file{mediaFiles.length > 1 ? "" : ""} đã chọn
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {mediaFiles.map((media, i) => (
              <div key={i} className="relative group aspect-square w-full">
                {media.type === "image" ? (
                  <Image
                    src={media.preview}
                    alt="upload-preview"
                    className="rounded-lg object-cover border border-white/6"
                    fill
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-black/40 border border-white/6 flex items-center justify-center relative overflow-hidden">
                    <video
                      src={media.preview}
                      className="w-full h-full object-cover absolute inset-0 opacity-40"
                    />
                    <Video size={20} className="text-zinc-400 relative z-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(i)}
                    className="size-8 rounded-full bg-danger/80 text-white flex items-center justify-center hover:bg-danger transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <span className="absolute top-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                  {media.file.size > 1024 * 1024
                    ? (media.file.size / (1024 * 1024)).toFixed(1) + " MB"
                    : (media.file.size / 1024).toFixed(0) + " KB"}
                </span>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] text-zinc-400 font-medium">
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
