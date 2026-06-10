"use client";

import { ClipboardList, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import DateFilter from "@/components/ui/DateFilter";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { adminService } from "@/service/admin.service";
import type { ActivityLogEntry } from "@/types/admin";
import { ACTION_LABELS, getActionDisplay, LogDetail } from "@/components/admin/ActivityLogComponents";
gsap.registerPlugin(ScrollTrigger);

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const limit = 30;
  const totalPages = Math.ceil(total / limit);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".admin-card");
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(items, { y: 20, opacity: 0 }, { y: 0, opacity: 1, force3D: true, duration: 0.4, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    adminService.getActivityLog(page, limit, dateFrom || undefined, dateTo || undefined, actionFilter || undefined).then((res) => {
      setLogs(res.logs);
      setTotal(res.total);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLogs();
  }, [page, dateFrom, dateTo, actionFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteActivityLog(deleteId);
      setDeleteId(null);
      fetchLogs();
    } catch {}
  };

  const handleDeleteAll = async () => {
    try {
      await adminService.deleteAllActivityLog();
      setDeleteAllOpen(false);
      fetchLogs();
    } catch {}
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-8xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <ClipboardList size={20} className="text-primary" /> Nhật ký hoạt động
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              {total} bản ghi
            </p>
          </div>
          {total > 0 && (
            <button
              onClick={() => setDeleteAllOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/20 text-danger text-[11px] hover:bg-danger/20 transition-all cursor-pointer"
            >
              <Trash2 size={12} /> Xoá tất cả
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <DateFilter
            from={dateFrom}
            to={dateTo}
            onFromChange={(v) => { setDateFrom(v); setPage(1); }}
            onToChange={(v) => { setDateTo(v); setPage(1); }}
          />
          {(dateFrom || dateTo || actionFilter) && (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); setActionFilter(""); setPage(1); }}
              className="px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer" style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)", color: "var(--text-tertiary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
            >
              Xoá lọc
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[{ value: "", label: "Tất cả" }, ...Object.entries(ACTION_LABELS).map(([value, info]) => ({ value, label: info.label }))].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setActionFilter(opt.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                actionFilter === opt.value
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "border border-transparent"
              }`}
              style={actionFilter !== opt.value ? { background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-tertiary)" } : undefined}
              onMouseEnter={actionFilter !== opt.value ? (e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; } : undefined}
              onMouseLeave={actionFilter !== opt.value ? (e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; e.currentTarget.style.color = "var(--text-tertiary)"; } : undefined}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Skeleton name="admin-table" loading={loading} rows={logs.length || 1}>
          {logs.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
              <ClipboardList size={40} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Chưa có hoạt động</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Chưa có hoạt động nào.</p>
            </div>
          ) : (
            <div ref={listRef} className="space-y-2">
              {logs.map((entry) => {
                const action = getActionDisplay(entry.action);
                const isExpanded = expandedId === entry.id;
                return (
                  <div
                    key={entry.id}
                    className="admin-card glass-strong card-hover cursor-pointer rounded-2xl border transition-all" style={{ borderColor: "var(--border-base)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--text-primary) 20%, transparent)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-base)"; }}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer text-left"
                        >
                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold shrink-0 ${action.color}`}
                            style={{ borderColor: action.borderColor }}
                          >
                            {action.icon}
                            {action.label}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {entry.user ? (
                                <>
                                  {entry.user.avatar ? (
                                    <img
                                      src={entry.user.avatar}
                                      alt=""
                                      className="size-5 rounded-full object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className="size-5 rounded-full bg-primary/25 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                                      {(entry.user.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="text-sm text-[var(--text-primary)] truncate">
                                    {entry.user.name || entry.user.email}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-[var(--text-tertiary)] italic">
                                  Người dùng đã xoá
                                </span>
                              )}
                              <ChevronDown
                                size={12}
                                className={`text-[var(--text-tertiary)] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </div>
                            {(() => {
                              const raw = entry.metadata as Record<string, unknown> | null;
                              if (!raw) return null;
                              const tn = String(raw.targetName ?? "");
                              const te = String(raw.targetEmail ?? "");
                              if (tn) {
                                return (
                                  <span className="text-[11px] text-[var(--text-tertiary)] ml-7">
                                    → {tn}
                                    {te && <> ({te})</>}
                                  </span>
                                );
                              }
                              const pc = String(raw.postContent ?? "");
                              if ((entry.action === "APPROVE_POST" || entry.action === "REJECT_POST") && pc) {
                                return <span className="text-[11px] text-[var(--text-tertiary)] ml-7 truncate max-w-md">"{pc}..."</span>;
                              }
                              const jt = String(raw.journalTitle ?? "");
                              if ((entry.action === "APPROVE_JOURNAL" || entry.action === "REJECT_JOURNAL") && jt) {
                                return <span className="text-[11px] text-[var(--text-tertiary)] ml-7 truncate max-w-md">"{jt}"</span>;
                              }
                              const st = String(raw.submissionTitle ?? "");
                              if ((entry.action === "APPROVE_SUBMISSION" || entry.action === "REJECT_SUBMISSION") && st) {
                                return <span className="text-[11px] text-[var(--text-tertiary)] ml-7 truncate max-w-md">"{st}"</span>;
                              }
                              return null;
                            })()}
                          </div>
                        </button>
                        <div className="flex items-center gap-2 shrink-0">
                          {entry.ip && (
                            <span className="text-[11px] text-[var(--text-tertiary)] font-mono hidden sm:inline">
                              {entry.ip}
                            </span>
                          )}
                          <span className="text-[11px] text-[var(--text-tertiary)]">
                            {new Date(entry.createdAt).toLocaleString("vi-VN")}
                          </span>
                          <button
                            onClick={() => setDeleteId(entry.id)}
                            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                            title="Xoá bản ghi"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t px-4 py-3 space-y-2" style={{ borderColor: "color-mix(in srgb, var(--text-primary) 6%, transparent)" }}>
                        <LogDetail entry={entry} />
                        {entry.resourceId && (
                          <p className="text-[11px] text-[var(--text-tertiary)]">
                            Resource ID: <span className="font-mono text-[var(--text-tertiary)]">{entry.resourceId}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xoá bản ghi"
        message="Bạn có chắc muốn xoá bản ghi này? Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
      />

      <ConfirmDialog
        open={deleteAllOpen}
        onCancel={() => setDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
        title="Xoá tất cả bản ghi"
        message={`Bạn có chắc muốn xoá toàn bộ ${total} bản ghi nhật ký? Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá tất cả"
        variant="danger"
      />
    </div>
  );
}
