"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthLogin as useLogin } from "@/hook/auth";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import TbvLoginButton from "@/components/auth/TbvLoginButton";
import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
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
  const { toast } = useToast();

  useEffect(() => {
    if (error) toast(error, "error");
  }, [error, toast]);

  useEffect(() => {
    const ssoError = new URLSearchParams(window.location.search).get("error");
    if (!ssoError) return;
    const messages: Record<string, string> = {
      access_denied: "Bạn đã huỷ đăng nhập bằng Tinh Hoa Việt",
      missing_params: "Callback TBV thiếu thông tin xác thực",
      auth_failed: "Đăng nhập bằng Tinh Hoa Việt thất bại",
      TBV_OIDC_NOT_CONFIGURED: "SSO TBV chưa được cấu hình",
      TBV_OIDC_INVALID_STATE: "Phiên đăng nhập TBV không hợp lệ",
      TBV_OIDC_STATE_EXPIRED: "Phiên đăng nhập TBV đã hết hạn",
      TBV_OIDC_TOKEN_FAILED: "TBV từ chối đổi code lấy token",
      TBV_OIDC_USERINFO_FAILED: "Không lấy được thông tin người dùng từ TBV",
      TBV_OIDC_INVALID_PROFILE: "Thông tin người dùng TBV không hợp lệ",
    };
    toast(
      messages[ssoError] || "Đăng nhập bằng Tinh Hoa Việt thất bại",
      "error",
    );
  }, [toast]);

  return (
    <div
      className="relative min-h-screen flex overflow-hidden animate-fade-up"
      style={{ background: "var(--surface-base)" }}
    >
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/10" />
          <Image
            src="/images/auth-visual.svg"
            alt="auth-visual"
            fill
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="relative z-10  text-center px-12 max-w-lg">
            <Link href="/" className="block w-fit mx-auto mb-6">
              <Image
                src="/images/logo.png"
                alt="Tinh Hoa Việt"
                width={300}
                height={200}
                className="cursor-pointer hover:scale-105"
                unoptimized
              />
            </Link>
            <h1
              className="text-4xl font-bold mb-4 leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Đánh thức <span className="text-gradient">tiềm năng</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ color: "var(--text-tertiary)" }}
            >
              Cổng đăng ký trở thành đối tác thuộc hệ sinh thái tổ chức Tinh Hoa Việt
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div
                className="w-2 h-2 rounded-full bg-accent animate-pulse"
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
                alt="Tinh Hoa Việt"
                width={40}
                height={40}
                unoptimized
              />
              <span className="sr-only">TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT</span>
            </Link>

            <div className="card p-8">
              <div className="text-center mb-8">
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Đăng nhập
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Chào mừng bạn trở lại
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                    style={{ color: "var(--text-tertiary)" }}
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
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background:
                        "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                      border: "0.5px solid var(--border-base)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                    style={{ color: "var(--text-tertiary)" }}
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
                      className="w-full rounded-xl pl-4 pr-11 py-3 text-sm outline-none transition-all"
                      style={{
                        background:
                          "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                        border: "0.5px solid var(--border-base)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                      style={{ color: "var(--text-dim)" }}
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
                  <div
                    className="rounded-xl bg-amber-500/15 border px-4 py-3 text-sm text-amber-400"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-warning) 30%, transparent)",
                    }}
                  >
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
                  className="w-full rounded-xl bg-accent hover:bg-accent-dark font-semibold py-3 text-sm transition-all shadow-lg shadow-accent/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  style={{ color: "var(--text-primary)" }}
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
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </form>

              <div className="relative flex items-center gap-3 mt-6">
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-base)" }}
                />
                <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                  hoặc
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-base)" }}
                />
              </div>

              <div className="mt-5">
                <GoogleLoginButton
                  onSuccess={handleGoogle}
                  loading={googleLoading}
                />
              </div>

              <div className="mt-3">
                <TbvLoginButton />
              </div>

              <p
                className="text-center text-sm mt-6"
                style={{ color: "var(--text-dim)" }}
              >
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/register"
                  className="text-accent hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ThemeToggleButton />
    </div>
  );
}
