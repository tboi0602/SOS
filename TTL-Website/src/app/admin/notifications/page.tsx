"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { notificationService } from "@/service/notification.service";
import { useAdminNotifications } from "@/hook/admin/useAdminNotifications";
import type { Notification } from "@/types/content";
gsap.registerPlugin(ScrollTrigger);

export default function AdminNotificationsPage() {
  const { notifications, loading, page, total, totalPages, setPage, fetch } = useAdminNotifications();
  const listRef = useRef<HTMLDivElement>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const handleCreate = async () => {
    if (!title || !content) return;
    try {
      await notificationService.create({ title, content, link: link || undefined });
      setShowCreate(false);
      setTitle("");
      setContent("");
      setLink("");
      fetch();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await notificationService.delete(deleteId);
      setDeleteId(null);
      fetch();
    } catch {}
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Quản lý thông báo</h1>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-[var(--text-primary)] text-[11px] font-semibold hover:bg-primary-light transition-all cursor-pointer"
          >
            <Plus size={12} /> Tạo thông báo
          </button>
        </div>

        {showCreate && (
          <div className="rounded-2xl p-5 space-y-4" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề"
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all resize-none"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
            />
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Liên kết (tuỳ chọn)"
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-primary text-[var(--text-primary)] text-sm font-semibold hover:bg-primary-light transition-all cursor-pointer"
              >
                Đăng thông báo
              </button>
              <button
                onClick={() => { setShowCreate(false); setTitle(""); setContent(""); setLink(""); }}
                className="px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
              >
                Huỷ
              </button>
            </div>
          </div>
        )}

        <Skeleton name="admin-table" loading={loading} rows={notifications.length || 3}>
          {notifications.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
              <Bell size={40} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Chưa có thông báo</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Chưa có thông báo nào.</p>
            </div>
          ) : (
            <div ref={listRef} className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={`admin-card card-hover rounded-2xl border p-4 ${n.isRead ? "" : "border-primary/20 bg-primary/5"}`} style={n.isRead ? { borderColor: "var(--border-base)" } : undefined}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!n.isRead && <span className="size-2 rounded-full bg-primary shrink-0" />}
                        <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{n.title}</h3>
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{n.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{new Date(n.createdAt).toLocaleString("vi-VN")}</span>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{n.type}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(n.id)}
                      className="p-1.5 rounded-lg transition-all cursor-pointer"
                      style={{ color: "var(--text-tertiary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--danger) 10%, transparent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
            </div>
          )}
        </Skeleton>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xoá thông báo"
        message="Bạn có chắc muốn xoá thông báo này?"
        confirmLabel="Xoá"
      />
    </div>
  );
}
