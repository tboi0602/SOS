"use client"

import { getInitial } from "@/utils/cn";
import { useEffect, useRef, useState, useCallback } from "react"
import { FileText, Search, X, Loader2, Image as ImageIcon, ExternalLink } from "lucide-react"
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

const STATUS_LABELS: Record<string, string> = {
  pending_docs: "Chờ nộp hồ sơ",
  docs_submitted: "Đã nộp hồ sơ",
  pending_payment: "Chờ thanh toán",
  payment_pending_verification: "Chờ xác nhận TT",
  in_lessons: "Đang học",
  pending_quiz: "Chờ kiểm tra",
  pending_situations: "Chờ nộp tình huống",
  pending_review: "Đang chấm",
  completed: "Hoàn thành",
}

function FileRow({ url, label }: { url: string; label: string }) {
  const fileName = url.split("/").pop() || "file"
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url)
  return (
    <a href={fileUrl(url)} target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:opacity-80" style={{ background: "color-mix(in srgb, var(--clr-primary) 6%, transparent)", color: "var(--clr-primary)" }}>
      {isImage ? <ImageIcon size={14} /> : <FileText size={14} />}
      {label && <span className="text-[10px] opacity-60 shrink-0">{label}</span>}
      <span className="flex-1 truncate">{fileName}</span>
      <ExternalLink size={12} className="shrink-0" />
    </a>
  )
}

function FileSection({ title, files, label }: { title: string; files: string[]; label?: string }) {
  if (!files.length) return null
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{title}</p>
      {files.map((url, i) => <FileRow key={i} url={url} label={label && i === 0 ? label : ""} />)}
    </div>
  )
}

export default function MembershipDocumentsPage() {
  const [data, setData] = useState<{
    users: (UserFlow & { user: { id: string; name: string; email: string; avatar: string | null }; membershipFlow: { name: string; price: number } })[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const d = await adminService.getAllFlows(page, 20, search || undefined)
      setData(d as typeof data)
    } catch {} finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Hồ sơ thành viên</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Tất cả hồ sơ và tài liệu thành viên đã nộp</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
          placeholder="Tìm kiếm thành viên..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
          style={{ background: "var(--surface-elevated)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }}
        />
        {searchInput && (
          <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
            <X size={14} />
          </button>
        )}
      </div>

      <Skeleton name="mf-documents" loading={loading} rows={5}>
        {!data || data.users.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium opacity-60">{search ? "Không tìm thấy kết quả" : "Chưa có hồ sơ nào"}</p>
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
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)", color: "var(--clr-primary)" }}>
                          {STATUS_LABELS[entry.status] || entry.status}
                        </span>
                      </div>
                    </div>

                    {(documents.length > 0 || entry.idCardFront || entry.idCardBack || achievements.length > 0) && (
                      <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: "color-mix(in srgb, var(--text-primary) 8%, transparent)" }}>
                        <FileSection title="Hồ sơ" files={documents} />
                        <FileSection title="Căn cước" files={entry.idCardFront ? [entry.idCardFront] : []} label="Mặt trước" />
                        {entry.idCardBack && <FileSection title="" files={[entry.idCardBack]} label="Mặt sau" />}
                        <FileSection title="Ảnh thành tích" files={achievements} />
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
    </div>
  )
}
