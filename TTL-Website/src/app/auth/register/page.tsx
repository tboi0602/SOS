"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthRegister as useRegister } from "@/hook/auth";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Field from "@/components/auth/Field";
import ReferralField from "@/components/auth/ReferralField";
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
    referralStatus,
    referralName,
    setShowPassword,
    updateField,
    handleSubmit,
    handleGoogle,
  } = useRegister();
  const { toast } = useToast();

  useEffect(() => {
    if (error) toast(error, "error");
  }, [error]);

  return (
    <div className="relative min-h-screen flex bg-[#0c1e3a] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-cyan/20 via-transparent to-primary/10" />
          <Image
            src="/images/auth-visual.svg"
            alt=""
            fill
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="relative z-10 text-center px-12 max-w-lg">
            <Link href="/" className="block w-fit mx-auto mb-6 hover:scale-105">
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
              Kiến tạo <span className="text-gradient-cyan">tương lai</span>
            </h1>
            <p className="text-zinc-400 leading-relaxed">
              Tham gia SOS để trang bị kỹ năng Sales &amp; Marketing thực chiến,
              kết nối cộng đồng và phát triển bản thân.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Kỹ năng thực chiến",
                "Công nghệ AI",
                "Cộng đồng năng động",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-zinc-300 justify-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan" /> {item}
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
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Tạo tài khoản</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Tham gia cộng đồng SOS
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
                    className="text-sm text-zinc-400 font-medium"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
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

                <ReferralField
                  label="Mã giới thiệu (không bắt buộc)"
                  id="referralCode"
                  value={form.referralCode}
                  onChange={(v) => updateField("referralCode", v)}
                  placeholder="Nhập mã giới thiệu"
                  className="uppercase"
                  status={referralStatus}
                  name={referralName}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-zinc-600">hoặc</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <div className="mt-4">
                <GoogleLoginButton
                  onSuccess={handleGoogle}
                  loading={googleLoading}
                />
              </div>

              <p className="text-center text-sm text-zinc-500 mt-5">
                Đã có tài khoản?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
