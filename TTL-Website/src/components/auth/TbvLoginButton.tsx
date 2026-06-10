"use client";

import { useState } from "react";
import { authService } from "@/service/auth.service";
import { useToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";

export default function TbvLoginButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { authUrl } = await authService.initTbvLogin();
      window.location.href = authUrl;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Không thể khởi tạo đăng nhập TBV", "error");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-xl bg-[#1a0906] hover:bg-[#2a100b] border border-[#dca14f]/40 text-white font-semibold py-3 text-[15px] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-[#1a0906]/30"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin text-[#dca14f]" />
        ) : (
          <img
            src="/images/tbv-logo.png"
            alt="Tinh Hoa Việt"
            width={24}
            height={24}
            className="size-6 shrink-0 object-contain"
          />
        )}
        {loading ? "Đang chuyển hướng..." : "Đăng nhập bằng Tinh Hoa Việt"}
      </button>
    </div>
  );
}
