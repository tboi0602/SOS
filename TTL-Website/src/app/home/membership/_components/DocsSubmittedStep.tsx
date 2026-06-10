"use client"

import { useState, useRef } from "react"
import { Clock, Upload, Loader2, FileText } from "lucide-react"
import { membershipService, type UserFlow } from "@/service/membership.service"

export default function DocsSubmittedStep({ flow, onSuccess }: { flow: UserFlow; onSuccess: () => void }) {
  const [showUpload, setShowUpload] = useState(false)
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
      setShowUpload(false)
      setFiles([])
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload thất bại")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="step-card rounded-2xl p-6 space-y-4" style={{
      background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
      boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
      border: "0.5px solid var(--border-base)",
    }}>
      <div className="text-center py-4 space-y-3">
        <Clock size={40} className="mx-auto opacity-40" />
        <h3 className="text-sm font-semibold">Hồ sơ đang chờ duyệt</h3>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Quản trị viên đang xem xét hồ sơ của bạn. Bạn có thể nộp bổ sung hồ sơ nếu cần.
        </p>
        {flow.adminNote && (
          <div className="rounded-xl p-3 text-left" style={{ background: "color-mix(in srgb, var(--color-warning) 10%, transparent)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--color-warning)" }}>Ghi chú từ quản trị viên:</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{flow.adminNote}</p>
          </div>
        )}
      </div>

      {!showUpload ? (
        <button
          onClick={() => setShowUpload(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}
        >
          <Upload size={16} />
          Nộp bổ sung hồ sơ
        </button>
      ) : (
        <div className="space-y-3 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary/50"
            style={{ borderColor: "color-mix(in srgb, var(--text-primary) 15%, transparent)" }}
          >
            <p className="text-xs font-medium">Nhấn để chọn file bổ sung</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>
          {files.length > 0 && (
            <div className="space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }}>
                  <FileText size={12} />
                  <span className="flex-1 truncate">{f.name}</span>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Gửi bổ sung
            </button>
            <button
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 rounded-xl text-xs cursor-pointer"
              style={{ color: "var(--text-tertiary)" }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
