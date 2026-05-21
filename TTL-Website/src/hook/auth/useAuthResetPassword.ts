"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/service/auth.service"

export function useAuthResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự"); return }
    if (password !== confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return }
    setLoading(true)
    try {
      await authService.resetPassword(token!, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại")
    } finally { setLoading(false) }
  }

  return {
    token, password, confirmPassword, showPassword, loading, done, error,
    setPassword, setConfirmPassword, setShowPassword,
    handleSubmit, router,
  }
}
