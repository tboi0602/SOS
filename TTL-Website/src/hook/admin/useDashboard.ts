"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useToast } from "@/components/ui/Toast"
import { adminService } from "@/service/admin.service"
import type { DashboardMember } from "@/service/api"

export function useDashboard() {
  const [members, setMembers] = useState<DashboardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string>("totalScore")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const { toast } = useToast()
  const pageSize = 20

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const res = await adminService.getDashboard()
      setMembers(res.members)
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi tải dữ liệu", "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      fetchDashboard()
    }, 0)
    return () => window.clearTimeout(id)
  }, [fetchDashboard])

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const handleBlock = async (id: string, name: string) => {
    try {
      await adminService.blockUser(id)
      toast(`Đã chặn "${name}"`, "success")
      fetchDashboard()
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi khi chặn", "error")
    }
  }

  const handleUnblock = async (id: string, name: string) => {
    try {
      await adminService.unblockUser(id)
      toast(`Đã bỏ chặn "${name}"`, "success")
      fetchDashboard()
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi khi bỏ chặn", "error")
    }
  }

  const stats = useMemo(() => {
    const total = members.length
    const active = members.filter((m) => m.isActive).length
    const totalScore = members.reduce((s, m) => s + m.totalScore, 0)
    const totalPosts = members.reduce((s, m) => s + m.postCount, 0)
    return { total, active, totalScore, totalPosts }
  }, [members])

  const pointChartData = useMemo(() => {
    const top = [...members]
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10)
    return top.map((m) => ({
      name: m.name.split(" ").pop() || m.name,
      "Kỷ luật": m.kyLuat,
      "Đạo đức": m.daoDuc,
      "Cảm hứng": m.truyenCamHung,
    }))
  }, [members])

  const activityChartData = useMemo(() => {
    const top = [...members]
      .sort(
        (a, b) =>
          b.postCount + b.submissionCount + b.journalCount -
          (a.postCount + a.submissionCount + a.journalCount),
      )
      .slice(0, 10)
    return top.map((m) => ({
      name: m.name.split(" ").pop() || m.name,
      "Bài viết": m.postCount,
      "Tác phẩm": m.submissionCount,
      "Nhật ký": m.journalCount,
    }))
  }, [members])

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey as keyof DashboardMember] ?? 0
    const bVal = b[sortKey as keyof DashboardMember] ?? 0
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "desc"
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal)
    }
    return sortDir === "desc"
      ? Number(bVal) - Number(aVal)
      : Number(aVal) - Number(bVal)
  })

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  return {
    members,
    loading,
    search,
    setSearch,
    sortKey,
    sortDir,
    page,
    setPage,
    handleSort,
    handleBlock,
    handleUnblock,
    stats,
    pointChartData,
    activityChartData,
    paged,
    totalPages,
    sortedLength: sorted.length,
  }
}
