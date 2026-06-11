/* eslint-disable @next/next/no-img-element */
"use client";

import { Camera, CheckCircle, XCircle, Clock, ThumbsUp, Ban } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminCustomerVisitImages } from "@/hook/admin/useAdminCustomerVisitImages";
gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const imgUrl = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

const STATUS_TABS = [
  { key: "PENDING", label: "Chờ duyệt", icon: Clock },
  { key: "APPROVED", label: "Đã duyệt", icon: ThumbsUp },
  { key: "REJECTED", label: "Từ chối", icon: Ban },
];

export default function CustomerVisitApprovalPage() {
  const { images, loading, statusFilter, setStatusFilter, approve, reject } =
    useAdminCustomerVisitImages();
  const listRef = useRef<HTMLDivElement>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".admin-card");
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(items, { y: 20, opacity: 0 }, { y: 0, opacity: 1, force3D: true, duration: 0.4, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Camera size={20} className="text-primary" aria-hidden="true" />{" "}
              Gặp khách hàng
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              {images.length} ảnh
              {statusFilter === "PENDING" && " đang chờ duyệt"}
              {statusFilter === "APPROVED" && " đã duyệt"}
              {statusFilter === "REJECTED" && " bị từ chối"}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                style={{
                  background: active
                    ? "var(--color-primary)"
                    : "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                  color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                  border: `0.5px solid ${
                    active
                      ? "var(--color-primary)"
                      : "var(--border-base)"
                  }`,
                }}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <Skeleton name="admin-customer-visits" loading={loading} rows={images.length || 1}>
          {images.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
              <Camera size={40} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Không có ảnh</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Chưa có ảnh nào.</p>
            </div>
          ) : (
            <div ref={listRef} className="space-y-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="admin-card glass-strong card-hover cursor-pointer rounded-2xl p-4 border transition-all"
                  style={{ borderColor: "var(--border-base)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            img.status === "PENDING"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : img.status === "APPROVED"
                                ? "bg-green-400/10 text-green-400"
                                : "bg-red-400/10 text-red-400"
                          }`}
                          style={{
                            border: `1px solid ${
                              img.status === "PENDING"
                                ? "color-mix(in srgb, var(--color-warning) 20%, transparent)"
                                : img.status === "APPROVED"
                                  ? "color-mix(in srgb, var(--color-success) 20%, transparent)"
                                  : "color-mix(in srgb, var(--color-danger) 20%, transparent)"
                            }`,
                          }}
                        >
                          {img.status === "PENDING" ? (
                            <Clock size={10} />
                          ) : img.status === "APPROVED" ? (
                            <ThumbsUp size={10} />
                          ) : (
                            <Ban size={10} />
                          )}
                          {img.status === "PENDING"
                            ? "Chờ duyệt"
                            : img.status === "APPROVED"
                              ? "Đã duyệt"
                              : "Từ chối"}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <div className="size-20 rounded-xl overflow-hidden border shrink-0" style={{ borderColor: "var(--border-base)" }}>
                          <img
                            src={imgUrl(img.imageUrl)}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          {img.description && (
                            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                              {img.description}
                            </p>
                          )}
                          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                            {img.user?.name || "Không rõ"}
                            {img.user?.id && ` (${img.user.id})`}
                            {" "}&bull;{" "}
                            {new Date(img.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                          {img.reviewer && (
                            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                              Người duyệt: {img.reviewer.name}
                              {img.reviewedAt && ` - ${new Date(img.reviewedAt).toLocaleDateString("vi-VN")}`}
                            </p>
                          )}
                          {img.adminNote && (
                            <p className="text-[11px] mt-1 italic" style={{ color: "var(--text-tertiary)" }}>
                              Phản hồi: {img.adminNote}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {img.status === "PENDING" ? (
                      actionId === img.id ? (
                        <div className="flex flex-col gap-2 w-64 shrink-0">
                          <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú (tuỳ chọn)..."
                            className="w-full px-3 py-2 rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", border: "0.5px solid var(--border-base)" }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                await approve(img.id, note || undefined);
                                setNote("");
                                setActionId(null);
                              }}
                              className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
                              style={{ border: "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)" }}
                            >
                              <CheckCircle size={12} /> Duyệt
                            </button>
                            <button
                              onClick={async () => {
                                await reject(img.id, note || undefined);
                                setNote("");
                                setActionId(null);
                              }}
                              className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                              style={{ border: "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)" }}
                            >
                              <XCircle size={12} /> Từ chối
                            </button>
                            <button
                              onClick={() => { setActionId(null); setNote(""); }}
                              className="px-3 py-2 rounded-lg text-xs transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                              style={{ background: "var(--surface-elevated)", color: "var(--text-tertiary)" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "var(--surface-elevated)";
                              }}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActionId(img.id)}
                          className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                          Xử lý
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Skeleton>
      </div>
    </div>
  );
}
