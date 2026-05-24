/* eslint-disable @next/next/no-img-element */
"use client";

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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[11px] font-medium text-yellow-400">
        <Clock size={10} /> Chờ duyệt
      </span>
    );
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-[11px] font-medium text-green-400">
        <CheckCircle size={10} /> Đã duyệt
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-[11px] font-medium text-red-400">
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

  if (error) return null;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-8xl mx-auto space-y-8 ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={20} className="text-primary" aria-hidden="true" />{" "}
              Duyệt bài viết
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
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
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-5 ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <Skeleton name="admin-posts" loading={loading} rows={posts.length || 1}>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm ">
              {tab === "pending"
                ? "Không có bài viết nào đang chờ"
                : tab === "approved"
                  ? "Chưa có bài viết nào được duyệt"
                  : "Chưa có bài viết nào"}
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/2  rounded-2xl p-4 border border-white/6 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div
                        className="cursor-pointer"
                        onClick={() => setViewPost(post)}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="size-7 rounded-full bg-white/10 overflow-hidden shrink-0">
                            {post.user.avatar ? (
                              <img
                                src={post.user.avatar}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                {post.user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-zinc-300">
                            {post.user.name}
                          </span>
                          {tab === "all" && (
                            <StatusBadge status={post.status} />
                          )}
                        </div>
                        <p className="text-sm text-white whitespace-pre-line line-clamp-3">
                          {post.content.length > 200
                            ? post.content.slice(0, 200) + "..."
                            : post.content}
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
                                  className="size-16 rounded-lg overflow-hidden border border-white/6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors"
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
                                className="size-16 rounded-lg overflow-hidden border border-white/6 bg-white/5 flex items-center justify-center text-xs text-zinc-500 font-medium cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/30 transition-colors"
                              >
                                +{post.images.length - 4}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                          <Heart size={10} /> {post.likeCount}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                          <MessageSquare size={10} /> {post.commentCount}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {post.adminNote && (
                        <div className="mt-2 p-2 rounded-lg bg-red-400/5 border border-red-400/10">
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
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-primary/30 transition-colors"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(post.id)}
                              aria-label="Duyệt bài viết"
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
                            >
                              <CheckCircle size={12} /> Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(post.id)}
                              aria-label="Từ chối bài viết"
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                            >
                              <XCircle size={12} /> Từ chối
                            </button>
                            <button
                              onClick={() => {
                                setActionId(null);
                                setNote("");
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 text-xs hover:bg-white/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
                            className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setActionId(post.id)}
                            className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          >
                            Xử lý
                          </button>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            aria-label={`Xoá bài viết của ${post.user.name}`}
                            className="p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
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
                          className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          aria-label={`Xoá bài viết của ${post.user.name}`}
                          className="p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
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
