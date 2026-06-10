'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import LessonForm from "@/components/admin/elearning/LessonForm"
import { lessonService } from "@/service/lesson.service"
import type { LessonFormData } from "@/components/admin/elearning/LessonForm"

export default function CreateLessonPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: LessonFormData) => {
    setLoading(true)
    try {
      await lessonService.create(data)
      router.push('/admin/elearning')
    } catch {}
    setLoading(false)
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
          <h1 className="text-lg font-bold">Thêm bài học</h1>
        </div>

        <LessonForm onSubmit={handleSubmit} submitLabel="Tạo bài học" loading={loading} />
      </div>
    </div>
  )
}
