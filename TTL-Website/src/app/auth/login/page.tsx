"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthLogin as useLogin } from "@/hook/auth";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const {
    email,
    password,
    showPassword,
    loading,
    googleLoading,
    error,
    needsActivation,
    setEmail,
    setPassword,
    setShowPassword,
    handleSubmit,
    handleGoogle,
    handleResendActivation,
  } = useLogin();

  return (
    <div className="relative min-h-screen flex bg-[#0c1e3a] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-cyan/10" />
          <Image
            src="/images/auth-visual.svg"
            alt="auth-visual"
            fill
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="relative z-10 text-center px-12 max-w-lg">
            <Link href="/" className="block w-fit mx-auto mb-6">
              <Image
                src="/images/logo.png"
                alt="SOS"
                width={80}
                height={80}
                className="cursor-pointer"
                unoptimized
              />
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Đánh thức <span className="text-gradient">tiềm năng</span>
            </h1>
            <p className="text-zinc-400 leading-relaxed">
              SOS — Hệ thống bán hàng toàn diện. Trang bị hành trang Sales &amp;
              Marketing thực chiến cho thế hệ trẻ Việt Nam.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div
                className="w-2 h-2 rounded-full bg-cyan animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-accent animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="flex items-center justify-center gap-2.5 mb-10 group cursor-pointer lg:hidden"
            >
              <Image
                src="/images/logo.png"
                alt="SOS"
                width={40}
                height={40}
                unoptimized
              />
              <span className="text-xl font-bold bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
                SOS — Sales Omni System
              </span>
            </Link>

            <div className="glass-strong rounded-2xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Chào mừng bạn trở lại
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
                    htmlFor="email"
                    className="text-sm text-zinc-400 font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm text-zinc-400 font-medium"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
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

                {needsActivation && (
                  <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-3 text-sm text-amber-400">
                    Tài khoản chưa được kích hoạt.
                    <button
                      type="button"
                      onClick={handleResendActivation}
                      className="ml-1 underline hover:text-amber-300 cursor-pointer"
                    >
                      Gửi lại email kích hoạt
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogIn size={16} />
                  )}
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <div className="text-center">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-zinc-500 hover:text-primary transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </form>

              <div className="relative flex items-center gap-3 mt-6">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-zinc-600">hoặc</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <div className="mt-5">
                <GoogleLoginButton
                  onSuccess={handleGoogle}
                  loading={googleLoading}
                />
              </div>

              <p className="text-center text-sm text-zinc-500 mt-6">
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
