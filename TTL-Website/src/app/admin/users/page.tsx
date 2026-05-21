"use client"

import { useEffect, useState, useCallback } from "react"
import { adminService } from "@/service/admin.service"
import type { User } from "@/service/api"
import { Search, Trash2, Shield, ShieldOff, X } from "lucide-react"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const limit = 20

  const fetchUsers = useCallback(async (p: number, s: string) => {
    setLoading(true)
    setError("")
    try {
      const res = await adminService.listUsers(p, limit, s || undefined)
      setUsers(res.users)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers(page, search)
  }, [page, fetchUsers])

  const handleSearch = () => {
    setPage(1)
    fetchUsers(1, search)
  }

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin"
    await adminService.updateUserRole(user.id, newRole)
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Xoá người dùng "${user.name}"?`)) return
    await adminService.deleteUser(user.id)
    setUsers((prev) => prev.filter((u) => u.id !== user.id))
    setTotal((t) => t - 1)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Tổng số: <span className="text-white font-medium">{total.toLocaleString("vi-VN")}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full bg-[#0c1e3a]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); fetchUsers(1, "") }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 rounded-xl bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all cursor-pointer"
        >
          Tìm kiếm
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-danger text-center py-20">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white/6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6 bg-[#0c1e3a]/40">
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Tên</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Vai trò</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Ngày tạo</th>
                  <th className="text-right px-4 py-3 text-zinc-400 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/6 hover:bg-white/[0.02] transition-colors">
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
                        {user.role === "admin" ? <Shield size={12} /> : <ShieldOff size={12} />}
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
                          className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                          title={user.role === "admin" ? "Huỷ quyền admin" : "Cấp quyền admin"}
                        >
                          <Shield size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                          title="Xoá người dùng"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-1">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-zinc-600 px-1">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                        p === page
                          ? "bg-primary text-white font-medium"
                          : "text-zinc-400 hover:text-white hover:bg-white/6"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
