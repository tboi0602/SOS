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
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-cyan/10 border border-primary/20 flex items-center justify-center">
            <BookOpen size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black ">
              E-LEARNING
            </h1>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
              Bài học & tài liệu đào tạo
            </p>
          </div>
        </div>

        <Skeleton name="post-card" loading={loading} rows={lessons.length || 3}>
          {lessons.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-linear-to-b bg-white/3 border border-white/5">
              <BookOpen size={32} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">Chưa có bài học nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelected(selected?.id === lesson.id ? null : lesson)}
                  className={`text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer ${
                    selected?.id === lesson.id
                      ? "border-primary/40 bg-primary/8"
                      : "border-white/6 bg-white/3 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-cyan shrink-0" />
                    <h3 className="text-sm font-bold text-white truncate">{lesson.title}</h3>
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
                        <div className="size-16 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-zinc-500 shrink-0">
                          +{(lesson.images as string[]).length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {lesson.videoUrl && (
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <Play size={12} className="text-danger" /> Có video bài giảng
                    </div>
                  )}

                  {lesson.content && (
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-2">{lesson.content}</p>
                  )}

                  <p className="text-[10px] text-zinc-600 mt-3">
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
              className="relative max-w-2xl w-full max-h-[80dvh] overflow-y-auto rounded-3xl bg-[#0a1633] border border-white/10 p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-cyan" />
                <h2 className="text-lg font-bold text-white">{selected.title}</h2>
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
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
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
