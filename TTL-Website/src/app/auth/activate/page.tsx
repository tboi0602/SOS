"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { authService } from "@/service/auth.service";

function ActivateContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); return; }
    authService.activate(token).then(() => {
      setStatus("success");
    }).catch(() => {
      setStatus("error");
    });
  }, [searchParams]);

  return (
    <div className="relative min-h-screen flex overflow-hidden animate-fade-up" style={{ background: "var(--surface-base)" }}>
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 flex w-full items-center justify-center p-6">
        <div className="card p-8 max-w-md w-full text-center">
          {status === "loading" && (
            <div className="py-8 space-y-4">
              <Loader2 size={32} className="animate-spin mx-auto text-accent" />
              <p style={{ color: "var(--text-tertiary)" }}>Đang kích hoạt tài khoản...</p>
            </div>
          )}
          {status === "success" && (
            <div className="py-8 space-y-4">
              <CheckCircle size={48} className="mx-auto text-emerald-400" />
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Kích hoạt thành công!</h2>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Tài khoản của bạn đã được kích hoạt.</p>
              <Link href="/auth/login" className="inline-block mt-3 rounded-xl bg-accent hover:bg-accent-dark font-semibold px-6 py-3 text-sm transition-all cursor-pointer" style={{ color: "var(--text-primary)" }}>
                Đăng nhập ngay
              </Link>
            </div>
          )}
          {status === "error" && (
            <div className="py-8 space-y-4">
              <XCircle size={48} className="mx-auto text-danger" />
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Kích hoạt thất bại</h2>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Liên kết không hợp lệ hoặc đã hết hạn.</p>
              <Link href="/auth/login" className="inline-block mt-3 text-sm text-accent hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
      <ThemeToggleButton />
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen flex overflow-hidden" style={{ background: "var(--surface-base)" }}>
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <Loader2 size={32} className="animate-spin mx-auto text-accent" />
        </div>
      </div>
    }>
      <ActivateContent />
    </Suspense>
  );
}
