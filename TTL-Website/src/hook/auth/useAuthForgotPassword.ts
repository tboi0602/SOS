"use client"

import { useState } from "react"
import { authService } from "@/service/auth.service"

export function useAuthForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi yêu cầu thất bại")
    } finally {
      setLoading(false)
    }
  }

  return { email, loading, sent, error, setEmail, handleSubmit }
}
