"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { adminService, type CustomerVisitImageAdmin } from "@/service/admin.service";

export function useAdminCustomerVisitImages() {
  const { toast } = useToast();
  const [images, setImages] = useState<CustomerVisitImageAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listCustomerVisitImages(
        statusFilter === "ALL" ? undefined : statusFilter,
      );
      setImages(res.images);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Lỗi tải danh sách ảnh",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetch();
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetch]);

  const approve = async (id: string) => {
    try {
      await adminService.reviewCustomerVisitImage(id, "APPROVED");
      toast("Đã duyệt ảnh", "success");
      await fetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi duyệt ảnh", "error");
    }
  };

  const reject = async (id: string) => {
    try {
      await adminService.reviewCustomerVisitImage(id, "REJECTED");
      toast("Đã từ chối ảnh", "success");
      await fetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi từ chối ảnh", "error");
    }
  };

  return {
    images,
    loading,
    statusFilter,
    setStatusFilter,
    approve,
    reject,
    refetch: fetch,
  };
}
