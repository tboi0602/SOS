import { request, uploadSingleFile } from "./client"
import type { User, RegisterData } from "@/types/auth"

export const authService = {
  login(email: string, password: string) {
    return request<{ user: User; token: string }>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    })
  },

  register(data: RegisterData) {
    return request<{ user: User; token: string }>("/api/v1/auth/register", {
      method: "POST",
      body: data,
    })
  },

  googleLogin(credential: string) {
    return request<{ user: User; token: string }>("/api/v1/auth/google", {
      method: "POST",
      body: { credential },
    })
  },

  logout() {
    return request<{ message: string }>("/api/v1/auth/logout", { method: "POST" })
  },

  me() {
    return request<{ user: User }>("/api/v1/auth/me")
  },

  checkReferral(code: string) {
    return request<{ valid: boolean; name: string | null }>(
      `/api/v1/auth/referral/${code}`,
    )
  },

  activate(token: string) {
    return request<{ message: string; token?: string; user?: User }>("/api/v1/auth/activate", {
      method: "POST",
      body: { token },
    })
  },

  resendActivation(email: string) {
    return request<{ message: string }>("/api/v1/auth/resend-activation", {
      method: "POST",
      body: { email },
    })
  },

  forgotPassword(email: string) {
    return request<{ message: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: { email },
    })
  },

  resetPassword(token: string, password: string) {
    return request<{ message: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: { token, password },
    })
  },

  updateProfile(data: {
    name?: string
    job?: string
    address?: string
    avatar?: string | null
    bio?: string | null
    facebook?: string | null
    twitter?: string | null
    tiktok?: string | null
    youtube?: string | null
    zalo?: string | null
  }) {
    return request<{ user: User }>("/api/v1/auth/profile", {
      method: "PUT",
      body: data,
    })
  },

  changePassword(currentPassword: string, newPassword: string) {
    return request<{ message: string }>("/api/v1/auth/change-password", {
      method: "PUT",
      body: { currentPassword, newPassword },
    })
  },

  initTbvLogin() {
    return request<{ authUrl: string }>("/api/v1/auth/oidc/init")
  },

  uploadAvatar(file: File) {
    return uploadSingleFile<{ user: User }>("/api/v1/auth/avatar", file, "avatar")
  },

  deleteAccount() {
    return request<{ message: string }>("/api/v1/auth/account", { method: "DELETE" })
  },
}
