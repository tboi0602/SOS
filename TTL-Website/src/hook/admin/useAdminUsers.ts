"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/service/admin.service";
import type { User } from "@/service/api";

export function useAdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 20;

  const fetchUsers = useCallback(async (p: number, s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.listUsers(p, limit, s || undefined);
      setUsers(res.users);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchUsers(page, search);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [page, search, fetchUsers]);

  useEffect(() => {
    if (error) toast(error, "error");
  }, [error, toast]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, search);
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
    fetchUsers(1, "");
  };

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await adminService.updateUserRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
      toast("Đã cập nhật vai trò", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi cập nhật vai trò",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      toast("Đã xoá người dùng", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá người dùng", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return {
    users,
    total,
    page,
    totalPages,
    search,
    loading,
    error,
    deleteTarget,
    deleting,
    limit,
    setSearch,
    setPage,
    setDeleteTarget,
    handleSearch,
    clearSearch,
    handleRoleToggle,
    handleDelete,
    fetchUsers,
  };
}
