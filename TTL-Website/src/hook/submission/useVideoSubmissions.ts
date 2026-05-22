"use client";

import { useState, useEffect, useCallback } from "react";
import { submissionService } from "@/service/submission.service";
import type { Submission } from "@/service/api";

export function useVideoSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [penalty, setPenalty] = useState<{ penalized: boolean; daysOverdue: number; deducted?: number } | null>(null);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchSubmissions = useCallback(async (p?: number) => {
    setLoading(true);
    try {
      const res = await submissionService.getMySubmissions({
        page: p ?? page,
        limit: 10,
        status: filter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setSubmissions(res.submissions);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      if (res.counts) setCounts(res.counts);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [filter, dateFrom, dateTo, page]);

  const checkPenalty = useCallback(async () => {
    try {
      const res = await submissionService.checkPenalty();
      setPenalty(res);
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    const id = window.setTimeout(async () => {
      if (!active) return;
      await Promise.all([fetchSubmissions(), checkPenalty()]);
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, [fetchSubmissions, checkPenalty]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await submissionService.create({
        title: title.trim(),
        videoUrl: videoUrl.trim() || undefined,
        note: note.trim() || undefined,
      });
      setTitle("");
      setVideoUrl("");
      setNote("");
      setPage(1);
      await fetchSubmissions(1);
      await checkPenalty();
    } catch {
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await submissionService.delete(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  };

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setPage(1);
  };

  const handleDateFromChange = (v: string) => {
    setDateFrom(v);
    setPage(1);
  };

  const handleDateToChange = (v: string) => {
    setDateTo(v);
    setPage(1);
  };

  const totalPoints = submissions.reduce((sum, s) => sum + s.points, 0);

  return {
    submissions,
    loading,
    title,
    setTitle,
    videoUrl,
    setVideoUrl,
    note,
    setNote,
    creating,
    handleCreate,
    handleDelete,
    penalty,
    totalPoints,
    filter,
    handleFilterChange,
    dateFrom,
    handleDateFromChange,
    dateTo,
    handleDateToChange,
    counts,
    page,
    totalPages,
    total,
    setPage,
  };
}
