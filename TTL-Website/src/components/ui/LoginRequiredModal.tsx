"use client";

import { useRouter } from "next/navigation";
import { LogIn, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginRequiredModal({ open, onClose, message }: Props) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 glass-strong rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <LogIn size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Yêu cầu đăng nhập</h3>
        <p className="text-sm text-zinc-400 mb-6">
          {message || "Vui lòng đăng nhập để sử dụng chức năng này."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/6 py-2.5 text-sm transition-all cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={() => router.push("/auth/login")}
            className="flex-1 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold py-2.5 text-sm transition-all cursor-pointer"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
