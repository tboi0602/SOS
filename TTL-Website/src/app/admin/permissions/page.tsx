"use client";

import { useAdminPermissions } from "@/hook/admin/useAdminPermissions";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { Shield, ShieldCheck, ShieldOff, Search, X, Pencil, Save } from "lucide-react";
import { useState } from "react";

const DEFAULT_PERMS = [
  { key: "manage_content", label: "Quản lý nội dung", description: "Duyệt bài viết, xoá bài viết" },
  { key: "manage_users", label: "Quản lý người dùng", description: "Chặn/Xoá người dùng, đổi quyền" },
  { key: "manage_notifications", label: "Quản lý thông báo", description: "Gửi thông báo hệ thống" },
  { key: "manage_lessons", label: "Quản lý bài học", description: "Quản lý nội dung elearning" },
];

const STORAGE_KEY = "admin_permission_descriptions";

function loadDescriptions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Record<string, string>;
  } catch {}
  return {} as Record<string, string>;
}

export default function PermissionsPage() {
  const { filtered, loading, search, savingId, setSearch, togglePermission } = useAdminPermissions();
  const [searchInput, setSearchInput] = useState(search);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>(loadDescriptions);
  const { toast } = useToast();

  const desc = (key: string) => drafts[key] || DEFAULT_PERMS.find((p) => p.key === key)?.description || "";

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Phân quyền</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Quản lý quyền truy cập thành viên</p>
        </div>
        <button onClick={() => setEditing(!editing)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
          style={{ background: editing ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: editing ? "var(--color-accent)" : "var(--text-tertiary)" }}>
          <Pencil size={14} />
          {editing ? "Đóng" : "Sửa mô tả"}
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Sửa mô tả quyền</h3>
          {DEFAULT_PERMS.map((p) => (
            <div key={p.key} className="flex items-center gap-3">
              <label className="text-sm font-medium w-40 shrink-0" style={{ color: "var(--text-tertiary)" }}>{p.label}</label>
              <input value={drafts[p.key] ?? p.description}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [p.key]: e.target.value }))}
                placeholder={p.description}
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }} />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setDrafts(loadDescriptions()); setEditing(false) }}
              className="px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
              style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", color: "var(--text-tertiary)" }}>
              Huỷ
            </button>
            <button onClick={() => {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
              setEditing(false);
              toast("Đã lưu mô tả quyền", "success");
            }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
              style={{ background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", color: "var(--color-accent)" }}>
              <Save size={14} />
              Lưu
            </button>
          </div>
        </div>
      )}

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
                    {DEFAULT_PERMS.map((p) => {
                      const active = perms.includes(p.key);
                      return (
                        <button
                          key={p.key}
                          onClick={() => togglePermission(user.id, perms, p.key)}
                          disabled={savingId === user.id}
                          title={desc(p.key)}
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
