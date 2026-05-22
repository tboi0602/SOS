"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ThumbsUp,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useManagePosts } from "@/hook/posts/useManagePosts";
import PostsPagination from "@/components/posts/PostsPagination";
import EditPostModal from "@/components/post/EditPostModal";
import ConfirmDeleteModal from "@/components/posts/ConfirmDeleteModal";
import ContentListLayout from "@/components/ui/ContentListLayout";
import { statusFilters } from "@/components/ui/StatusFilterBar";

export default function ManagePostsPage() {
  const router = useRouter();
  const {
    posts,
    loading,
    page,
    totalPages,
    total,
    editPost,
    setEditPost,
    deletePost,
    setDeletePost,
    deleting,
    handleDelete,
    handleUpdated,
    goToPage,
    filter,
    handleFilterChange,
    dateFrom,
    handleDateFromChange,
    dateTo,
    handleDateToChange,
    counts,
  } = useManagePosts();

  return (
    <ContentListLayout
      header={{
        title: "Quản lý bài viết",
        subtitle: loading ? "Đang tải..." : total + " bài viết",
        icon: FileText,
        iconClass: "bg-cyan/15",
        createLabel: "Đăng bài mới",
        onCreate: () => router.push("/home/create"),
        createBtnClass: "bg-cyan hover:bg-cyan-dark shadow-cyan/25",
      }}
      stats={[
        {
          label: "Tổng bài",
          value: total,
          icon: FileText,
          iconBg: "bg-cyan/10",
          iconColor: "text-cyan",
        },
        {
          label: "Tương tác",
          value: posts.reduce((s, p) => s + p.likeCount + p.commentCount, 0),
          icon: ThumbsUp,
          iconBg: "bg-cyan/10",
          iconColor: "text-cyan",
        },
      ]}
      filters={statusFilters(FileText)}
      activeFilter={filter}
      onFilterChange={handleFilterChange}
      counts={counts}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onFromChange={handleDateFromChange}
      onToChange={handleDateToChange}
      skeletonName="manage-posts"
      skeletonRows={5}
      items={posts}
      loading={loading}
      renderEmptyState={() => (
        <div className="bg-white/1 rounded-2xl py-16 px-6 text-center border border-white/6 transition-none">
          <div className="size-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-cyan/40" />
          </div>
          <p className="text-zinc-400 text-sm font-medium">
            Bạn chưa có bài viết nào.
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Hãy bắt đầu chia sẻ ngay!
          </p>
          <button
            onClick={() => router.push("/home/create")}
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-white text-sm font-semibold transition-all shadow-lg shadow-cyan/25 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
          >
            <Plus size={16} /> Đăng bài đầu tiên
          </button>
        </div>
      )}
    >
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-strong rounded-2xl p-4 border border-white/6 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-white font-medium line-clamp-2 leading-snug">
                    {post.content}
                  </p>
                  {post.status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-medium text-yellow-400">
                      <Clock size={9} /> Chờ duyệt
                    </span>
                  )}
                  {post.status === "approved" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-[10px] font-medium text-green-400">
                      <CheckCircle size={9} /> Đã duyệt
                    </span>
                  )}
                  {post.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-[10px] font-medium text-red-400">
                      <XCircle size={9} /> Từ chối
                    </span>
                  )}
                </div>
                {post.images.length > 0 && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-zinc-500">
                    {post.images.length} ảnh
                  </span>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <ThumbsUp size={11} className="text-cyan/60" />{" "}
                    {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <MessageCircle size={11} className="text-cyan/60" />{" "}
                    {post.commentCount}
                  </span>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditPost(post)}
                  className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-cyan hover:bg-cyan/10 transition-all cursor-pointer"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeletePost(post)}
                  className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <PostsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}

      {editPost && (
        <EditPostModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onUpdated={handleUpdated}
        />
      )}
      {deletePost && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeletePost(null)}
          deleting={deleting}
        />
      )}
    </ContentListLayout>
  );
}
