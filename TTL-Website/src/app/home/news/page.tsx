"use client";

import { Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNews } from "@/hook/news/useNews";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NewsPage() {
  const { posts, loading } = useNews();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-cyan/10 border border-primary/20 flex items-center justify-center">
            <Newspaper size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              TIN TỨC
            </h1>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
              Bài viết từ ban quản trị
            </p>
          </div>
        </div>

        <Skeleton name="post-card" loading={loading} rows={posts.length || 3}>
          {posts.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-linear-to-b from-[#08102b] to-[#04081c] border border-white/5">
              <Newspaper size={32} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">Chưa có tin tức nào</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl bg-linear-to-b from-white/3 to-transparent border border-white/5 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {post.user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{post.user?.name || "Admin"}</p>
                      <p className="text-[10px] text-zinc-500">{new Date(post.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  {post.images && (post.images as string[]).length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {(post.images as string[]).map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img.startsWith("http") ? img : `${API_URL}${img}`}
                          alt=""
                          className="w-full h-48 rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                  {post.hashtags && (post.hashtags as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {(post.hashtags as string[]).map((tag: string) => (
                        <span key={tag} className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Skeleton>
      </div>
    </div>
  );
}
