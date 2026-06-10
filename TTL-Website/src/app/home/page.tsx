"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePosts } from "@/hook/post";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import EditPostModal from "@/components/post/EditPostModal";

gsap.registerPlugin(ScrollTrigger);

export default function FeedPage() {
  const feedRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const {
    posts,
    loading,
    page,
    totalPages,
    toggleLike,
    addComment,
    deleteComment,
    deletePost,
    updatePost,
    goToPage,
    searchRef,
    searchQ,
    searchResults,
    searching,
    showResults,
    setShowResults,
    editingPost,
    setSearchQ,
    setEditingPost,
    handleSearch,
  } = usePosts();

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

  return (
    <div className="min-h-screen flex justify-center p-4 animate-fade-up">
      <div className="max-w-2xl w-full px-2 sm:px-0 relative z-10">
        <div
          ref={searchRef}
          className="relative mb-6 animate-[fadeIn_0.4s_ease-out]"
        >
          <div className="relative">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--text-dim)" }}
            />
            <input
              value={searchQ}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Khám phá các luồng bài viết mới..."
              className="w-full rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm outline-none transition-all duration-300"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
                color: "var(--text-primary)",
              }}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            {searching && (
              <Loader2
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-accent"
              />
            )}
          </div>

          {showResults && searchResults.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                border: "0.5px solid var(--border-base)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
              }}
            >
              <div className="px-4 py-2 flex items-center gap-1.5" style={{ borderBottom: "0.5px solid var(--border-base)" }}>
                <Sparkles size={11} className="text-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-dim)" }}>
                  Kết quả khớp lệnh
                </span>
              </div>
              <div>
                {searchResults.slice(0, 5).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      router.push(`/home/posts/${post.id}`);
                      setShowResults(false);
                      setSearchQ("");
                    }}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors cursor-pointer group"
                    style={{ borderBottom: "0.5px solid var(--border-base)" }}
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs sm:text-sm transition-colors truncate font-medium" style={{ color: "var(--text-secondary)" }}>
                        {post.content}
                      </p>
                      <p className="text-[10px] font-mono flex items-center gap-1" style={{ color: "var(--text-dim)" }}>
                        <span>•</span> {post.user?.name || "Ẩn danh"}
                      </p>
                    </div>
                    <ArrowRight
                      size={13}
                      className="transition-all shrink-0"
                      style={{ color: "var(--text-dim)" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Skeleton name="home-feed" loading={loading} rows={posts.length || 1}>
          {posts.length === 0 ? (
            <div
              className="text-center py-20 rounded-3xl animate-[fadeIn_0.5s_ease-out]"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
              }}
            >
              <div
                className="size-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", boxShadow: "inset 0 0 0 0.5px var(--border-base)" }}
              >
                <LayoutGrid size={24} style={{ color: "var(--text-dim)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                Chưa ghi nhận bài viết nào
              </p>
              {user ? (
                <p className="text-xs mt-1.5 font-light" style={{ color: "var(--text-dim)" }}>
                  Khởi tạo kết nối bằng cách đăng bài viết đầu tiên của bạn!
                </p>
              ) : (
                <p className="text-xs mt-1.5 font-light" style={{ color: "var(--text-dim)" }}>
                  Vui lòng đăng nhập hệ thống để tham gia tương tác.
                </p>
              )}
            </div>
          ) : (
            <div ref={feedRef} className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={toggleLike}
                  onComment={addComment}
                  onDeleteComment={deleteComment}
                  onDeletePost={deletePost}
                  onEditPost={(id) =>
                    setEditingPost(posts.find((p) => p.id === id) || null)
                  }
                />
              ))}
            </div>
          )}
        </Skeleton>

        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-4 mt-8 pb-12 animate-[fadeIn_0.5s_ease-out]">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                color: "var(--text-tertiary)",
                border: "0.5px solid var(--border-base)",
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
              }}
            >
              <ChevronLeft size={14} /> Trước
            </button>

            <div
              className="px-3 py-1.5 rounded-xl font-mono text-xs font-black tracking-wider"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                border: "0.5px solid var(--border-base)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                color: "var(--text-dim)",
              }}
            >
              <span className="text-accent">{page}</span> / {totalPages}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                color: "var(--text-tertiary)",
                border: "0.5px solid var(--border-base)",
                background: "color-mix(in srgb, var(--text-primary) 2%, transparent)",
              }}
            >
              Sau <ChevronRight size={14} />
            </button>
          </div>
        )}

        {editingPost && (
          <EditPostModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onUpdated={(updated) => {
              updatePost(updated);
              setEditingPost(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
