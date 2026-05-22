"use client";

import { Search, Check, X } from "lucide-react";
import Image from "next/image";
import { useAdminPermissions } from "@/hook/admin/useAdminPermissions";
import { Skeleton } from "@/components/ui/Skeleton";

const ALL_PERMISSIONS = [
  {
    key: "approve_posts",
    label: "Duyệt bài viết",
    desc: "Phê duyệt và từ chối bài viết",
  },
  {
    key: "approve_journals",
    label: "Duyệt nhật ký",
    desc: "Phê duyệt và từ chối nhật ký",
  },
  {
    key: "approve_submissions",
    label: "Duyệt tác phẩm",
    desc: "Phê duyệt và từ chối tác phẩm",
  },
  {
    key: "manage_users",
    label: "Quản lý người dùng",
    desc: "Chặn, xoá, đổi vai trò người dùng",
  },
  {
    key: "manage_permissions",
    label: "Phân quyền",
    desc: "Gán và thu hồi quyền cho người dùng",
  },
];

export default function PermissionPage() {
  const {
    filtered,
    loading,
    search,
    savingId,
    setSearch,
    togglePermission,
    setAllPermissions,
  } = useAdminPermissions();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Phân quyền</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Gán quyền hạn cho người dùng
        </p>
      </div>

      <div className="mb-4 relative max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-[#0c1e3a]/60 border border-white/6 rounded-xl text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      <Skeleton
        name="admin-permissions"
        loading={loading}
        rows={filtered.length}
      >
        <div className="space-y-3">
          {filtered.map((u) => {
            const perms: string[] = Array.isArray(u.permissions)
              ? u.permissions
              : [];
            const isSaving = savingId === u.id;
            return (
              <div
                key={u.id}
                className="rounded-2xl bg-[#0c1e3a]/60 border border-white/6 p-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-full bg-linear-to-br from-primary/30 to-purple-500/30 flex items-center justify-center overflow-hidden shrink-0">
                    {u.avatar ? (
                      <Image
                        src={u.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-bold text-white/80">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{u.name}</p>
                    <p className="text-zinc-500 text-xs truncate">{u.email}</p>
                  </div>
                  {u.role === "admin" && (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setAllPermissions(
                          u.id,
                          perms.length === ALL_PERMISSIONS.length
                            ? []
                            : ALL_PERMISSIONS.map((p) => p.key),
                        )
                      }
                      disabled={isSaving}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {perms.length === ALL_PERMISSIONS.length
                        ? "Bỏ tất cả"
                        : "Tất cả"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ALL_PERMISSIONS.map((perm) => {
                    const active = perms.includes(perm.key);
                    return (
                      <button
                        key={perm.key}
                        onClick={() => togglePermission(u.id, perms, perm.key)}
                        disabled={isSaving}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:opacity-50 ${
                          active
                            ? "bg-primary/15 border-primary/30 text-primary"
                            : "bg-white/5 border-white/6 text-zinc-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {active ? <Check size={12} /> : <X size={12} />}
                        {perm.label}
                      </button>
                    );
                  })}
                </div>
                {perms.length > 0 && perms.length < ALL_PERMISSIONS.length && (
                  <p className="mt-2 text-[11px] text-zinc-600">
                    {perms
                      .map(
                        (p) => ALL_PERMISSIONS.find((a) => a.key === p)?.label,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Skeleton>
    </div>
  );
}
