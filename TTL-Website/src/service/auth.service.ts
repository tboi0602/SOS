import { api } from "@/service/api"

export const authService = {
  login(email: string, password: string) {
    return api.auth.login(email, password)
  },

  register(data: { name: string; email: string; password: string; job?: string; address?: string; referralCode?: string }) {
    return api.auth.register(data)
  },

  googleLogin(credential: string) {
    return api.auth.google(credential)
  },

  logout() {
    return api.auth.logout()
  },

  me() {
    return api.auth.me()
  },

  checkReferral(code: string) {
    return api.auth.checkReferral(code)
  },

  activate(token: string) {
    return api.auth.activate(token)
  },

  resendActivation(email: string) {
    return api.auth.resendActivation(email)
  },

  forgotPassword(email: string) {
    return api.auth.forgotPassword(email)
  },

  resetPassword(token: string, password: string) {
    return api.auth.resetPassword(token, password)
  },

  updateProfile(data: { name?: string; job?: string; address?: string; avatar?: string | null; bio?: string | null; facebook?: string | null; twitter?: string | null; tiktok?: string | null; youtube?: string | null; zalo?: string | null }) {
    return api.auth.updateProfile(data)
  },

  changePassword(currentPassword: string, newPassword: string) {
    return api.auth.changePassword(currentPassword, newPassword)
  },

  uploadAvatar(file: File) {
    return api.auth.uploadAvatar(file)
  },
}
