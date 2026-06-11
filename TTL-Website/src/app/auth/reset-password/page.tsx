"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden animate-fade-up" style={{ background: "var(--surface-base)" }}>
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/10" />
          <Image src="/images/auth-visual.svg" alt="" fill className="object-cover opacity-60" unoptimized />
          <div className="relative z-10 text-center px-12 max-w-lg">
            <Link href="/" className="block w-fit mx-auto mb-6">
              <Image src="/images/logo.png" alt="logo" width={80} height={80} className="cursor-pointer" unoptimized />
            </Link>
            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
              Đặt lại <span className="text-gradient">mật khẩu</span>
            </h1>
            <p className="leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Tạo mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="flex items-center justify-center gap-2.5 mb-10 cursor-pointer lg:hidden">
              <Image src="/images/logo.png" alt="logo" width={40} height={40} unoptimized />
            </Link>
            <div className="card p-8">
              {done ? (
                <div className="text-center py-4 space-y-3">
                  <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <Lock size={20} className="text-accent" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Mật khẩu đã được đặt lại</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    Bạn có thể đăng nhập với mật khẩu mới.
                  </p>
                  <Link href="/auth/login" className="inline-block mt-3 rounded-xl bg-accent hover:bg-accent-dark font-semibold px-6 py-3 text-sm transition-all cursor-pointer" style={{ color: "var(--text-primary)" }}>
                    Đăng nhập
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Đặt lại mật khẩu</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                      Nhập mật khẩu mới
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Mật khẩu mới</label>
                      <div className="relative">
                        <input id="password" type={showPassword ? "text" : "password"} value={password}
                          onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                          className="w-full rounded-xl pl-4 pr-11 py-3 text-sm outline-none transition-all"
                          style={{
                            background: "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                            border: "0.5px solid var(--border-base)",
                            color: "var(--text-primary)",
                          }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "var(--text-dim)" }}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Xác nhận mật khẩu</label>
                      <input id="confirm" type={showPassword ? "text" : "password"} value={confirm}
                        onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required minLength={6}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                          border: "0.5px solid var(--border-base)",
                          color: "var(--text-primary)",
                        }} />
                    </div>
                    <button type="submit" disabled={loading || password !== confirm}
                      className="w-full rounded-xl bg-accent hover:bg-accent-dark font-semibold py-3 text-sm transition-all shadow-lg shadow-accent/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      style={{ color: "var(--text-primary)" }}>
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                      {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </button>
                  </form>
                  <p className="text-center text-sm mt-6" style={{ color: "var(--text-dim)" }}>
                    <Link href="/auth/login" className="text-accent hover:underline">Quay lại đăng nhập</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ThemeToggleButton />
    </div>
  );
}
