"use client";

import { useAdminPermissions } from "@/hook/admin/useAdminPermissions";
import { Skeleton } from "@/components/ui/Skeleton";
import { Shield, ShieldCheck, ShieldOff, Search, X } from "lucide-react";
import { useState } from "react";

const ALL_PERMS = [
  { key: "approve_posts", label: "Duyệt bài viết" },
  { key: "approve_journals", label: "Duyệt nhật ký" },
  { key: "approve_submissions", label: "Duyệt tác phẩm" },
  { key: "manage_users", label: "Quản lý người dùng" },
  { key: "manage_permissions", label: "Phân quyền" },
  { key: "manage_notifications", label: "Quản lý thông báo" },
  { key: "manage_lessons", label: "Quản lý bài học" },
  { key: "manage_posts", label: "Quản lý bài đăng" },
];

export default function PermissionsPage() {
  const { filtered, loading, search, savingId, setSearch, togglePermission } = useAdminPermissions();
  const [searchInput, setSearchInput] = useState(search);

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Phân quyền</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Quản lý quyền truy cập thành viên</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
          placeholder="Tìm kiếm thành viên..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
          style={{ background: "var(--surface-elevated)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }}
        />
        {searchInput && (
          <button onClick={() => { setSearchInput(""); setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
            <X size={14} />
          </button>
        )}
      </div>

      <Skeleton name="permissions" loading={loading}>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
              <Shield size={40} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Không tìm thấy</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Không tìm thấy thành viên nào.</p>
            </div>
          ) : (
            filtered.map((user) => {
              const perms: string[] = Array.isArray(user.permissions) ? user.permissions : [];
              return (
                <div key={user.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl flex items-center justify-center bg-accent/10">
                        <Shield size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{user.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: user.role === "admin" ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : "color-mix(in srgb, var(--text-primary) 10%, transparent)", color: user.role === "admin" ? "var(--color-accent)" : "var(--text-tertiary)" }}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_PERMS.map((p) => {
                      const active = perms.includes(p.key);
                      return (
                        <button
                          key={p.key}
                          onClick={() => togglePermission(user.id, perms, p.key)}
                          disabled={savingId === user.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                          style={{
                            background: active ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                            border: `0.5px solid ${active ? "var(--color-accent)" : "var(--border-base)"}`,
                            color: active ? "var(--color-accent)" : "var(--text-tertiary)",
                          }}
                        >
                          {active ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Skeleton>
    </div>
  );
}
