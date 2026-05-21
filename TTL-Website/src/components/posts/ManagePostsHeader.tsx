"use client"

import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"

interface ManagePostsHeaderProps {
  total: number
  loading: boolean
}

export default function ManagePostsHeader({ total, loading }: ManagePostsHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <FileText size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Quản lý bài viết</h1>
          <p className="text-xs text-zinc-500">
            {loading ? "Đang tải..." : `${total} bài viết`}
          </p>
        </div>
      </div>
      <button
        onClick={() => router.push("/home/create")}
        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25"
      >
        + Đăng bài mới
      </button>
    </div>
  )
}
