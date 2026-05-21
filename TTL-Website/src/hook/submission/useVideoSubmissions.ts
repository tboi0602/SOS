"use client"

import { useState, useEffect, useCallback } from "react"
import { api, type Submission } from "@/service/api"

export function useVideoSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [note, setNote] = useState("")
  const [creating, setCreating] = useState(false)
  const [penalty, setPenalty] = useState<{ penalized: boolean; daysOverdue: number; deducted?: number } | null>(null)

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.submission.getMySubmissions()
      setSubmissions(res.submissions)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  const checkPenalty = useCallback(async () => {
    try {
      const res = await api.submission.checkPenalty()
      setPenalty(res)
    } catch {
    }
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!active) return
      await Promise.all([fetchSubmissions(), checkPenalty()])
    }
    void load()
    return () => { active = false }
  }, [fetchSubmissions, checkPenalty])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setCreating(true)
    try {
      await api.submission.create({
        title: title.trim(),
        videoUrl: videoUrl.trim() || undefined,
        note: note.trim() || undefined,
      })
      setTitle("")
      setVideoUrl("")
      setNote("")
      await fetchSubmissions()
      await checkPenalty()
    } catch {
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.submission.delete(id)
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    } catch {
    }
  }

  const approvedCount = submissions.filter((s) => s.status === "approved").length
  const totalPoints = submissions.reduce((sum, s) => sum + s.points, 0)

  return {
    submissions,
    loading,
    title, setTitle,
    videoUrl, setVideoUrl,
    note, setNote,
    creating, handleCreate, handleDelete,
    penalty,
    approvedCount,
    totalPoints,
  }
}
