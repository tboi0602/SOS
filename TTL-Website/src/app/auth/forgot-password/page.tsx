"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/service/auth.service";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi gửi yêu cầu", "error");
    } finally {
      setLoading(false);
    }
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
              Quên <span className="text-gradient">mật khẩu</span>
            </h1>
            <p className="leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Nhập email để nhận hướng dẫn đặt lại mật khẩu.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="flex items-center justify-center gap-2.5 mb-10 cursor-pointer lg:hidden">
              <Image src="/images/logo.png" alt="LOGO" width={40} height={40} unoptimized />
            </Link>
            <div className="card p-8">
              {sent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Email đã được gửi</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    Vui lòng kiểm tra email <strong style={{ color: "var(--text-primary)" }}>{email}</strong> để đặt lại mật khẩu.
                  </p>
                  <Link href="/auth/login" className="inline-block mt-3 text-sm text-accent hover:underline">
                    Quay lại đăng nhập
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Quên mật khẩu</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                      Nhập email để khôi phục mật khẩu
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                          border: "0.5px solid var(--border-base)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full rounded-xl bg-accent hover:bg-accent-dark font-semibold py-3 text-sm transition-all shadow-lg shadow-accent/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      style={{ color: "var(--text-primary)" }}>
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                      {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                  </form>
                  <p className="text-center text-sm mt-6" style={{ color: "var(--text-dim)" }}>
                    Nhớ mật khẩu?{" "}
                    <Link href="/auth/login" className="text-accent hover:underline">Đăng nhập</Link>
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
