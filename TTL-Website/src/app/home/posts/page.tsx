"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  Star,
} from "lucide-react";
import { useManagePosts } from "@/hook/posts/useManagePosts";
import { profileService } from "@/service/profile.service";
import PostsPagination from "@/components/posts/PostsPagination";
import EditPostModal from "@/components/post/EditPostModal";
import ConfirmDeleteModal from "@/components/posts/ConfirmDeleteModal";
import ContentListLayout from "@/components/ui/ContentListLayout";
import { statusFilters } from "@/components/ui/StatusFilterBar";

gsap.registerPlugin(ScrollTrigger);

export default function ManagePostsPage() {
  const feedRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [postScore, setPostScore] = useState(0);

  useEffect(() => {
    profileService.getProfile().then((p) => {
      setPostScore(p.core.postScore);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const cards = q(".post-card");
      if (!cards.length) return;

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { force3D: true },
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });

        tl.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" })
          .to(cards, { scale: 1.02, duration: 0.15, ease: "power1.out", stagger: 0.05 }, "-=0.05")
          .to(cards, { scale: 1, duration: 0.3, ease: "back.out(1.7)", stagger: 0.05 });
      });
    });
    return () => ctx.revert();
  }, []);

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
        iconClass: "bg-accent/15",
        createLabel: "Đăng bài mới",
        onCreate: () => router.push("/home/create"),
        createBtnClass: "bg-accent hover:bg-accent-dark shadow-accent/25",
      }}
      stats={[
        {
          label: "Tổng bài",
          value: total,
          icon: FileText,
          iconBg: "bg-accent/10",
          iconColor: "text-accent",
        },
        {
          label: "Tương tác",
          value: posts.reduce((s, p) => s + p.likeCount + p.commentCount, 0),
          icon: ThumbsUp,
          iconBg: "bg-accent/10",
          iconColor: "text-accent",
        },
        {
          label: "Điểm bài viết",
          value: postScore,
          icon: Star,
          iconBg: "bg-amber-400/10",
          iconColor: "text-amber-400",
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
        <div className="bg-[color-mix(in_srgb,var(--text-primary)_1%,transparent)] rounded-2xl py-16 px-6 text-center border border-[var(--border-base)] transition-none">
          <div className="size-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-accent/40" />
          </div>
          <p className="text-[var(--text-tertiary)] text-sm font-medium">
            Bạn chưa có bài viết nào.
          </p>
          <p className="text-[var(--text-tertiary)] text-xs mt-1">
            Hãy bắt đầu chia sẻ ngay!
          </p>
          <button
            onClick={() => router.push("/home/create")}
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-dark text-[var(--text-primary)] text-sm font-semibold transition-all shadow-lg shadow-accent/25 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Plus size={16} /> Đăng bài đầu tiên
          </button>
        </div>
      )}
    >
      <div ref={feedRef} className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card glass-strong rounded-2xl p-4 border border-[var(--border-base)] hover:border-[color-mix(in_srgb,var(--text-primary)_20%,transparent)] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-[var(--text-primary)] font-medium line-clamp-2 leading-snug">
                    {post.content}
                  </p>
                  {post.status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 border text-[10px] font-medium text-yellow-400" style={{ borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}>
                      <Clock size={9} /> Chờ duyệt
                    </span>
                  )}
                  {post.status === "approved" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 border text-[10px] font-medium text-green-400" style={{ borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
                      <CheckCircle size={9} /> Đã duyệt
                    </span>
                  )}
                  {post.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 border text-[10px] font-medium text-red-400" style={{ borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)" }}>
                      <XCircle size={9} /> Từ chối
                    </span>
                  )}
                </div>
                {post.images.length > 0 && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-[var(--text-tertiary)]">
                    {post.images.length} ảnh
                  </span>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                    <ThumbsUp size={11} className="text-accent/60" />{" "}
                    {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                    <MessageCircle size={11} className="text-accent/60" />{" "}
                    {post.commentCount}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
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
                  className="size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeletePost(post)}
                  className="size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
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
