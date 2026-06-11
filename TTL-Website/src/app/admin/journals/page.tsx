/* eslint-disable @next/next/no-img-element */
"use client";

import { BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import { useAdminJournals } from "@/hook/admin/useAdminJournals";
gsap.registerPlugin(ScrollTrigger);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const imgUrl = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

export default function JournalPage() {
  const { entries, loading, total, page, setPage, limit, approve, reject } =
    useAdminJournals();
  const [note, setNote] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".admin-card");
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(items, { y: 20, opacity: 0 }, { y: 0, opacity: 1, force3D: true, duration: 0.4, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <BookOpen size={20} className="text-primary" aria-hidden="true" />{" "}
            Duyệt đạo đức
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            {total} đạo đức đang chờ duyệt
          </p>
        </div>
      </div>

      <Skeleton name="admin-journals" loading={loading} rows={entries.length || 1}>
        {entries.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
            <BookOpen size={40} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Không có đạo đức</h3>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Chưa có đạo đức nào đang chờ duyệt.</p>
          </div>
        ) : (
          <div ref={listRef} className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="admin-card glass-strong card-hover cursor-pointer rounded-2xl p-4 border transition-all"
                style={{ borderColor: "var(--border-base)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {entry.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border text-[11px] font-medium text-yellow-400" style={{ borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}>
                        <Clock size={10} /> Chờ duyệt
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border text-[11px] font-bold text-amber-400" style={{ borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}>
                        +{entry.points}
                      </span>
                    </div>
                    <p className="text-xs whitespace-pre-line line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
                      {entry.content}
                    </p>
                    {entry.images && entry.images.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {(entry.images as string[])
                          .slice(0, 3)
                          .map((url, i) => (
                            <div
                              key={i}
                              className="size-10 rounded-lg overflow-hidden border"
                              style={{ borderColor: "var(--border-base)" }}
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
                    <p className="text-[10px] mt-2" style={{ color: "var(--text-tertiary)" }}>
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
                        className="border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary/30 transition-colors"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-base)", color: "var(--text-primary)" }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await approve(entry.id, note || undefined);
                            setActionId(null);
                            setNote("");
                          }}
                          aria-label="Duyệt đạo đức"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
                          style={{ border: "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)" }}
                        >
                          <CheckCircle size={12} /> Duyệt
                        </button>
                        <button
                          onClick={async () => {
                            await reject(entry.id, note || undefined);
                            setActionId(null);
                            setNote("");
                          }}
                          aria-label="Từ chối đạo đức"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                          style={{ border: "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)" }}
                        >
                          <XCircle size={12} /> Từ chối
                        </button>
                        <button
                          onClick={() => setActionId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          style={{ background: "var(--surface-elevated)", color: "var(--text-tertiary)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--surface-elevated)";
                          }}
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
