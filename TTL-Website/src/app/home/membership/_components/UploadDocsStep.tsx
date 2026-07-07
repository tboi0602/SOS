"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  Image,
} from "lucide-react";
import { membershipService, type UserFlow } from "@/service/membership.service";

const DOC_ACCEPT = ".pdf,.doc,.docx,.zip,.rar";
const IMG_ACCEPT = ".jpg,.jpeg,.png,.webp";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function ImgPreview({ file }: { file: File }) {
  const url = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    url.current = URL.createObjectURL(file);
    setLoaded(true);
    return () => {
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, [file]);
  if (!loaded) return null;
  return (
    <img
      src={url.current!}
      alt={file.name}
      className="w-full h-32 object-cover rounded-lg"
    />
  );
}

function FileList({
  files,
  onRemove,
  horizontal,
}: {
  files: File[];
  onRemove: (i: number) => void;
  horizontal?: boolean;
}) {
  if (!files.length) return null;

  const images = files.filter(isImageFile);
  const docs = files.filter((f) => !isImageFile(f));

  return (
    <div className="space-y-2">
      {horizontal && images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((f, i) => {
            const idx = files.indexOf(f);
            return (
              <div
                key={i}
                className="relative size-28 shrink-0 rounded-lg overflow-hidden border"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--text-primary) 10%, transparent)",
                }}
              >
                <ImgPreview file={f} />
                <button
                  onClick={() => onRemove(idx)}
                  className="absolute top-1 right-1 size-5 flex items-center justify-center rounded-full bg-black/60 text-white text-[11px] cursor-pointer"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}
      {!horizontal && images.length > 0 && (
        <div className="space-y-2">
          {images.map((f, i) => {
            const idx = files.indexOf(f);
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  background:
                    "color-mix(in srgb, var(--text-primary) 4%, transparent)",
                }}
              >
                <div className="relative group w-24 shrink-0">
                  <ImgPreview file={f} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{f.name}</p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {formatSize(f.size)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(idx)}
                  className="shrink-0 cursor-pointer"
                  style={{ color: "var(--text-dim)" }}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}
      {docs.length > 0 && (
        <div className="space-y-2">
          {docs.map((f) => {
            const idx = files.indexOf(f);
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  background:
                    "color-mix(in srgb, var(--text-primary) 4%, transparent)",
                }}
              >
                <div
                  className="size-12 shrink-0 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  }}
                >
                  <FileText size={18} style={{ color: "var(--clr-primary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{f.name}</p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {formatSize(f.size)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(idx)}
                  className="shrink-0 cursor-pointer"
                  style={{ color: "var(--text-dim)" }}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DropZone({
  accept,
  multiple,
  label,
  hint,
  files,
  onFiles,
  onRemove,
  horizontal,
}: {
  accept: string;
  multiple: boolean;
  label: string;
  hint?: string;
  horizontal?: boolean;
  files: File[];
  onFiles: (files: FileList | null) => void;
  onRemove: (i: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => ref.current?.click();
  return (
    <div className="space-y-2">
      <p
        className="text-xs font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      {files.length === 0 ? (
        <div
          onClick={handleClick}
          className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all hover:border-primary/50"
          style={{
            borderColor:
              "color-mix(in srgb, var(--text-primary) 15%, transparent)",
          }}
        >
          <Upload size={24} className="mx-auto mb-1.5 opacity-30" />
          <p className="text-xs font-medium">Nhấn để chọn file</p>
          {hint && (
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "var(--text-dim)" }}
            >
              {hint}
            </p>
          )}
        </div>
      ) : (
        <>
          <FileList files={files} onRemove={onRemove} horizontal={horizontal} />
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
            style={{
              background:
                "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
              color: "var(--clr-primary)",
            }}
          >
            + Thêm file
          </button>
        </>
      )}
      <input
        ref={ref}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function IdCardSlot({
  side,
  file,
  onFile,
  onRemove,
}: {
  side: "trước" | "sau";
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (file) {
      previewUrl.current = URL.createObjectURL(file);
      setLoaded(true);
      return () => {
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      };
    }
    setLoaded(false);
  }, [file]);

  return (
    <div
      onClick={() => !file && inputRef.current?.click()}
      className="border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all hover:border-primary/50"
      style={{
        borderColor: file
          ? "var(--clr-primary)"
          : "color-mix(in srgb, var(--text-primary) 15%, transparent)",
      }}
    >
      {file && loaded ? (
        <div>
          <div className="relative">
            <img
              src={previewUrl.current!}
              alt={`Mặt ${side}`}
              className="w-full h-36 object-cover rounded-lg"
            />
            <p className="absolute bottom-1 left-1 text-[9px] font-medium px-1.5 py-0.5 rounded bg-black/50 text-white">
              Mặt {side}
            </p>
          </div>
          <div className="flex gap-2 mt-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="flex-1 py-1 rounded-lg text-[10px] font-medium cursor-pointer"
              style={{
                background:
                  "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
                color: "var(--clr-primary)",
              }}
            >
              Đổi
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="flex-1 py-1 rounded-lg text-[10px] font-medium cursor-pointer"
              style={{
                background:
                  "color-mix(in srgb, var(--danger) 12%, transparent)",
                color: "var(--danger)",
              }}
            >
              Xoá
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <Image size={20} className="mx-auto mb-1 opacity-30" />
          <p className="text-xs font-medium">Mặt {side}</p>
          <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
            JPG, PNG, WEBP
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={IMG_ACCEPT}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function UploadDocsStep({
  flow,
  onSuccess,
}: {
  flow: UserFlow;
  onSuccess: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  const [achievements, setAchievements] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles =
    (field: "documents" | "achievements") => (list: FileList | null) => {
      if (!list) return;
      const arr = Array.from(list);
      if (field === "documents") setDocuments((prev) => [...prev, ...arr]);
      else setAchievements((prev) => [...prev, ...arr]);
    };

  const handleUpload = async () => {
    if (documents.length === 0) {
      setError("Vui lòng tải lên hồ sơ");
      return;
    }
    if (!idCardFront || !idCardBack) {
      setError("Vui lòng tải lên cả 2 mặt căn cước");
      return;
    }
    try {
      setUploading(true);
      setError(null);
      await membershipService.uploadDocs({
        documents: documents.length > 0 ? documents : undefined,
        idCardFront: idCardFront,
        idCardBack: idCardBack,
        achievements: achievements.length > 0 ? achievements : undefined,
      });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (!agreed) {
    return (
      <div
        className="step-card rounded-2xl p-6 space-y-4"
        style={{
          background:
            "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
          boxShadow:
            "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
          border: "0.5px solid var(--border-base)",
        }}
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FileText size={16} style={{ color: "var(--clr-primary)" }} />
          Thể lệ đăng ký
        </h3>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Vui lòng đọc nội dung thể lệ đăng ký{" "}
          <a
            href="/purport"
            target="_blank"
            className="font-medium underline underline-offset-2"
            style={{ color: "var(--clr-primary)" }}
          >
            tại đây
          </a>{" "}
          trước khi đăng ký hội viên.
        </p>
        <div
          className="flex items-center gap-2 p-3 rounded-xl"
          style={{
            background:
              "color-mix(in srgb, var(--clr-primary) 8%, transparent)",
          }}
        >
          <Download size={16} style={{ color: "var(--clr-primary)" }} />
          <a
            href="/files/so-yeu-ly-lich.docx"
            download
            className="text-xs font-medium underline underline-offset-2"
            style={{ color: "var(--clr-primary)" }}
          >
            Tải mẫu Sơ yếu lý lịch
          </a>

          <a
            href="/files/LLCN.docx"
            download
            className="text-xs ml-5 max-md:ml-0 font-medium underline underline-offset-2"
            style={{ color: "var(--clr-primary)" }}
          >
            Tải mẫu Lý lịch Khoa học cá nhân
          </a>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(true)}
            className="mt-0.5 size-4 accent-[var(--clr-primary)] cursor-pointer"
          />
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tôi đã đọc và đồng ý với thể lệ đăng ký thành viên
          </span>
        </label>
        <button
          onClick={() => setAgreed(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          style={{ background: "var(--clr-primary)", color: "#fff" }}
        >
          <CheckCircle2 size={16} /> Đã hiểu, tiếp tục
        </button>
      </div>
    );
  }

  return (
    <div
      className="step-card rounded-2xl p-6 space-y-5"
      style={{
        background:
          "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow:
          "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}
    >
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Upload size={16} style={{ color: "var(--clr-primary)" }} />
        Nộp hồ sơ
      </h3>

      {flow.membershipFlow?.rules && (
        <details className="text-xs" style={{ color: "var(--text-dim)" }}>
          <summary className="cursor-pointer font-medium">
            Xem lại thể lệ
          </summary>
          <div
            className="mt-2 p-3 rounded-lg whitespace-pre-wrap"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 3%, transparent)",
            }}
          >
            {flow.membershipFlow.rules}
          </div>
        </details>
      )}

      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{
          background: "color-mix(in srgb, var(--clr-primary) 8%, transparent)",
        }}
      >
        <Download size={16} style={{ color: "var(--clr-primary)" }} />
        <a
          href="/files/so-yeu-ly-lich.docx"
          download
          className="text-xs font-medium underline underline-offset-2"
          style={{ color: "var(--clr-primary)" }}
        >
          Tải mẫu Sơ yếu lý lịch
        </a>

        <a
          href="/files/LLCN.docx"
          download
          className="text-xs ml-5 max-md:ml-0 font-medium underline underline-offset-2"
          style={{ color: "var(--clr-primary)" }}
        >
          Tải mẫu Lý lịch Khoa học cá nhân
        </a>
      </div>

      {/* 1. Hồ sơ */}
      <DropZone
        accept={DOC_ACCEPT}
        multiple
        label="Hồ sơ (sơ yếu lý lịch, lý lịch cá nhân)"
        hint="PDF, DOC, DOCX, ZIP, RAR — tối đa 20MB/file"
        files={documents}
        onFiles={addFiles("documents")}
        onRemove={(i) => setDocuments((prev) => prev.filter((_, j) => j !== i))}
      />

      {/* 2. Căn cước công dân */}
      <div className="space-y-2">
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          <Image size={12} className="inline mr-1" />
          Căn cước công dân
        </p>
        <div className="grid grid-cols-2 gap-3">
          <IdCardSlot
            side="trước"
            file={idCardFront}
            onFile={setIdCardFront}
            onRemove={() => setIdCardFront(null)}
          />
          <IdCardSlot
            side="sau"
            file={idCardBack}
            onFile={setIdCardBack}
            onRemove={() => setIdCardBack(null)}
          />
        </div>
      </div>

      {/* 3. Ảnh thành tích */}
      <DropZone
        accept={IMG_ACCEPT}
        multiple
        horizontal
        label="Ảnh thành tích (không bắt buộc)"
        hint="JPG, PNG, WEBP — tối đa 20MB/file"
        files={achievements}
        onFiles={addFiles("achievements")}
        onRemove={(i) =>
          setAchievements((prev) => prev.filter((_, j) => j !== i))
        }
      />

      {error && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={
          documents.length === 0 || !idCardFront || !idCardBack || uploading
        }
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
        style={{ background: "var(--clr-primary)", color: "#fff" }}
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        {uploading ? "Đang tải lên..." : "Gửi hồ sơ"}
      </button>
    </div>
  );
}
