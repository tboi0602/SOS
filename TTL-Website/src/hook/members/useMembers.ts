"use client";

import { useState, useEffect } from "react";
import { profileService } from "@/service/profile.service";
import type { MemberListResponse } from "@/service/api";

export function useMembers() {
  const [data, setData] = useState<MemberListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const id = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await profileService.listMembers(page, 50);
        if (active) setData(res);
      } catch {
      } finally {
        if (active) setLoading(false);
      }
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, [page]);

  const filtered = data?.members.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  return {
    data,
    page,
    setPage,
    search,
    setSearch,
    loading,
    filtered,
    totalPages: data?.totalPages ?? 1,
  };
}
