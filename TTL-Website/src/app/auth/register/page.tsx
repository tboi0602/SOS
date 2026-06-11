"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthRegister as useRegister } from "@/hook/auth";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import TbvLoginButton from "@/components/auth/TbvLoginButton";
import Field from "@/components/auth/Field";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const {
    form,
    showPassword,
    loading,
    googleLoading,
    error,
    registered,
    setShowPassword,
    updateField,
    handleSubmit,
    handleGoogle,
  } = useRegister();
  const { toast } = useToast();

  useEffect(() => {
    if (error) toast(error, "error");
  }, [error, toast]);

  return (
    <div
      className="relative min-h-screen flex overflow-hidden animate-fade-up"
      style={{ background: "var(--surface-base)" }}
    >
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-transparent to-primary/10" />
          <Image
            src="/images/auth-visual.svg"
            alt="auth-visual"
            fill
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="relative z-10 text-center px-12 max-w-lg">
            <Link href="/" className="block w-fit mx-auto mb-6 hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Tinh Hoa Việt"
                width={300}
                height={300}
                className="cursor-pointer hover:scale-105"
                unoptimized
              />
            </Link>
            <h1
              className="text-3xl font-bold mb-4 leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Hệ sinh thái{" "}
              <span className="text-gradient-gold">Tinh Hoa Việt</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ color: "var(--text-tertiary)" }}
            >
              Cổng đăng ký trở thành đối tác thuộc hệ sinh thái tổ chức Tinh Hoa
              Việt
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Tìm Kiếm - Đề cử Tinh Hoa Việt",
                "Kiến tạo Di sản Việt",
                "Chia sẻ - Truyền cảm hứng - Phát triển",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm justify-center"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="flex items-center justify-center gap-2.5 mb-8 group cursor-pointer lg:hidden"
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
              {registered ? (
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      className="size-6 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Đăng ký thành công!
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Vui lòng kiểm tra email{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {form.email}
                    </strong>{" "}
                    để kích hoạt tài khoản. Nếu không thấy email, hãy kiểm tra
                    thư mục Spam.
                  </p>
                  <Link
                    href="/auth/login"
                    className="mt-3 rounded-xl bg-accent hover:bg-accent-dark font-semibold px-6 py-3 text-sm transition-all cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Đăng nhập
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h1
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Tạo tài khoản
                    </h1>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Tham gia cộng đồng Tinh Hoa Việt
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                      label="Họ và tên"
                      id="name"
                      value={form.name}
                      onChange={(v) => updateField("name", v)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                    <Field
                      label="Email"
                      id="reg-email"
                      type="email"
                      value={form.email}
                      onChange={(v) => updateField("email", v)}
                      placeholder="your@email.com"
                      required
                    />

                    <div className="space-y-1.5">
                      <label
                        htmlFor="reg-password"
                        className="text-sm font-medium"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={(e) =>
                            updateField("password", e.target.value)
                          }
                          placeholder="Ít nhất 6 ký tự"
                          required
                          minLength={6}
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Công việc"
                        id="job"
                        value={form.job}
                        onChange={(v) => updateField("job", v)}
                        placeholder="Nhân viên văn phòng"
                      />
                      <Field
                        label="Địa chỉ"
                        id="address"
                        value={form.address}
                        onChange={(v) => updateField("address", v)}
                        placeholder="Hồ Chí Minh"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-accent hover:bg-accent-dark font-semibold py-3 text-sm transition-all shadow-lg shadow-accent/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <UserPlus size={16} />
                      )}
                      {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
                    </button>
                  </form>

                  <div className="relative flex items-center gap-3 mt-5">
                    <div
                      className="flex-1 h-px"
                      style={{ background: "var(--border-base)" }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-dim)" }}
                    >
                      hoặc
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ background: "var(--border-base)" }}
                    />
                  </div>

                  <div className="mt-4">
                    <GoogleLoginButton
                      onSuccess={handleGoogle}
                      loading={googleLoading}
                    />
                  </div>

                  <div className="mt-3">
                    <TbvLoginButton />
                  </div>

                  <p
                    className="text-center text-sm mt-5"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Đã có tài khoản?{" "}
                    <Link
                      href="/auth/login"
                      className="text-accent hover:underline"
                    >
                      Đăng nhập
                    </Link>
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
