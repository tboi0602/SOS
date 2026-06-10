"use client";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle,
  FileText,
  BookOpen,
  Video,
  Users,
  Award,
} from "lucide-react";
import Image from "next/image";
import { SortHeader } from "@/components/admin/SortHeader";

const PERMISSION_LABELS: Record<string, string> = {
  approve_posts: "Duyệt bài",
  approve_journals: "Duyệt nhật ký",
  approve_submissions: "Duyệt tác phẩm",
  manage_users: "Quản lý user",
  manage_permissions: "Phân quyền",
  manage_notifications: "Thông báo",
  manage_lessons: "Bài học",
  manage_posts: "Bài đăng",
};

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  totalScore: number;
  postCount: number;
  submissionCount: number;
  journalCount: number;
  isActive: boolean;
  permissions: string[];
}

export default function MemberTable({
  search,
  onSearchChange,
  sortedLength,
  sortKey,
  sortDir,
  onSort,
  paged,
  page,
  totalPages,
  onPageChange,
  onBlock,
  onUnblock,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  sortedLength: number;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (column: string) => void;
  paged: Member[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBlock: (id: string, name: string) => void;
  onUnblock: (id: string, name: string) => void;
}) {
  return (
    <>
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-colors"
            style={{ background: "var(--surface-elevated)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-base)"}
          />
        </div>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {sortedLength} thành viên
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl" style={{ border: "0.5px solid var(--border-base)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--surface-strong)" }}>
              <SortHeader
                column="name"
                label="Thành viên"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="role"
                label="Vai trò"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="kyLuat"
                label="Kỷ luật"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="daoDuc"
                label="Đạo đức"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="truyenCamHung"
                label="Cảm hứng"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="totalScore"
                label="Tổng"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="postCount"
                label="Bài viết"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="submissionCount"
                label="Tác phẩm"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="journalCount"
                label="Nhật ký"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <SortHeader
                column="isActive"
                label="Trạng thái"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Quyền
              </th>
              <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: "var(--text-tertiary)" }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-base)]">
            {paged.map((m) => (
              <tr
                key={m.id}
                className="member-row transition-colors group"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 3%, transparent)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td className="px-3 py-3 min-w-50">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden shrink-0">
                      {m.avatar ? (
                        <Image
                          src={m.avatar}
                          alt=""
                          width={36}
                          height={36}
                          className="size-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                          {m.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {m.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                        {m.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                   className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.role === "admin" ? "bg-accent/15 text-accent" : ""}`}
                   style={m.role !== "admin" ? { background: "var(--surface-elevated)", color: "var(--text-secondary)" } : {}}
                  >
                    {m.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>{m.kyLuat}</td>
                <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>{m.daoDuc}</td>
                <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>{m.truyenCamHung}</td>
                <td className="px-3 py-3">
                  <span
                     className="font-semibold"
                     style={{ color: m.totalScore > 0 ? "var(--text-primary)" : "var(--text-tertiary)" }}
                  >
                    {m.totalScore}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <FileText size={12} style={{ color: "var(--text-tertiary)" }} />
                    <span style={{ color: "var(--text-primary)" }}>{m.postCount}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <Video size={12} style={{ color: "var(--text-tertiary)" }} />
                    <span style={{ color: "var(--text-primary)" }}>{m.submissionCount}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} style={{ color: "var(--text-tertiary)" }} />
                    <span style={{ color: "var(--text-primary)" }}>{m.journalCount}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {m.isActive ? (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="text-xs text-danger bg-danger/10 px-2 py-0.5 rounded-full font-medium">
                      Chưa kích hoạt
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {m.permissions && m.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {m.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-1.5 py-0.5 rounded-full border"
                          style={{ background: "var(--surface-elevated)", borderColor: "var(--border-base)", color: "var(--text-secondary)" }}
                        >
                          {PERMISSION_LABELS[p] || p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {m.isActive ? (
                      <button
                        onClick={() => onBlock(m.id, m.name)}
                        className="p-1.5 rounded-lg transition-all cursor-pointer"
                        style={{ color: "var(--text-dim)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--color-danger) 10%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
                        title="Chặn"
                      >
                        <Ban size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onUnblock(m.id, m.name)}
                        className="p-1.5 rounded-lg transition-all cursor-pointer"
                        style={{ color: "var(--text-dim)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-success)"; e.currentTarget.style.background = "color-mix(in srgb, var(--color-success) 10%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
                        title="Bỏ chặn"
                      >
                        <CheckCircle size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 6%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 6%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
