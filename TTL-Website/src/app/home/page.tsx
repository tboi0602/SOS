"use client";

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
import { useState, useRef, useEffect } from "react";
import { api, type Post } from "@/service/api";

export default function FeedPage() {
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
    goToPage,
  } = usePosts();

  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQ(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    try {
      const data = await api.posts.search(q.trim());
      setSearchResults(data.posts);
      setShowResults(true);
    } catch {
      // Catch blocks should not be left blank ideally
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-1 sm:px-0 relative z-10 font-sans">
      {/* ================= THANH TÌM KIẾM CYBERPUNK ================= */}
      <div
        ref={searchRef}
        className="relative mb-6 group animate-[fadeIn_0.4s_ease-out]"
      >
        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan transition-colors"
          />
          <input
            value={searchQ}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Khám phá các luồng bài viết mới..."
            className="w-full rounded-2xl bg-white/2 border border-white/5 pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:border-cyan/30 focus:bg-white/4 focus:ring-4 focus:ring-cyan/5 outline-none transition-all duration-300 shadow-inner"
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          {searching && (
            <Loader2
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan"
            />
          )}
        </div>

        {/* DROPDOWN KẾT QUẢ TÌM KIẾM (GLASSMORPHISM) */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#070b14]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="px-4 py-2 bg-white/2 border-b border-white/5 flex items-center gap-1.5">
              <Sparkles size={11} className="text-cyan animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Kết quả khớp lệnh
              </span>
            </div>
            <div className="divide-y divide-white/2">
              {searchResults.slice(0, 5).map((post) => (
                <button
                  key={post.id}
                  onClick={() => {
                    router.push(`/home/posts/${post.id}`);
                    setShowResults(false);
                    setSearchQ("");
                  }}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-cyan/3transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs sm:text-sm text-zinc-300 group-hover:text-white transition-colors truncate font-medium">
                      {post.content}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <span>•</span> {post.user?.name || "Ẩn danh"}
                    </p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-zinc-600 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= KHU VỰC THÂN TRANG (FEED CONTENT) ================= */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 size={24} className="animate-spin text-cyan" />
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
            Đang tải luồng dữ liệu...
          </p>
        </div>
      ) : posts.length === 0 ? (
        /* EMPTY STATE */
        <div className="text-center py-20 rounded-3xl border border-white/5 bg-linear-to-b from-white/2 to-transparent animate-[fadeIn_0.5s_ease-out]">
          <div className="size-16 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center mx-auto mb-4 text-zinc-600 shadow-inner">
            <LayoutGrid size={24} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-sm font-medium">
            Chưa ghi nhận bài viết nào
          </p>
          {user ? (
            <p className="text-zinc-600 text-xs mt-1.5 font-light">
              Khởi tạo kết nối bằng cách đăng bài viết đầu tiên của bạn!
            </p>
          ) : (
            <p className="text-zinc-600 text-xs mt-1.5 font-light">
              Vui lòng đăng nhập hệ thống để tham gia tương tác.
            </p>
          )}
        </div>
      ) : (
        /* DANH SÁCH BÀI VIẾT */
        <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={toggleLike}
              onComment={addComment}
              onDeleteComment={deleteComment}
            />
          ))}
        </div>
      )}

      {/* ================= KHỐI PHÂN TRANG (PAGINATION) ================= */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-12 animate-[fadeIn_0.5s_ease-out]">
          {/* Nút Trước */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 border border-white/5 bg-white/2 hover:text-white hover:bg-white/4 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={14} /> Trước
          </button>

          {/* Vị trí trang hiện tại */}
          <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs font-black tracking-wider text-zinc-500">
            <span className="text-cyan">{page}</span> / {totalPages}
          </div>

          {/* Nút Sau */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 border border-white/5 bg-white/2 hover:text-white hover:bg-white/4 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Sau <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
