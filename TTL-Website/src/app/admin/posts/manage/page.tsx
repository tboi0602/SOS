"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, Plus, Send, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAdminPostManage } from "@/hook/admin/useAdminPostManage";
gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminPostManagePage() {
  const {
    posts, loading, page, total, totalPages, setPage, fetch,
    content, setContent,
    hashtagInput, setHashtagInput,
    hashtags, addHashtag, removeHashtag,
    mediaPreviews, removeMedia, fileRef, handleFiles,
    submitting, editId, deleteId, setDeleteId,
    openEdit, resetForm, handleSubmit, handleDelete,
  } = useAdminPostManage();
  const listRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(true);

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
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "var(--border-base)" }}>
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Quản lý bài đăng</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface-elevated)";
              e.currentTarget.style.color = "var(--text-tertiary)";
            }}
          >
            <Plus size={12} />
            {showForm ? "Đóng" : "Tạo bài viết"}
          </button>
        </div>

        {showForm && (
          <div className="rounded-2xl p-5 space-y-4" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={editId ? "Sửa nội dung..." : "Viết bài đăng mới..."}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-all resize-none"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
            />

            {mediaPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaPreviews.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url.startsWith("blob:") || url.startsWith("http") ? url : `${API_URL}${url}`}
                      alt=""
                      className="size-20 rounded-xl object-cover border" style={{ borderColor: "var(--border-base)" }}
                    />
                    <button
                      onClick={() => removeMedia(i)}
                      className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--surface-elevated)";
                  e.currentTarget.style.color = "var(--text-tertiary)";
                }}
              >
                <ImageIcon size={12} /> Hình ảnh
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFiles}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHashtag(); } }}
                placeholder="Thêm hashtag..."
                className="flex-1 px-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-primary/40 transition-all"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
              />
              <button
                onClick={addHashtag}
                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </div>

            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    #{tag}
                    <button onClick={() => removeHashtag(tag)} className="hover:text-danger transition-all cursor-pointer">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting || !content.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-[var(--text-primary)] text-sm font-semibold hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? (
                  <div className="size-4 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {editId ? "Cập nhật" : "Đăng bài"}
              </button>
              {editId && (
                <button
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
                  style={{ color: "var(--text-tertiary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.background = "var(--surface-elevated)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Huỷ chỉnh sửa
                </button>
              )}
            </div>
          </div>
        )}

        <Skeleton name="admin-table" loading={loading} rows={posts.length || 3}>
          {posts.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
              <FileText size={32} className="mx-auto mb-3" style={{ color: "var(--text-tertiary)" }} />
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Chưa có bài đăng nào</p>
            </div>
          ) : (
            <div ref={listRef} className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="admin-card rounded-2xl border p-4 card-hover transition-all" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 mb-2" style={{ color: "var(--text-secondary)" }}>{post.content}</p>
                  {post.images && (post.images as string[]).length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {(post.images as string[]).slice(0, 4).map((img, i) => (
                        <img key={i} src={img.startsWith("http") ? img : `${API_URL}${img}`} alt="" className="size-14 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      <span>{post.likeCount} lượt thích</span>
                      <span>{post.commentCount} bình luận</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 rounded-lg transition-all cursor-pointer"
                        style={{ color: "var(--text-tertiary)" }}
                        title="Sửa"
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 10%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <FileText size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-1.5 rounded-lg transition-all cursor-pointer"
                        style={{ color: "var(--text-tertiary)" }}
                        title="Xoá"
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--danger) 10%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
            </div>
          )}
        </Skeleton>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xoá bài đăng"
        message="Bạn có chắc muốn xoá bài đăng này?"
        confirmLabel="Xoá"
      />
    </div>
  );
}
