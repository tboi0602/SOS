"use client";

import { Bell, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import { useNotifications } from "@/hook/notifications/useNotifications";

export default function NotificationsPage() {
  const { notifications, loading, page, total, totalPages, setPage, markRead, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6" style={{ borderBottom: "1px solid var(--border-base)" }}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
              <Bell size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
                THÔNG BÁO
              </h1>
              <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">
                {total} thông báo
              </p>
            </div>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}
            >
              <Check size={12} /> Đọc tất cả
            </button>
          )}
        </div>

        <Skeleton
          name="admin-table"
          loading={loading}
          rows={notifications.length || 3}
        >
          {notifications.length === 0 ? (
            <div className="text-center py-20 rounded-3xl"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}>
              <Bell size={32} className="text-[var(--text-tertiary)] mx-auto mb-3" />
              <p className="text-[var(--text-tertiary)] text-sm">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${n.isRead ? "border-[var(--border-base)]" : "border-primary/20"}`}
                  style={{
                    background: n.isRead ? "color-mix(in srgb, var(--surface-elevated) 18%, transparent)" : "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
                    boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!n.isRead && (
                          <span className="size-2 rounded-full bg-primary shrink-0" />
                        )}
                        <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {n.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                        {n.content}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-2">
                        {new Date(n.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                          title="Đánh dấu đã đọc"
                        >
                          <Check size={13} />
                        </button>
                      )}
                    </div>
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
