/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { BookOpen, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react"
import { useAdminJournals } from "@/hook/admin/useAdminApprovals"

export default function AdminJournalsPage() {
  const { entries, loading, total, page, setPage, limit, approve, reject } = useAdminJournals()
  const [note, setNote] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-primary" /> Duyệt nhật ký
          </h1>
          <p className="text-xs text-zinc-500 mt-1">{total} nhật ký đang chờ duyệt</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500 text-sm">Đang tải...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm">Không có nhật ký nào đang chờ</div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="glass-strong rounded-2xl p-4 border border-white/6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{entry.title}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[11px] font-medium text-yellow-400">
                      <Clock size={10} /> Chờ duyệt
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] font-bold text-amber-400">
                      +{entry.points}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 whitespace-pre-line line-clamp-2">{entry.content}</p>
                  {entry.images && entry.images.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {(entry.images as string[]).slice(0, 3).map((url, i) => (
                        <div key={i} className="size-10 rounded-lg overflow-hidden border border-white/6">
                          <img src={url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${url}`} alt="" className="size-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-600 mt-2">
                    {entry.user?.name} &bull; {new Date(entry.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                {actionId === entry.id ? (
                  <div className="flex flex-col gap-2 w-64 shrink-0">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú (tuỳ chọn)..."
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={async () => { await approve(entry.id, note || undefined); setActionId(null); setNote("") }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all cursor-pointer">
                        <CheckCircle size={12} /> Duyệt
                      </button>
                      <button onClick={async () => { await reject(entry.id, note || undefined); setActionId(null); setNote("") }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer">
                        <XCircle size={12} /> Từ chối
                      </button>
                      <button onClick={() => setActionId(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs hover:bg-white/10 transition-all cursor-pointer">
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setActionId(entry.id)}
                    className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all shrink-0 cursor-pointer">
                    Xử lý
                  </button>
                )}
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer">
                Trước
              </button>
              <span className="px-3 py-1.5 text-xs text-zinc-500">Trang {page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer">
                Sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
