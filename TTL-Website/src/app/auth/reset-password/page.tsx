"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthResetPassword as useResetPassword } from "@/hook/auth";
import {
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

function ResetPasswordContent() {
  const {
    token,
    password,
    confirmPassword,
    showPassword,
    loading,
    done,
    error,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    handleSubmit,
    router,
  } = useResetPassword();

  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#0c1e3a] overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative z-10 glass-strong rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <h1 className="text-xl font-bold text-white mb-2">
            Liên kết không hợp lệ
          </h1>
          <p className="text-zinc-400 text-sm mb-4">
            Vui lòng yêu cầu đặt lại mật khẩu mới.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline text-sm"
          >
            Quên mật khẩu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0c1e3a] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 w-full max-w-md mx-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8 cursor-pointer"
        >
          <Image src="/images/logo.png" alt="SOS" width={40} height={40} unoptimized/>
          <span className="text-xl font-bold bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
            SOS — Sales Omni System
          </span>
        </Link>
        <div className="glass-strong rounded-2xl p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle2
                size={48}
                className="text-emerald-400 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-white mb-2">
                Đặt lại mật khẩu thành công!
              </h1>
              <p className="text-zinc-400 text-sm mb-6">
                Mật khẩu của bạn đã được cập nhật.
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="rounded-xl bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 text-sm transition-all shadow-lg shadow-primary/25 cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={28} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Đặt lại mật khẩu
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-danger/15 border border-danger/30 px-4 py-3 text-sm text-danger">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm text-zinc-400 font-medium"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      required
                      minLength={6}
                      className="w-full rounded-xl bg-white/5 border border-white/10 pl-4 pr-11 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm text-zinc-400 font-medium"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <KeyRound size={16} />
                  )}
                  {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </button>
              </form>
              <p className="text-center text-sm text-zinc-500 mt-6">
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Quay lại đăng nhập
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
