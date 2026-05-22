"use client";

import Link from "next/link";
import { useAuthSettings as useSettings } from "@/hook/auth";
import { Loader2, Save, KeyRound, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const {
    user,
    authLoading,
    name,
    job,
    address,
    saving,
    currentPassword,
    newPassword,
    confirmNewPassword,
    changingPassword,
    setName,
    setJob,
    setAddress,
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
    handleProfileSubmit,
    handlePasswordSubmit,
  } = useSettings();

  if (authLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#0c1e3a] overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <Loader2
          size={32}
          className="animate-spin text-primary relative z-10"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0c1e3a] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Về trang chủ
        </Link>

        <div className="glass-strong rounded-2xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Cài đặt tài khoản
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            Quản lý thông tin cá nhân và bảo mật
          </p>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm text-zinc-400 font-medium"
              >
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="settings-email"
                className="text-sm text-zinc-400 font-medium"
              >
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-zinc-500 outline-none cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label
                  htmlFor="settings-job"
                  className="text-sm text-zinc-400 font-medium"
                >
                  Công việc
                </label>
                <input
                  id="settings-job"
                  type="text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="Nhân viên văn phòng"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="settings-address"
                  className="text-sm text-zinc-400 font-medium"
                >
                  Địa chỉ
                </label>
                <input
                  id="settings-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Hồ Chí Minh"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-1">Đổi mật khẩu</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Cập nhật mật khẩu đăng nhập của bạn
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="text-sm text-zinc-400 font-medium"
              >
                Mật khẩu hiện tại
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-sm text-zinc-400 font-medium"
              >
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmNewPassword"
                className="text-sm text-zinc-400 font-medium"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {changingPassword ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <KeyRound size={16} />
              )}
              {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
