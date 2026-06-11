"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { journalService } from "@/service/journal.service";
import type { JournalEntry } from "@/service/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchEntries = useCallback(
    async (p?: number) => {
      setLoading(true);
      try {
        const res = await journalService.getMyEntries({
          page: p ?? page,
          limit: 10,
          status: filter,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        });
        setEntries(res.entries);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        if (res.counts) setCounts(res.counts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filter, dateFrom, dateTo, page],
  );


  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchEntries();
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetchEntries]);
  
  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const target = ev.target;
        if (target?.result)
          setPreviews((prev) => [...prev, target.result as string]);
      };
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setCreating(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        setUploading(true);
        const res = await journalService.uploadMedia(images);
        imageUrls = res.urls;
        setUploading(false);
      }
      await journalService.create({
        title: title.trim(),
        content: content.trim(),
        images: imageUrls,
      });
      setTitle("");
      setContent("");
      setImages([]);
      setPreviews([]);
      setShowCreate(false);
      setPage(1);
      fetchEntries(1);
    } catch {
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await journalService.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
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

  const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);

  const getImgUrl = (url: string) =>
    url.startsWith("http") ? url : `${API_URL}${url}`;

  return {
    entries,
    loading,
    showCreate,
    setShowCreate,
    title,
    setTitle,
    content,
    setContent,
    images,
    previews,
    uploading,
    creating,
    fileRef,
    handleSelectFiles,
    removeImage,
    handleCreate,
    handleDelete,
    totalPoints,
    getImgUrl,
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
