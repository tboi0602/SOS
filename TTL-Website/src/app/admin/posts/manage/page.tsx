"use client";

import { useState } from "react";
import { FileText, Plus, Send, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAdminPostManage } from "@/hook/admin/useAdminPostManage";

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
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Quản lý bài đăng</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Plus size={12} />
            {showForm ? "Đóng" : "Tạo bài viết"}
          </button>
        </div>

        {showForm && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={editId ? "Sửa nội dung..." : "Viết bài đăng mới..."}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all resize-none"
            />

            {mediaPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaPreviews.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url.startsWith("blob:") || url.startsWith("http") ? url : `${API_URL}${url}`}
                      alt=""
                      className="size-20 rounded-xl object-cover border border-white/10"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
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
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? (
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {editId ? "Cập nhật" : "Đăng bài"}
              </button>
              {editId && (
                <button
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Huỷ chỉnh sửa
                </button>
              )}
            </div>
          </div>
        )}

        <Skeleton name="admin-table" loading={loading} rows={posts.length || 3}>
          {posts.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white/3 border border-white/5">
              <FileText size={32} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">Chưa có bài đăng nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl bg-white/3 border border-white/6 p-4 hover:border-white/20 transition-all">
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap line-clamp-3 mb-2">{post.content}</p>
                  {post.images && (post.images as string[]).length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {(post.images as string[]).slice(0, 4).map((img, i) => (
                        <img key={i} src={img.startsWith("http") ? img : `${API_URL}${img}`} alt="" className="size-14 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                      <span>{post.likeCount} lượt thích</span>
                      <span>{post.commentCount} bình luận</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                        title="Sửa"
                      >
                        <FileText size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                        title="Xoá"
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
