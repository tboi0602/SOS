"use client";

import { Suspense } from "react";
import { useAuthActivate as useActivate } from "@/hook/auth";
import { CheckCircle2, XCircle } from "lucide-react";

function ActivateContent() {
  const { status, message, router } = useActivate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0c1e3a] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative z-10 glass-strong rounded-2xl p-10 max-w-md w-full mx-4 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-white">Đang kích hoạt tài khoản...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 size={48} className="text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">
              Kích hoạt thành công!
            </h1>
            <p className="text-zinc-400">{message}</p>
            <button
              onClick={() => router.push("/home")}
              className="mt-4 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 text-sm transition-all cursor-pointer"
            >
              Về trang chủ
            </button>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle size={48} className="text-danger" />
            <h1 className="text-2xl font-bold text-white">
              Kích hoạt thất bại
            </h1>
            <p className="text-zinc-400">{message}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 text-sm transition-all cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={null}>
      <ActivateContent />
    </Suspense>
  );
}
