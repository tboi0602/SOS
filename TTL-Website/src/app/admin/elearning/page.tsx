'use client';

import { useState, useRef, useEffect } from 'react';
import Link from "next/link"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Plus, Trash2, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import Pagination from '@/components/admin/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { lessonService } from '@/service/lesson.service';
import { useAdminElearning } from '@/hook/admin/useAdminElearning';
gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminELearningPage() {
  const { lessons, loading, page, total, totalPages, setPage, fetch } = useAdminElearning();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await lessonService.delete(deleteId);
      setDeleteId(null);
      fetch();
    } catch {}
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Quản lý E-learning</h1>
          </div>
          <Link href="/admin/elearning/create"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-[var(--text-primary)] text-[11px] font-semibold hover:bg-primary-light transition-all cursor-pointer"
          >
            <Plus size={12} /> Thêm bài học
          </Link>
        </div>

        <Skeleton name="admin-table" loading={loading} rows={lessons.length || 3}>
          {lessons.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
              <GraduationCap size={40} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Chưa có buổi học</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Chưa có buổi học nào.</p>
            </div>
          ) : (
            <div ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="admin-card rounded-2xl border p-4 transition-all" style={{ border: "0.5px solid var(--border-base)", background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap size={16} className="text-accent shrink-0" />
                    <h3 className="text-sm font-bold truncate flex-1" style={{ color: "var(--text-primary)" }}>{lesson.title}</h3>
                  </div>
                  {lesson.images && (lesson.images as string[]).length > 0 && (
                    <img
                      src={(lesson.images as string[])[0].startsWith('http') ? (lesson.images as string[])[0] : `${API_URL}${(lesson.images as string[])[0]}`}
                      alt=""
                      className="w-full h-32 rounded-xl object-cover mb-3"
                    />
                  )}
                  {lesson.videoUrl && (
                    <p className="text-[11px] mb-2" style={{ color: "var(--text-tertiary)" }}>🎬 Có video bài giảng</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/elearning/${lesson.id}/edit`} className="p-1.5 rounded-lg transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 10%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}>
                        <Edit size={13} />
                      </Link>
                      <button onClick={() => setDeleteId(lesson.id)} className="p-1.5 rounded-lg transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--danger) 10%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
        </Skeleton>
      </div>

      <ConfirmDialog open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} title="Xoá bài học" message="Bạn có chắc muốn xoá bài học này?" confirmLabel="Xoá" />
    </div>
  );
}
