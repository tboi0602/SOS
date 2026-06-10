"use client";

import { Search, X, Shield, ShieldOff, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import Pagination from "@/components/admin/Pagination";
import { useAdminUsers } from "@/hook/admin/useAdminUsers";

export default function UserPage() {
  const {
    users,
    total,
    page,
    totalPages,
    search,
    loading,
    deleteTarget,
    deleting,
    setSearch,
    setPage,
    setDeleteTarget,
    handleSearch,
    clearSearch,
    handleRoleToggle,
    handleDelete,
  } = useAdminUsers();

  return (
    <div className="p-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Quản lý người dùng</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Tổng số:{" "}
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            {total.toLocaleString("vi-VN")}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-tertiary)" }}
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full bg-[var(--surface-elevated)]/60 border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
            style={{ color: "var(--text-primary)", borderColor: "var(--border-base)" }}
          />
          {search && (
            <button
              onClick={clearSearch}
              aria-label="Xoá tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
        >
          Tìm kiếm
        </button>
      </div>

      <Skeleton name="admin-users" loading={loading}>
        <>
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border-base)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[var(--surface-elevated)]/40" style={{ borderColor: "var(--border-base)" }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Tên
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Vai trò
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Ngày tạo
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors"
                    style={{ borderColor: "var(--border-base)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 2%, transparent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{user.name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--text-tertiary)" }}>{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-primary/15 text-primary"
                            : ""
                        }`}
                        style={user.role !== "admin" ? { background: "color-mix(in srgb, var(--text-primary) 10%, transparent)", color: "var(--text-tertiary)" } : undefined}
                      >
                        {user.role === "admin" ? (
                          <Shield size={12} />
                        ) : (
                          <ShieldOff size={12} />
                        )}
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Chưa kích hoạt"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          aria-label={
                            user.role === "admin"
                              ? "Huỷ quyền admin"
                              : "Cấp quyền admin"
                          }
                          className="p-2 rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          style={{ color: "var(--text-tertiary)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 10%, transparent)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
                        >
                          <Shield size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          aria-label={`Xoá người dùng ${user.name}`}
                          className="p-2 rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                          style={{ color: "var(--text-tertiary)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--danger) 10%, transparent)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      </Skeleton>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Xoá người dùng"
        message={`Bạn có chắc muốn xoá "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
