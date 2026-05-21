"use client"

import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { useManagePosts } from "@/hook/posts/useManagePosts"
import ManagePostsHeader from "@/components/posts/ManagePostsHeader"
import PostTableRow from "@/components/posts/PostTableRow"
import PostsPagination from "@/components/posts/PostsPagination"
import EditPostModal from "@/components/post/EditPostModal"
import ConfirmDeleteModal from "@/components/posts/ConfirmDeleteModal"

function PostTableHeader() {
  return (
    <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_100px] gap-4 px-5 py-3 border-b border-white/8 text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
      <span>Bài viết</span>
      <span className="text-center">Tương tác</span>
      <span className="text-center">Ngày đăng</span>
      <span className="text-center">Tác vụ</span>
    </div>
  )
}

function PostsSkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="size-14 rounded-lg bg-white/5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 rounded bg-white/5" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
      <div className="flex gap-2">
        <div className="size-8 rounded-lg bg-white/5" />
        <div className="size-8 rounded-lg bg-white/5" />
      </div>
    </div>
  )
}

function PostsEmptyState() {
  const router = useRouter()

  return (
    <div className="glass-strong rounded-2xl p-16 text-center">
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <FileText size={28} className="text-primary/40" />
      </div>
      <p className="text-zinc-400 text-sm">Bạn chưa có bài viết nào.</p>
      <p className="text-zinc-600 text-xs mt-1">Hãy bắt đầu chia sẻ ngay!</p>
      <button
        onClick={() => router.push("/home/create")}
        className="mt-4 px-5 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all"
      >
        Đăng bài đầu tiên
      </button>
    </div>
  )
}

export default function ManagePostsPage() {
  const {
    posts, loading, page, totalPages, total,
    editPost, setEditPost, deletePost, setDeletePost,
    deleting, handleDelete, handleUpdated, goToPage, resolveUrl,
  } = useManagePosts()

  return (
    <div className="max-w-4xl mx-auto">
      <ManagePostsHeader total={total} loading={loading} />

      {loading ? (
        <div className="glass-strong rounded-2xl overflow-hidden divide-y divide-white/6">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostsSkeletonRow key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <PostsEmptyState />
      ) : (
        <>
          <div className="glass-strong rounded-2xl overflow-hidden">
            <PostTableHeader />
            <div className="divide-y divide-white/6">
              {posts.map((post) => (
                <PostTableRow
                  key={post.id}
                  post={post}
                  resolveUrl={resolveUrl}
                  onEdit={() => setEditPost(post)}
                  onDelete={() => setDeletePost(post)}
                />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <PostsPagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </>
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
    </div>
  )
}
