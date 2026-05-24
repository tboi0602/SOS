/* eslint-disable @next/next/no-img-element */
"use client";

import { BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import { useAdminJournals } from "@/hook/admin/useAdminJournals";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const imgUrl = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

export default function JournalPage() {
  const { entries, loading, total, page, setPage, limit, approve, reject } =
    useAdminJournals();
  const [note, setNote] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-8xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-primary" aria-hidden="true" />{" "}
            Duyệt nhật ký
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {total} nhật ký đang chờ duyệt
          </p>
        </div>
      </div>

      <Skeleton name="admin-journals" loading={loading} rows={entries.length || 1}>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Không có nhật ký nào đang chờ
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="glass-strong rounded-2xl p-4 border border-white/6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">
                        {entry.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[11px] font-medium text-yellow-400">
                        <Clock size={10} /> Chờ duyệt
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] font-bold text-amber-400">
                        +{entry.points}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 whitespace-pre-line line-clamp-2">
                      {entry.content}
                    </p>
                    {entry.images && entry.images.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {(entry.images as string[])
                          .slice(0, 3)
                          .map((url, i) => (
                            <div
                              key={i}
                              className="size-10 rounded-lg overflow-hidden border border-white/6"
                            >
                              <img
                                src={imgUrl(url)}
                                alt=""
                                className="size-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                    <p className="text-[10px] text-zinc-600 mt-2">
                      {entry.user?.name} &bull;{" "}
                      {new Date(entry.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  {actionId === entry.id ? (
                    <div className="flex flex-col gap-2 w-64 shrink-0">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú (tuỳ chọn)..."
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await approve(entry.id, note || undefined);
                            setActionId(null);
                            setNote("");
                          }}
                          aria-label="Duyệt nhật ký"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
                        >
                          <CheckCircle size={12} /> Duyệt
                        </button>
                        <button
                          onClick={async () => {
                            await reject(entry.id, note || undefined);
                            setActionId(null);
                            setNote("");
                          }}
                          aria-label="Từ chối nhật ký"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                        >
                          <XCircle size={12} /> Từ chối
                        </button>
                        <button
                          onClick={() => setActionId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs hover:bg-white/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActionId(entry.id)}
                      className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      Xử lý
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              variant="simple"
            />
          </div>
        )}
      </Skeleton>
    </div>
    </div>
  );
}
