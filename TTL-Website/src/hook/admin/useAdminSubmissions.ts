"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/service/admin.service";
import type { Submission } from "@/service/api";

export function useAdminSubmissions() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listPendingSubmissions(page, limit);
      setSubmissions(res.submissions);
      setTotal(res.total);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi tải danh sách tác phẩm",
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
      await adminService.approveSubmission(id, adminNote);
      toast("Đã duyệt tác phẩm", "success");
      await fetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi duyệt tác phẩm", "error");
    }
  };

  const reject = async (id: string, adminNote?: string) => {
    try {
      await adminService.rejectSubmission(id, adminNote);
      toast("Đã từ chối tác phẩm", "success");
      await fetch();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi từ chối tác phẩm",
        "error",
      );
    }
  };

  return {
    submissions,
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
