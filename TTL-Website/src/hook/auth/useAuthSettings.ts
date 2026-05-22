"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { authService } from "@/service/auth.service"
import { useToast } from "@/components/ui/Toast"

export function useAuthSettings() {
  const router = useRouter()
  const { user, loading: authLoading, refreshUser } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [job, setJob] = useState("")
  const [address, setAddress] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [bio, setBio] = useState("")
  const [facebook, setFacebook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [tiktok, setTiktok] = useState("")
  const [youtube, setYoutube] = useState("")
  const [zalo, setZalo] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login")
  }, [user, authLoading, router])

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      if (!user) return

      setName(user.name || "")
      setJob(user.job || "")
      setAddress(user.address || "")
      setAvatar(user.avatar)
      setBio(user.bio || "")
      setFacebook(user.facebook || "")
      setTwitter(user.twitter || "")
      setTiktok(user.tiktok || "")
      setYoutube(user.youtube || "")
      setZalo(user.zalo || "")
    }, 0)

    return () => {
      window.clearTimeout(syncTimer)
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authService.updateProfile({
        name,
        job: job || undefined,
        address: address || undefined,
        bio: bio || undefined,
        facebook: facebook || undefined,
        twitter: twitter || undefined,
        tiktok: tiktok || undefined,
        youtube: youtube || undefined,
        zalo: zalo || undefined,
      })
      await refreshUser()
      toast("Cập nhật thông tin thành công", "success")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Cập nhật thất bại", "error")
    } finally { setSaving(false) }
  }

  const handleAvatarUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await authService.uploadAvatar(file)
      setAvatar(res.user.avatar)
      await refreshUser()
      toast("Cập nhật ảnh đại diện thành công", "success")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload thất bại", "error")
    } finally { setUploading(false) }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) { toast("Mật khẩu mới phải có ít nhất 6 ký tự", "error"); return }
    if (newPassword !== confirmNewPassword) { toast("Mật khẩu xác nhận không khớp", "error"); return }
    setChangingPassword(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      toast("Đổi mật khẩu thành công", "success")
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Đổi mật khẩu thất bại", "error")
    } finally { setChangingPassword(false) }
  }

  return {
    user, authLoading,
    name, job, address, avatar, bio, saving, uploading,
    facebook, twitter, tiktok, youtube, zalo,
    currentPassword, newPassword, confirmNewPassword, changingPassword,
    setName, setJob, setAddress, setBio,
    setFacebook, setTwitter, setTiktok, setYoutube, setZalo,
    setCurrentPassword, setNewPassword, setConfirmNewPassword,
    handleProfileSubmit, handleAvatarUpload, handlePasswordSubmit,
  }
}
