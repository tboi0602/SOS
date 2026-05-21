"use client"

import { useState, useEffect, useCallback } from "react"
import { api, type Submission, type JournalEntry } from "@/service/api"

export function useAdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.admin.listPendingSubmissions(page, limit)
      setSubmissions(res.submissions)
      setTotal(res.total)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { void fetch() }, [fetch])

  const approve = async (id: string, adminNote?: string) => {
    await api.admin.approveSubmission(id, adminNote)
    await fetch()
  }

  const reject = async (id: string, adminNote?: string) => {
    await api.admin.rejectSubmission(id, adminNote)
    await fetch()
  }

  return { submissions, loading, total, page, setPage, limit, approve, reject, refetch: fetch }
}

export function useAdminJournals() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.admin.listPendingJournals(page, limit)
      setEntries(res.entries)
      setTotal(res.total)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { void fetch() }, [fetch])

  const approve = async (id: string, adminNote?: string) => {
    await api.admin.approveJournal(id, adminNote)
    await fetch()
  }

  const reject = async (id: string, adminNote?: string) => {
    await api.admin.rejectJournal(id, adminNote)
    await fetch()
  }

  return { entries, loading, total, page, setPage, limit, approve, reject, refetch: fetch }
}
