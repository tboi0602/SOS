/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { BookOpen, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import { useElearning } from "@/hook/elearning/useElearning";
import type { Lesson } from "@/types/content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ELearningPage() {
  const { lessons, loading, page, total, totalPages, setPage } = useElearning();
  const [selected, setSelected] = useState<Lesson | null>(null);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-base)" }}>
          <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
            <BookOpen size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black ">
              E-LEARNING
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Bài học & tài liệu đào tạo
            </p>
          </div>
        </div>

        <Skeleton name="post-card" loading={loading} rows={lessons.length || 3}>
          {lessons.length === 0 ? (
            <div className="text-center py-20 rounded-3xl"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}>
              <BookOpen size={32} className="mx-auto mb-3" style={{ color: "var(--text-tertiary)" }} />
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Chưa có buổi học nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelected(selected?.id === lesson.id ? null : lesson)}
                  className={`text-left rounded-2xl p-5 transition-all duration-300 cursor-pointer`}
                  style={{
                    background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                    boxShadow: selected?.id === lesson.id ? "0 4px 24px color-mix(in srgb, var(--clr-primary) 20%, transparent)" : "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                    border: selected?.id === lesson.id ? "1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)" : "0.5px solid var(--border-base)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-accent shrink-0" />
                    <h3 className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{lesson.title}</h3>
                  </div>

                  {lesson.images && lesson.images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto">
                      {(lesson.images as string[]).slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img.startsWith("http") ? img : `${API_URL}${img}`}
                          alt=""
                          className="size-16 rounded-lg object-cover shrink-0"
                        />
                      ))}
                      {(lesson.images as string[]).length > 3 && (
                        <div className="size-16 rounded-lg flex items-center justify-center text-[10px] shrink-0" style={{ background: "var(--surface-elevated)", color: "var(--text-tertiary)" }}>
                          +{(lesson.images as string[]).length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {lesson.videoUrl && (
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      <Play size={12} className="text-danger" /> Có video bài giảng
                    </div>
                  )}

                  {lesson.content && (
                    <p className="text-xs line-clamp-2 mt-2" style={{ color: "var(--text-tertiary)" }}>{lesson.content}</p>
                  )}

                  <p className="text-[10px] mt-3" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(lesson.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </button>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
        </Skeleton>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative max-w-2xl w-full max-h-[80dvh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-accent" />
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{selected.title}</h2>
              </div>

              {selected.images && (selected.images as string[]).length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {(selected.images as string[]).map((img, i) => (
                    <img
                      key={i}
                      src={img.startsWith("http") ? img : `${API_URL}${img}`}
                      alt=""
                      className="rounded-xl object-cover w-full h-40"
                    />
                  ))}
                </div>
              )}

              {selected.videoUrl && (
                <div className="mb-4 aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={selected.videoUrl.replace("watch?v=", "embed/")}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {selected.content && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{selected.content}</p>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-4 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer" style={{ border: "1px solid var(--border-base)", color: "var(--text-tertiary)", background: "var(--surface-elevated)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-elevated)"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
