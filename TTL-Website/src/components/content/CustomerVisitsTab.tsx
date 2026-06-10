"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Trash2, Upload, Loader2, X, ImageIcon, Clock, CheckCircle } from "lucide-react";
import { uploadFiles } from "@/service/client";
import ContentListLayout from "@/components/ui/ContentListLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface VisitImage {
  id: string;
  userId: string;
  imageUrl: string;
  description: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function CustomerVisitsTab() {
  const [images, setImages] = useState<VisitImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<VisitImage | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/customer-visits`, { credentials: "include" });
      const data = await res.json();
      setImages(data.images ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages() }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      await uploadFiles("/api/v1/customer-visits/upload", Array.from(files), "images");
      await fetchImages();
    } catch {
      // ignore
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/v1/customer-visits/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      // ignore
    }
  };

  const counts = {
    "": images.length,
    pending: images.filter((i) => i.status === "PENDING").length,
    approved: images.filter((i) => i.status === "APPROVED").length,
  };

  const [filter, setFilter] = useState("");
  const filtered = filter
    ? images.filter((i) => i.status === filter.toUpperCase())
    : images;

  return (
    <>
      <ContentListLayout
        header={{
          title: "Gặp khách hàng",
          subtitle: "Tải ảnh gặp gỡ khách hàng để tích lũy điểm thưởng",
          icon: Camera,
          createLabel: uploading ? "Đang tải..." : "Tải ảnh lên",
          onCreate: () => fileRef.current?.click(),
        }}
        stats={[
          { label: "Tổng ảnh", value: images.length, icon: ImageIcon, iconBg: "bg-accent/10", iconColor: "text-accent" },
          { label: "Chờ duyệt", value: counts.pending, icon: Clock, iconBg: "bg-yellow-400/10", iconColor: "text-yellow-400" },
          { label: "Đã duyệt", value: counts.approved, icon: CheckCircle, iconBg: "bg-green-400/10", iconColor: "text-green-400" },
        ]}
        filters={[
          { key: "", label: "Tất cả", icon: Camera },
          { key: "pending", label: "Chờ duyệt", icon: Clock },
          { key: "approved", label: "Đã duyệt", icon: CheckCircle },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
        dateFrom=""
        dateTo=""
        onFromChange={() => {}}
        onToChange={() => {}}
        skeletonName="customer-visits"
        items={filtered}
        loading={loading}
      >
        <input ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif" onChange={handleUpload} className="hidden" />
        {uploading && (
          <div className="flex items-center justify-center py-4 gap-2" style={{ color: "var(--text-tertiary)" }}>
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Đang tải ảnh lên...</span>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 60}ms`, boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}
              onClick={() => setSelected(img)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px color-mix(in srgb, var(--clr-primary) 20%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)"; }}
            >
              <img src={`${API_URL}${img.imageUrl}`} alt={img.description || "Customer visit"} className="size-full object-cover" loading="lazy" />
              {img.status !== "APPROVED" && (
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                    img.status === "PENDING"
                      ? "bg-yellow-400/80 text-black"
                      : "bg-red-400/80 text-white"
                  }`}>
                    {img.status === "PENDING" ? "Chờ duyệt" : "Từ chối"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <button onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }} className="size-9 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-red-600">
                  <Trash2 size={15} style={{ color: "#fff" }} />
                </button>
              </div>
              {img.description && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] text-white/90 truncate">{img.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ContentListLayout>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
            style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 size-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
              <X size={16} style={{ color: "#fff" }} />
            </button>
            <img src={`${API_URL}${selected.imageUrl}`} alt={selected.description || "Customer visit"} className="w-full max-h-[70vh] object-contain" />
            <div className="p-4 border-t" style={{ borderColor: "var(--border-base)" }}>
              <div className="flex items-center gap-2 mb-1">
                {selected.status !== "APPROVED" && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    selected.status === "PENDING"
                      ? "bg-yellow-400/80 text-black"
                      : "bg-red-400/80 text-white"
                  }`}>
                    {selected.status === "PENDING" ? "Chờ duyệt" : "Từ chối"}
                  </span>
                )}
                {selected.status === "APPROVED" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/80 text-black text-[10px] font-medium">
                    Đã duyệt
                  </span>
                )}
              </div>
              {selected.description && <p className="text-sm" style={{ color: "var(--text-primary)" }}>{selected.description}</p>}
              <p className="text-[10px] mt-1 font-mono" style={{ color: "var(--text-tertiary)" }}>{new Date(selected.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div className="flex justify-end p-3 border-t gap-2" style={{ borderColor: "var(--border-base)" }}>
              <button onClick={() => { handleDelete(selected.id); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                style={{ background: "color-mix(in srgb, var(--color-red-500) 15%, transparent)", color: "var(--color-red-500)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-red-500) 25%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-red-500) 15%, transparent)"; }}
              >
                <Trash2 size={13} /> Xoá ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
