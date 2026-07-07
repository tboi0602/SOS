"use client"

import { getInitial } from "@/utils/cn";
import { useEffect, useRef, useState, useCallback } from "react"
import { Upload, CheckCircle2, X, Loader2, FileText, ExternalLink, Image as ImageIcon } from "lucide-react"
import gsap from "gsap"
import { adminService } from "@/service/admin.service"
import { Skeleton } from "@/components/ui/Skeleton"
import Pagination from "@/components/admin/Pagination"
import type { UserFlow } from "@/service/membership.service"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

function fileUrl(url: string) {
  return url.startsWith("http") ? url : `${API_URL}${url}`
}

function splitUrls(val: string | null | undefined): string[] {
  return val ? val.split(",").filter(Boolean) : []
}

function FileLink({ url, label }: { url: string; label?: string }) {
  const fileName = url.split("/").pop() || "file"
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url)

  if (isImage) {
    return (
      <a href={fileUrl(url)} target="_blank" className="block rounded-lg overflow-hidden border shrink-0" style={{ borderColor: "color-mix(in srgb, var(--text-primary) 8%, transparent)", width: 180 }}>
        <img src={fileUrl(url)} alt={fileName} className="w-full h-32 object-cover" loading="lazy" />
        {label && <p className="text-[10px] px-2 py-1 text-center font-medium" style={{ color: "var(--text-tertiary)", background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>{label}</p>}
      </a>
    )
  }

  return (
    <a href={fileUrl(url)} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:opacity-80 shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 6%, transparent)", color: "var(--clr-primary)" }}>
      <FileText size={14} />
      <span className="flex-1 truncate">{fileName}</span>
      <ExternalLink size={12} className="shrink-0" />
    </a>
  )
}

function FileSection({ title, files, labels, direction = "vertical" }: { title: string; files: string[]; labels?: string[]; direction?: "vertical" | "horizontal" }) {
  if (!files.length) return null
  return (
    <div className="space-y-1.5">
      {title && <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{title}</p>}
      <div className={direction === "horizontal" ? "flex flex-wrap gap-2" : "space-y-1.5"}>
        {files.map((url, i) => <FileLink key={i} url={url} label={labels?.[i] ?? ""} />)}
      </div>
    </div>
  )
}

export default function PendingDocsTab() {
  const [data, setData] = useState<{
    users: (UserFlow & { user: { id: string; name: string; email: string } })[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await adminService.getPendingDocs(page) as unknown as typeof data; setData(d) }
    catch {} finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  const handleApprove = async (userId: string) => {
    try { setActionLoading(userId); await adminService.approveDocs(userId); fetchData() }
    catch {} finally { setActionLoading(null) }
  }
  const handleReject = async (userId: string) => {
    const note = prompt("Lý do từ chối:")
    if (!note) return
    try { setActionLoading(userId); await adminService.rejectDocs(userId, note); fetchData() }
    catch {} finally { setActionLoading(null) }
  }

  return (
    <Skeleton name="mf-pending-docs" loading={loading} rows={5}>
      {!data || data.users.length === 0 ? (
        <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <Upload size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium opacity-60">Không có hồ sơ chờ duyệt</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="grid gap-3">
            {data.users.map((entry) => {
              const documents = splitUrls(entry.documentsUrl)
              const achievements = splitUrls(entry.achievementImages)

              return (
                <div key={entry.user.id} className="mf-item rounded-2xl p-4 border card-hover transition-all" style={{
                  background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                  boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  border: "0.5px solid var(--border-base)",
                }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}>
                        {getInitial(entry.user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{entry.user.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{entry.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(entry.user.id)}
                        disabled={actionLoading === entry.user.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)", color: "var(--color-success)" }}
                      >
                        {actionLoading === entry.user.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(entry.user.id)}
                        disabled={actionLoading === entry.user.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={{ background: "color-mix(in srgb, var(--danger) 15%, transparent)", color: "var(--danger)" }}
                      >
                        <X size={12} /> Từ chối
                      </button>
                    </div>
                  </div>

                  {(documents.length > 0 || entry.idCardFront || entry.idCardBack || achievements.length > 0) && (
                    <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: "color-mix(in srgb, var(--text-primary) 8%, transparent)" }}>
                      <FileSection title="Hồ sơ" files={documents} direction="vertical" />
                      <FileSection title="Căn cước" files={[entry.idCardFront, entry.idCardBack].filter(Boolean) as string[]} direction="horizontal" labels={["Mặt trước", "Mặt sau"]} />
                      <FileSection title="Ảnh thành tích" files={achievements} direction="horizontal" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} variant="simple" />
        </>
      )}
    </Skeleton>
  )
}
