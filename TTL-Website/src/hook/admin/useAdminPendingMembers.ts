"use client"

import { useState, useEffect, useCallback } from "react"
import { adminService, type PendingMember, type PendingItem } from "@/service/admin.service"

export function useAdminPendingMembers() {
  const [members, setMembers] = useState<PendingMember[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 20

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminService.getPendingMembers(page, limit)
      setMembers(res.members)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch {
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { members, loading, total, page, setPage, totalPages, refetch: fetch }
}

export function useUserPendingItems(userId: string | null) {
  const [items, setItems] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filterType, setFilterType] = useState<string | undefined>()
  const limit = 20

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await adminService.getUserPendingItems(userId, filterType, page, limit)
      setItems(res.items)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [userId, filterType, page])

  useEffect(() => {
    fetch()
  }, [fetch])

  const changeType = useCallback((type?: string) => {
    setFilterType(type)
    setPage(1)
  }, [])

  return { items, loading, total, page, setPage, totalPages, filterType, setFilterType: changeType, refetch: fetch }
}
