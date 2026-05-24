"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { authService } from "@/service/auth.service"

export function useAuthActivate() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  )
  const [message, setMessage] = useState(token ? "" : "Thiếu mã kích hoạt")

  useEffect(() => {
    if (!token) return
    authService.activate(token)
      .then(async (res) => {
        setStatus("success")
        setMessage(res.message)
        await refreshUser()
        router.push("/home")
      })
      .catch((err) => { setStatus("error"); setMessage(err instanceof Error ? err.message : "Kích hoạt thất bại") })
  }, [token, refreshUser, router])

  return { status, message, router }
}
