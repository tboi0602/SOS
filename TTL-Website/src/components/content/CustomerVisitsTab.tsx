"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Trash2,
  Loader2,
  X,
  ImageIcon,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Sparkles,
} from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalFiles, setModalFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/customer-visits`, {
        credentials: "include",
      });
      const data = await res.json();
      setImages(data.images ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSubmit = async () => {
    if (!modalFiles.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      modalFiles.forEach((f) => formData.append("images", f));
      if (modalContent.trim())
        formData.append("description", modalContent.trim());
      const res = await fetch(`${API_URL}/api/v1/customer-visits/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload thất bại");
      setShowModal(false);
      setModalContent("");
      setModalFiles([]);
      await fetchImages();
    } catch {
      // ignore
    } finally {
      setUploading(false);
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
    rejected: images.filter((i) => i.status === "REJECTED").length,
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
          subtitle:
            "Ghi lại nội dung gặp gỡ khách hàng để tích lũy điểm thưởng",
          icon: Camera,
          createLabel: "Thêm buổi gặp",
          onCreate: () => setShowModal(true),
        }}
        stats={[
          {
            label: "Tổng số",
            value: images.length,
            icon: ImageIcon,
            iconBg: "bg-accent/10",
            iconColor: "text-accent",
          },
          {
            label: "Điểm",
            value: counts.approved * 2,
            icon: Sparkles,
            iconBg: "bg-amber-400/10",
            iconColor: "text-amber-400",
            valueColor: "text-amber-400",
          },
        ]}
        filters={[
          { key: "", label: "Tất cả", icon: Camera },
          { key: "pending", label: "Chờ duyệt", icon: Clock },
          { key: "approved", label: "Đã duyệt", icon: CheckCircle },
          { key: "rejected", label: "Từ chối", icon: XCircle },
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
        createForm={
          showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { if (!uploading) { setShowModal(false); setModalContent(""); setModalFiles([]); } }} />
              <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--surface-elevated)] backdrop-blur-xl border border-[var(--border-base)] shadow-2xl shadow-primary/10 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Camera size={16} className="text-primary" /> Thêm buổi gặp khách hàng
                  </h2>
                  <button
                    type="button"
                    onClick={() => { if (!uploading) { setShowModal(false); setModalContent(""); setModalFiles([]); } }}
                    className="size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={modalContent}
                    onChange={(e) => setModalContent(e.target.value)}
                    placeholder="Viết nội dung buổi gặp khách hàng..."
                    rows={3}
                    className="w-full bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-primary/30 transition-colors resize-none"
                  />
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp,.gif"
                      onChange={(e) => { const fs = e.target.files; if (fs?.length) setModalFiles(Array.from(fs)); }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      style={{
                        background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
                        color: "var(--clr-primary)",
                        border: "1px dashed color-mix(in srgb, var(--clr-primary) 30%, transparent)",
                      }}
                    >
                      <Camera size={16} /> {modalFiles.length ? `${modalFiles.length} ảnh đã chọn` : "Chọn ảnh"}
                    </button>
                    {modalFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {modalFiles.map((f, i) => (
                          <div key={i} className="relative size-16 rounded-lg overflow-hidden" style={{ border: "0.5px solid var(--border-base)" }}>
                            <img src={URL.createObjectURL(f)} alt="" className="size-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setModalFiles((prev) => prev.filter((_, j) => j !== i))}
                              className="absolute top-0.5 right-0.5 size-5 rounded-full bg-black/60 flex items-center justify-center cursor-pointer"
                            >
                              <X size={10} style={{ color: "#fff" }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t" style={{ borderColor: "var(--border-base)" }}>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setModalContent(""); setModalFiles([]); }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading || !modalFiles.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    style={{ background: "var(--clr-primary)", color: "#fff" }}
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {uploading ? "Đang tải..." : "Thêm"}
                  </button>
                </div>
              </div>
            </div>
          )
        }
        renderEmptyState={() => (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background:
                "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
              border: "0.5px solid var(--border-base)",
            }}
          >
            <Camera
              size={32}
              className="mx-auto mb-3"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Chưa có ảnh gặp khách hàng
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Tải lên ảnh gặp gỡ khách hàng để tích lũy điểm thưởng!
            </p>
          </div>
        )}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer animate-fade-up"
              style={{
                animationDelay: `${i * 60}ms`,
                boxShadow:
                  "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}
              onClick={() => setSelected(img)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px color-mix(in srgb, var(--clr-primary) 20%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)";
              }}
            >
              <img
                src={`${API_URL}${img.imageUrl}`}
                alt={img.description || "Customer visit"}
                className="size-full object-cover"
                loading="lazy"
              />
              {img.status !== "APPROVED" && (
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                      img.status === "PENDING"
                        ? "bg-yellow-400/80 text-black"
                        : "bg-red-400/80 text-white"
                    }`}
                  >
                    {img.status === "PENDING" ? "Chờ duyệt" : "Từ chối"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img.id);
                  }}
                  className="size-9 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-red-600"
                >
                  <Trash2 size={15} style={{ color: "#fff" }} />
                </button>
              </div>
              {img.description && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] text-white/90 truncate">
                    {img.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ContentListLayout>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
            style={{
              background:
                "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
              boxShadow:
                "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
              border: "0.5px solid var(--border-base)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 size-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
            >
              <X size={16} style={{ color: "#fff" }} />
            </button>
            <img
              src={`${API_URL}${selected.imageUrl}`}
              alt={selected.description || "Customer visit"}
              className="w-full max-h-[70vh] object-contain"
            />
            <div
              className="p-4 border-t"
              style={{ borderColor: "var(--border-base)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                {selected.status !== "APPROVED" && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      selected.status === "PENDING"
                        ? "bg-yellow-400/80 text-black"
                        : "bg-red-400/80 text-white"
                    }`}
                  >
                    {selected.status === "PENDING" ? "Chờ duyệt" : "Từ chối"}
                  </span>
                )}
                {selected.status === "APPROVED" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/80 text-black text-[10px] font-medium">
                    Đã duyệt
                  </span>
                )}
              </div>
              {selected.description && (
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {selected.description}
                </p>
              )}
              <p
                className="text-[10px] mt-1 font-mono"
                style={{ color: "var(--text-tertiary)" }}
              >
                {new Date(selected.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div
              className="flex justify-end p-3 border-t gap-2"
              style={{ borderColor: "var(--border-base)" }}
            >
              <button
                onClick={() => {
                  handleDelete(selected.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-red-500) 15%, transparent)",
                  color: "var(--color-red-500)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "color-mix(in srgb, var(--color-red-500) 25%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "color-mix(in srgb, var(--color-red-500) 15%, transparent)";
                }}
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
