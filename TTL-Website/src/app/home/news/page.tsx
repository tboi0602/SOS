"use client";

import { Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNews } from "@/hook/news/useNews";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NewsPage() {
  const { posts, loading } = useNews();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(el.querySelectorAll(".news-card"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, force3D: true, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, [posts]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-base)" }}>
          <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
            <Newspaper size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
              THÔNG BÁO BAN QUẢN TRỊ
            </h1>
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">
              Thông báo từ ban quản trị
            </p>
          </div>
        </div>

        <Skeleton name="post-card" loading={loading} rows={posts.length || 3}>
          {posts.length === 0 ? (
            <div className="text-center py-20 rounded-3xl"
              style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}>
              <Newspaper size={32} className="text-[var(--text-tertiary)] mx-auto mb-3" />
              <p className="text-[var(--text-tertiary)] text-sm">Chưa có tin tức nào</p>
            </div>
          ) : (
            <div ref={listRef} className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="news-card rounded-2xl p-5 space-y-4"
                  style={{
                    background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                    boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                    border: "0.5px solid var(--border-base)",
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {post.user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{post.user?.name || "Admin"}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{new Date(post.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{post.content}</p>
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
