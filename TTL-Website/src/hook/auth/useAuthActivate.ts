"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/service/auth.service"

export function useAuthActivate() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  )
  const [message, setMessage] = useState(token ? "" : "Thiếu mã kích hoạt")

  useEffect(() => {
    if (!token) return
    authService.activate(token)
      .then((res) => { setStatus("success"); setMessage(res.message) })
      .catch((err) => { setStatus("error"); setMessage(err instanceof Error ? err.message : "Kích hoạt thất bại") })
  }, [token])

  return { status, message, router }
}
