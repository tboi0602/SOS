"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Download, CheckCircle2, Loader2 } from "lucide-react"
import { membershipService, type UserFlow } from "@/service/membership.service"

export default function UploadDocsStep({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
  const [agreed, setAgreed] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (files.length === 0) return
    try {
      setUploading(true)
      setError(null)
      await membershipService.uploadDocs(files)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload thất bại")
    } finally {
      setUploading(false)
    }
  }

  if (!agreed) {
    return (
      <div className="step-card rounded-2xl p-6 space-y-4" style={{
        background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
        boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
        border: "0.5px solid var(--border-base)",
      }}>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FileText size={16} style={{ color: "var(--clr-primary)" }} />
          Thể lệ đăng ký
        </h3>

        {flow.membershipFlow?.rules ? (
          <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto" style={{
            background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
            color: "var(--text-secondary)",
          }}>
            {flow.membershipFlow.rules}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Vui lòng đọc kỹ thể lệ trước khi đăng ký.
          </p>
        )}

        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--clr-primary) 8%, transparent)" }}>
          <Download size={16} style={{ color: "var(--clr-primary)" }} />
          <a
            href="/files/mau-don-dang-ky.pdf"
            download
            className="text-xs font-medium underline underline-offset-2"
            style={{ color: "var(--clr-primary)" }}
          >
            Tải mẫu đơn đăng ký
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
          <CheckCircle2 size={16} />
          Đã hiểu, tiếp tục
        </button>
      </div>
    )
  }

  return (
    <div className="step-card rounded-2xl p-6 space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Upload size={16} style={{ color: "var(--clr-primary)" }} />
        Nộp hồ sơ
      </h3>
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        Vui lòng tải lên các giấy tờ: CMND/CCCD, ảnh thẻ, giấy tờ khác (PDF, DOC, JPG, PNG)
      </p>

      {flow.membershipFlow?.rules && (
        <details className="text-xs" style={{ color: "var(--text-dim)" }}>
          <summary className="cursor-pointer font-medium">Xem lại thể lệ</summary>
          <div className="mt-2 p-3 rounded-lg whitespace-pre-wrap" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
            {flow.membershipFlow.rules}
          </div>
        </details>
      )}

      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--clr-primary) 8%, transparent)" }}>
        <Download size={16} style={{ color: "var(--clr-primary)" }} />
        <a
          href="/files/mau-don-dang-ky.pdf"
          download
          className="text-xs font-medium underline underline-offset-2"
          style={{ color: "var(--clr-primary)" }}
        >
          Tải mẫu đơn đăng ký
        </a>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-primary/50"
        style={{ borderColor: "color-mix(in srgb, var(--text-primary) 15%, transparent)" }}
      >
        <Upload size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-xs font-medium">Nhấn để chọn file</p>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>Hỗ trợ: PDF, DOC, DOCX, JPG, PNG</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files || [])
            setFiles((prev) => [...prev, ...selected])
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>{files.length} file đã chọn:</p>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }}>
              <FileText size={12} />
              <span className="flex-1 truncate">{f.name}</span>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
        style={{ background: "var(--clr-primary)", color: "#fff" }}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Đang tải lên..." : "Gửi hồ sơ"}
      </button>
    </div>
  )
}
