"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthForgotPassword as useForgotPassword } from "@/hook/auth";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { email, loading, sent, error, setEmail, handleSubmit } =
    useForgotPassword();

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
          {sent ? (
            <div className="text-center">
              <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Đã gửi email
              </h1>
              <p className="text-zinc-400 text-sm mb-6">
                Nếu email <strong className="text-white">{email}</strong> tồn
                tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.
              </p>
              <p className="text-xs text-zinc-600 mb-6">
                Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam).
              </p>
              <Link
                href="/auth/login"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Quên mật khẩu?
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Nhập email để nhận hướng dẫn đặt lại mật khẩu
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Mail size={16} />
                  )}
                  {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
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
