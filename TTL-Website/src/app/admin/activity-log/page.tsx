"use client";

import {
  ClipboardList, Shield, ShieldOff, UserCog, Ban,
  CheckCircle, XCircle, BookOpen, Video,
  ChevronDown, Trash2, ExternalLink,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import DateFilter from "@/components/ui/DateFilter";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { adminService } from "@/service/admin.service";
import type { ActivityLogEntry } from "@/types/admin";
gsap.registerPlugin(ScrollTrigger);

const ACTION_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string; borderColor: string }> = {
  BLOCK_USER: {
    label: "Chặn người dùng",
    icon: <Ban size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
  UNBLOCK_USER: {
    label: "Bỏ chặn người dùng",
    icon: <ShieldOff size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  UPDATE_PERMISSIONS: {
    label: "Cập nhật quyền",
    icon: <UserCog size={12} />,
    color: "text-amber-400 bg-amber-500/10",
    borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)",
  },
  UPDATE_ROLE: {
    label: "Cập nhật vai trò",
    icon: <Shield size={12} />,
    color: "text-purple-400 bg-purple-500/10",
    borderColor: "color-mix(in srgb, var(--color-accent) 20%, transparent)",
  },
  APPROVE_POST: {
    label: "Duyệt bài viết",
    icon: <CheckCircle size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  REJECT_POST: {
    label: "Từ chối bài viết",
    icon: <XCircle size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
  APPROVE_JOURNAL: {
    label: "Duyệt nhật ký",
    icon: <BookOpen size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  REJECT_JOURNAL: {
    label: "Từ chối nhật ký",
    icon: <XCircle size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
  APPROVE_SUBMISSION: {
    label: "Duyệt tác phẩm",
    icon: <Video size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  REJECT_SUBMISSION: {
    label: "Từ chối tác phẩm",
    icon: <XCircle size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
};

function getActionDisplay(action: string) {
  return (
    ACTION_LABELS[action] ?? {
      label: action,
      icon: <ClipboardList size={12} />,
      color: "text-tertiary bg-white/5",
      borderColor: "color-mix(in srgb, var(--text-primary) 10%, transparent)",
    }
  );
}

function LogDetail({ entry }: { entry: ActivityLogEntry }) {
  const m = entry.metadata as Record<string, unknown> | null;
  if (!m) return null;

  const targetName = String(m.targetName ?? "");
  const targetEmail = String(m.targetEmail ?? "");

  if (entry.action === "BLOCK_USER" || entry.action === "UNBLOCK_USER") {
    return (
          <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {targetName && <p>Người dùng: <span style={{ color: "var(--text-secondary)" }}>{targetName}</span></p>}
        {targetEmail && <p>Email: <span style={{ color: "var(--text-secondary)" }}>{targetEmail}</span></p>}
      </div>
    );
  }

  if (entry.action === "UPDATE_PERMISSIONS") {
    const perms = Array.isArray(m.permissions) ? (m.permissions as string[]) : [];
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {targetName && <p>Người dùng: <span style={{ color: "var(--text-secondary)" }}>{targetName}</span></p>}
        {targetEmail && <p>Email: <span style={{ color: "var(--text-secondary)" }}>{targetEmail}</span></p>}
        <p>
          Quyền mới:{" "}
          {perms.length > 0
            ? perms.map((p) => (
                <span key={p} className="inline-block px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] mr-1">
                  {p === "approve_posts" ? "Duyệt bài" : p === "approve_journals" ? "Duyệt nhật ký" : p === "approve_submissions" ? "Duyệt tác phẩm" : p === "manage_users" ? "Quản lý user" : p === "manage_permissions" ? "Phân quyền" : p === "manage_notifications" ? "Thông báo" : p === "manage_lessons" ? "Bài học" : p === "manage_posts" ? "Bài đăng" : p}
                </span>
              ))
            : <span className="italic" style={{ color: "var(--text-tertiary)" }}>Không có</span>}
        </p>
      </div>
    );
  }

  if (entry.action === "APPROVE_POST" || entry.action === "REJECT_POST") {
    const postContent = String(m.postContent ?? "");
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {postContent && <p>Nội dung: <span style={{ color: "var(--text-secondary)" }}>"{postContent}"...</span></p>}
        <a
          href={`/home/posts/${entry.resourceId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light underline mt-1"
        >
          <ExternalLink size={10} /> Xem bài viết
        </a>
      </div>
    );
  }

  if (entry.action === "APPROVE_JOURNAL" || entry.action === "REJECT_JOURNAL") {
    const journalTitle = String(m.journalTitle ?? "");
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {journalTitle && <p>Tiêu đề: <span style={{ color: "var(--text-secondary)" }}>"{journalTitle}"</span></p>}
        <a
          href={`/admin/journals`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light underline mt-1"
        >
          <ExternalLink size={10} /> Xem trong danh sách nhật ký
        </a>
      </div>
    );
  }

  if (entry.action === "APPROVE_SUBMISSION" || entry.action === "REJECT_SUBMISSION") {
    const submissionTitle = String(m.submissionTitle ?? "");
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {submissionTitle && <p>Tiêu đề: <span style={{ color: "var(--text-secondary)" }}>"{submissionTitle}"</span></p>}
        <a
          href={`/admin/submissions`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light underline mt-1"
        >
          <ExternalLink size={10} /> Xem trong danh sách tác phẩm
        </a>
      </div>
    );
  }

  return null;
}

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
