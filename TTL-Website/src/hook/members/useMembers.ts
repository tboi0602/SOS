"use client";

import { useState, useEffect } from "react";
import { api, type MemberListResponse } from "@/service/api";

export function useMembers() {
  const [data, setData] = useState<MemberListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadMembers = async () => {
      setLoading(true);
      try {
        const res = await api.profile.listMembers(page, 50);
        if (active) {
          setData(res);
        }
      } catch {
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMembers();

    return () => {
      active = false;
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
