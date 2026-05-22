"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/service/admin.service";
import type { JournalEntry } from "@/service/api";

export function useAdminJournals() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listPendingJournals(page, limit);
      setEntries(res.entries);
      setTotal(res.total);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi tải danh sách nhật ký",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [page, toast]);


  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetch();
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetch]);
  
  const approve = async (id: string, adminNote?: string) => {
    try {
      await adminService.approveJournal(id, adminNote);
      toast("Đã duyệt nhật ký", "success");
      await fetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi duyệt nhật ký", "error");
    }
  };

  const reject = async (id: string, adminNote?: string) => {
    try {
      await adminService.rejectJournal(id, adminNote);
      toast("Đã từ chối nhật ký", "success");
      await fetch();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi từ chối nhật ký",
        "error",
      );
    }
  };

  return {
    entries,
    loading,
    total,
    page,
    setPage,
    limit,
    approve,
    reject,
    refetch: fetch,
  };
}
