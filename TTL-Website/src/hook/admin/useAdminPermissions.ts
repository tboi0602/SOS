"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/service/admin.service";
import type { User } from "@/service/api";

export function useAdminPermissions() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.listUsers(1, 100);
      setUsers(res.users);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi tải danh sách người dùng",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchUsers();
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetchUsers]);

  const togglePermission = async (
    userId: string,
    currentPerms: string[],
    perm: string,
  ) => {
    setSavingId(userId);
    const updated = currentPerms.includes(perm)
      ? currentPerms.filter((p) => p !== perm)
      : [...currentPerms, perm];
    try {
      await adminService.updateUserPermissions(userId, updated);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, permissions: updated } : u)),
      );
      toast(
        updated.includes(perm) ? "Đã thêm quyền" : "Đã thu hồi quyền",
        "success",
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi cập nhật quyền", "error");
    } finally {
      setSavingId(null);
    }
  };

  const setAllPermissions = async (userId: string, perms: string[]) => {
    setSavingId(userId);
    try {
      await adminService.updateUserPermissions(userId, perms);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, permissions: perms } : u)),
      );
      toast("Đã cập nhật quyền", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi cập nhật quyền", "error");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return {
    users,
    filtered,
    loading,
    search,
    savingId,
    setSearch,
    togglePermission,
    setAllPermissions,
  };
}
