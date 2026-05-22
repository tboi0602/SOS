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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Tổng số:{" "}
          <span className="text-white font-medium">
            {total.toLocaleString("vi-VN")}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full bg-[#0c1e3a]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/50 transition-colors"
          />
          {search && (
            <button
              onClick={clearSearch}
              aria-label="Xoá tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 rounded-xl bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Tìm kiếm
        </button>
      </div>

      <Skeleton name="admin-users" loading={loading}>
        <>
          <div className="overflow-x-auto rounded-2xl border border-white/6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6 bg-[#0c1e3a]/40">
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">
                    Tên
                  </th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">
                    Vai trò
                  </th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">
                    Ngày tạo
                  </th>
                  <th className="text-right px-4 py-3 text-zinc-400 font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/6 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3 text-white">{user.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-primary/15 text-primary"
                            : "bg-zinc-500/15 text-zinc-400"
                        }`}
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
                    <td className="px-4 py-3 text-zinc-500 text-xs">
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
                          className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                          <Shield size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          aria-label={`Xoá người dùng ${user.name}`}
                          className="p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
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
