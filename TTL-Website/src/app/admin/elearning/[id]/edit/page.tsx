'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import LessonForm from "@/components/admin/elearning/LessonForm"
import { lessonService } from "@/service/lesson.service"
import type { LessonFormData } from "@/components/admin/elearning/LessonForm"

export default function EditLessonPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState<LessonFormData | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    lessonService.getById(id).then((res) => {
      const l = res.lesson
      setInitialData({
        title: l.title,
        content: l.content ?? '',
        videoUrl: l.videoUrl ?? '',
        images: l.images as string[] ?? [],
      })
    }).finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data: LessonFormData) => {
    setLoading(true)
    try {
      await lessonService.update(id, data)
      router.push('/admin/elearning')
    } catch {}
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl p-5 animate-pulse space-y-4" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)" }}>
            <div className="h-10 rounded-xl" style={{ background: "var(--surface-elevated)" }} />
            <div className="h-20 rounded-xl" style={{ background: "var(--surface-elevated)" }} />
            <div className="h-10 rounded-xl" style={{ background: "var(--surface-elevated)" }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/elearning" className="p-1.5 rounded-lg transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 10%, transparent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}>
            <ArrowLeft size={18} />
          </Link>
          <GraduationCap size={20} className="text-primary" />
          <h1 className="text-lg font-bold">Chỉnh sửa bài học</h1>
        </div>

        {initialData && (
          <LessonForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Cập nhật" loading={loading} />
        )}
      </div>
    </div>
  )
}
