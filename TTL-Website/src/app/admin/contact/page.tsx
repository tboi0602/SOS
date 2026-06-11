"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Trash2, Mail, Phone, CheckCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { adminContactService, type ContactMessage } from "@/service/contact.service";
import { useToast } from "@/components/ui/Toast";

export default function AdminContactPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMessages = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await adminContactService.list(p);
      setMessages(res.messages);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      toast("Không thể tải danh sách liên hệ", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages(page);
  }, [page, fetchMessages]);

  const handleMarkRead = async (id: string) => {
    try {
      await adminContactService.markRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch {
      toast("Không thể đánh dấu đã đọc", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminContactService.delete(deleteId);
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
      toast("Đã xóa", "success");
    } catch {
      toast("Không thể xóa", "error");
    }
  };

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Liên hệ</h1>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-tertiary)" }}>
              {total} tin nhắn
            </span>
          </div>
        </div>

        <Skeleton loading={loading} name="post-card" rows={3}>
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Chưa có tin nhắn nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-2xl p-5 transition-all"
                  style={{
                    background: msg.isRead
                      ? "color-mix(in srgb, var(--surface-elevated) 18%, transparent)"
                      : "color-mix(in srgb, var(--clr-primary) 6%, transparent)",
                    border: msg.isRead
                      ? "0.5px solid var(--border-base)"
                      : "0.5px solid color-mix(in srgb, var(--clr-primary) 25%, transparent)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{msg.name}</span>
                        {!msg.isRead && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "var(--clr-primary)", color: "#fff" }}>
                            Mới
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                        <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>}
                        <span>{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkRead(msg.id)}
                          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-primary/20"
                          style={{ color: "var(--text-tertiary)" }}
                          title="Đánh dấu đã đọc"
                        >
                          <CheckCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(msg.id)}
                        className="p-2 rounded-lg transition-all cursor-pointer hover:bg-red-500/20"
                        style={{ color: "var(--text-tertiary)" }}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} variant="simple" />
        </Skeleton>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Xóa tin nhắn"
        message="Bạn có chắc muốn xóa tin nhắn này?"
      />
    </div>
  );
}
