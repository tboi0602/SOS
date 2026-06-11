/* eslint-disable @next/next/no-img-element */
"use client";

import { getInitial } from "@/utils/cn";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Heart,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import PostDetailModal from "@/components/admin/PostDetailModal";
import ImageViewer from "@/components/shared/ImageViewer";
import { useAdminPosts, type PostTab } from "@/hook/admin/useAdminPosts";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const imgUrl = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

const TABS: { key: PostTab; label: string; icon: typeof FileText }[] = [
  { key: "pending", label: "Chờ duyệt", icon: Clock },
  { key: "approved", label: "Đã duyệt", icon: CheckCircle },
  { key: "all", label: "Tất cả", icon: FileText },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "pending")
    return (
      <span
        className="badge-pending inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium"
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-warning) 20%, transparent)",
        }}
      >
        <Clock size={10} /> Chờ duyệt
      </span>
    );
  if (status === "approved")
    return (
      <span
        className="badge-approved inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium"
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-success) 20%, transparent)",
        }}
      >
        <CheckCircle size={10} /> Đã duyệt
      </span>
    );
  if (status === "rejected")
    return (
      <span
        className="badge-rejected inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium"
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-danger) 20%, transparent)",
        }}
      >
        <XCircle size={10} /> Từ chối
      </span>
    );
  return null;
}

