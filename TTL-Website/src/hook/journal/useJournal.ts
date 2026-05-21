"use client"

import { useState, useEffect, useRef } from "react"
import { api, type JournalEntry } from "@/service/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const res = await api.journal.getMyEntries()
      setEntries(res.entries)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const loadEntries = async () => {
      if (!active) return
      await fetchEntries()
    }

    void loadEntries()

    return () => {
      active = false
    }
  }, [])

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
    files.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const target = ev.target
        if (target?.result) setPreviews((prev) => [...prev, target.result as string])
      }
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setCreating(true)
    try {
      let imageUrls: string[] = []
      if (images.length > 0) {
        setUploading(true)
        const res = await api.journal.uploadMedia(images)
        imageUrls = res.urls
        setUploading(false)
      }
      await api.journal.create({ title: title.trim(), content: content.trim(), images: imageUrls })
      setTitle("")
      setContent("")
      setImages([])
      setPreviews([])
      setShowCreate(false)
      fetchEntries()
    } catch { } finally { setCreating(false) }
  }

  const handleDelete = async (id: string) => {
    try { await api.journal.delete(id); setEntries((prev) => prev.filter((e) => e.id !== id)) } catch { }
  }

  const totalPoints = entries.reduce((sum, e) => sum + e.points, 0)

  const getImgUrl = (url: string) => url.startsWith("http") ? url : `${API_URL}${url}`

  return {
    entries,
    loading,
    showCreate,
    setShowCreate,
    title,
    setTitle,
    content,
    setContent,
    images,
    previews,
    uploading,
    creating,
    fileRef,
    handleSelectFiles,
    removeImage,
    handleCreate,
    handleDelete,
    totalPoints,
    getImgUrl,
    refetch: fetchEntries,
  }
}
