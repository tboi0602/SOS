"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/service/admin.service"
import type { AdminStats } from "@/service/api"
import { Users, FileText, MessageSquare, UserCheck } from "lucide-react"

const STAT_CARDS = [
  { label: "Tổng người dùng", key: "totalUsers" as const, icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Người dùng hoạt động", key: "activeUsers" as const, icon: UserCheck, color: "from-emerald-500 to-emerald-600" },
  { label: "Bài viết", key: "totalPosts" as const, icon: FileText, color: "from-violet-500 to-violet-600" },
  { label: "Bình luận", key: "totalComments" as const, icon: MessageSquare, color: "from-amber-500 to-amber-600" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tổng quan</h1>
        <p className="text-zinc-400 text-sm mt-1">Thống kê tổng quan hệ thống</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-danger text-center py-20">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon
            const value = stats[card.key]
            return (
              <div
                key={card.key}
                className="relative overflow-hidden rounded-2xl bg-[#0c1e3a]/60 border border-white/6 p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-[0.08]`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">{card.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {value.toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20`}>
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
