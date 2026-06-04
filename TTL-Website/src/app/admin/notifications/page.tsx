"use client";

import { useState } from "react";
import { Bell, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { notificationService } from "@/service/notification.service";
import { useAdminNotifications } from "@/hook/admin/useAdminNotifications";
import type { Notification } from "@/types/content";

export default function AdminNotificationsPage() {
  const { notifications, loading, page, total, totalPages, setPage, fetch } = useAdminNotifications();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Quản lý thông báo</h1>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary-light transition-all cursor-pointer"
          >
            <Plus size={12} /> Tạo thông báo
          </button>
        </div>

        {showCreate && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all resize-none"
            />
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Liên kết (tuỳ chọn)"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-all cursor-pointer"
              >
                Đăng thông báo
              </button>
              <button
                onClick={() => { setShowCreate(false); setTitle(""); setContent(""); setLink(""); }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                Huỷ
              </button>
            </div>
          </div>
        )}

        <Skeleton name="admin-table" loading={loading} rows={notifications.length || 3}>
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">Chưa có thông báo nào</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={`rounded-2xl border p-4 ${n.isRead ? "border-white/6" : "border-primary/20 bg-primary/5"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!n.isRead && <span className="size-2 rounded-full bg-primary shrink-0" />}
                        <h3 className="text-sm font-bold text-white">{n.title}</h3>
                      </div>
                      <p className="text-xs text-zinc-400">{n.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-zinc-600">{new Date(n.createdAt).toLocaleString("vi-VN")}</span>
                        <span className="text-[10px] text-zinc-600">{n.type}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(n.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
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