export default function PostPage() {
  const {
    tab,
    posts,
    total,
    loading,
    error,
    note,
    actionId,
    deleteTarget,
    deleting,
    viewPost,
    viewImageIndex,
    viewImageUrls,
    setNote,
    setActionId,
    setViewPost,
    setDeleteTarget,
    switchTab,
    handleApprove,
    handleReject,
    handleDelete,
    openImageViewer,
    closeImageViewer,
  } = useAdminPosts();
  const listRef = useRef<HTMLDivElement>(null);

  if (error) return null;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el.querySelectorAll(".admin-post-card"),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            force3D: true,
            duration: 0.4,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    });
    return () => ctx.revert();
  }, [posts]);

  return (
    <div
      className="min-h-screen  px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up"
      style={{ color: "var(--text-primary)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-lg font-bold flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <FileText size={20} className="text-accent" aria-hidden="true" />
              Duyệt bài viết
            </h1>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {tab === "pending"
                ? `${total} bài viết đang chờ duyệt`
                : tab === "approved"
                  ? `${total} bài viết đã duyệt`
                  : `Tổng số ${total} bài viết`}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                aria-label={`Xem ${t.label.toLowerCase()}`}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent/50 min-h-5 ${
                  active
                    ? "bg-accent/15 text-accent border border-accent/25"
                    : "text-secondary hover:text-primary hover:bg-white/6 border border-transparent"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <Skeleton name="admin-posts" loading={loading} rows={posts.length || 1}>
          {posts.length === 0 ? (
            <div
              className="text-center py-16 rounded-3xl"
              style={{
                background:
                  "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow:
                  "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}
            >
              <FileText
                size={40}
                className="mx-auto mb-4"
                style={{ color: "var(--text-tertiary)" }}
              />
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Không có bài viết
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                {tab === "pending"
                  ? "Chưa có bài viết nào đang chờ duyệt"
                  : tab === "approved"
                    ? "Chưa có bài viết nào được duyệt"
                    : "Chưa có bài viết nào"}
              </p>
            </div>
          ) : (
            <div ref={listRef} className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="admin-post-card rounded-2xl p-4 border card-hover transition-all"
                  style={{
                    background:
                      "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                    border: "0.5px solid var(--border-base)",
                    boxShadow:
                      "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border =
                      "0.5px solid var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border =
                      "0.5px solid var(--border-base)";
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div
                        className="cursor-pointer"
                        onClick={() => setViewPost(post)}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className="size-7 rounded-full overflow-hidden shrink-0"
                            style={{ background: "var(--surface-strong)" }}
                          >
                            {post.user.avatar ? (
                              <img
                                src={post.user.avatar}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              <div
                                className="size-full flex items-center justify-center text-[10px] font-bold"
                                style={{ color: "var(--text-tertiary)" }}
                              >
                                {getInitial(post.user.name)}
                              </div>
                            )}
                          </div>
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {post.user.name}
                          </span>
                          {tab === "all" && (
                            <StatusBadge status={post.status} />
                          )}
                        </div>
                        <p
                          className="text-sm whitespace-pre-line line-clamp-3 overflow-hidden text-ellipsis"
                          style={{ color: "var(--text-primary)" }}
                          title={post.content}
                        >
                          {post.content}
                        </p>
                        {post.images && post.images.length > 0 && (
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {(post.images as string[])
                              .slice(0, 4)
                              .map((url, i) => (
                                <button
                                  key={i}
                                  onClick={() =>
                                    openImageViewer(post.images as string[], i)
                                  }
                                  className="size-16 rounded-lg overflow-hidden border cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors"
                                  style={{ borderColor: "var(--border-base)" }}
                                >
                                  <img
                                    src={imgUrl(url)}
                                    alt=""
                                    className="size-full object-cover"
                                  />
                                </button>
                              ))}
                            {(post.images as string[]).length > 4 && (
                              <button
                                onClick={() =>
                                  openImageViewer(post.images as string[], 4)
                                }
                                className="size-16 rounded-lg overflow-hidden border flex items-center justify-center text-xs font-medium cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors"
                                style={{
                                  borderColor: "var(--border-base)",
                                  background:
                                    "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                                  color: "var(--text-tertiary)",
                                }}
                              >
                                +{post.images.length - 4}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className="inline-flex items-center gap-1 text-[10px]"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          <Heart size={10} /> {post.likeCount}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-[10px]"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          <MessageSquare size={10} /> {post.commentCount}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {post.adminNote && (
                        <div
                          className="mt-2 p-2 rounded-lg bg-red-400/5 border"
                          style={{
                            borderColor:
                              "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                          }}
                        >
                          <p className="text-[10px] text-red-400/70 italic">
                            Phản hồi: {post.adminNote}
                          </p>
                        </div>
                      )}
                    </div>
                    {tab === "pending" ? (
                      actionId === post.id ? (
                        <div className="flex flex-col gap-2 w-64 shrink-0">
                          <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú (tuỳ chọn)..."
                            className="rounded-lg px-3 py-1.5 text-xs outline-none transition-colors"
                            style={{
                              background: "var(--surface-base)",
                              border: "1px solid var(--border-base)",
                              color: "var(--text-primary)",
                            }}
                            onFocus={(e) =>
                              (e.currentTarget.style.borderColor =
                                "var(--color-accent)")
                            }
                            onBlur={(e) =>
                              (e.currentTarget.style.borderColor =
                                "var(--border-base)")
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(post.id)}
                              aria-label="Duyệt bài viết"
                              className="btn-primary"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.375rem 0.75rem",
                                background:
                                  "color-mix(in srgb, var(--color-success) 20%, transparent)",
                                color: "var(--color-success)",
                                border:
                                  "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)",
                              }}
                            >
                              <CheckCircle size={12} /> Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(post.id)}
                              aria-label="Từ chối bài viết"
                              className="btn-primary"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.375rem 0.75rem",
                                background:
                                  "color-mix(in srgb, var(--color-danger) 20%, transparent)",
                                color: "var(--color-danger)",
                                border:
                                  "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)",
                              }}
                            >
                              <XCircle size={12} /> Từ chối
                            </button>
                            <button
                              onClick={() => {
                                setActionId(null);
                                setNote("");
                              }}
                              className="btn-ghost"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.375rem 0.75rem",
                              }}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => setViewPost(post)}
                            aria-label="Xem chi tiết"
                            className="btn-ghost"
                            style={{ padding: "0.5rem" }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setActionId(post.id)}
                            className="btn-primary"
                          >
                            Xử lý
                          </button>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            aria-label={`Xoá bài viết của ${post.user.name}`}
                            className="btn-ghost"
                            style={{
                              padding: "0.5rem",
                              color: "var(--color-danger)",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => setViewPost(post)}
                          aria-label="Xem chi tiết"
                          className="btn-ghost"
                          style={{ padding: "0.5rem" }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          aria-label={`Xoá bài viết của ${post.user.name}`}
                          className="btn-ghost"
                          style={{
                            padding: "0.5rem",
                            color: "var(--color-danger)",
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Skeleton>

        <DeleteConfirmModal
          open={!!deleteTarget}
          title="Xoá bài viết"
          message="Bài viết sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác."
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {viewPost && (
          <PostDetailModal post={viewPost} onClose={() => setViewPost(null)} />
        )}

        {viewImageIndex !== null && viewImageUrls.length > 0 && (
          <ImageViewer
            images={viewImageUrls}
            initialIndex={viewImageIndex}
            onClose={closeImageViewer}
          />
        )}
      </div>
    </div>
  );
}
