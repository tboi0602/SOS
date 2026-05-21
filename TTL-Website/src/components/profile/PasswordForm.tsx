"use client";

import { useState } from "react";
import { Loader2, KeyRound, Lock, Eye, EyeOff } from "lucide-react";

const inputStyle =
  "w-full rounded-xl bg-black/30 border border-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#00b7ff]/40 focus:ring-1 focus:ring-[#00b7ff]/20 outline-none transition-all";

export default function PasswordForm({
  currentPassword, newPassword, confirmNewPassword,
  changingPassword, msg, error,
  onCurrentPasswordChange, onNewPasswordChange, onConfirmNewPasswordChange,
  onSubmit,
}: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  changingPassword: boolean;
  msg: string;
  error: string;
  onCurrentPasswordChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmNewPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);

  return (
    <form onSubmit={onSubmit}>
      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff] flex items-center gap-2">
            <KeyRound size={12} /> BẢO MẬT
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1">Đổi mật khẩu đăng nhập</p>
        </div>

        {msg && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 text-[11px] text-emerald-400 font-medium flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-400 shrink-0" /> {msg}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-[11px] text-red-400 font-medium flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-red-400 shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-3">
          {[
            { label: "Mật khẩu hiện tại", val: currentPassword, set: onCurrentPasswordChange, show: showCur, toggle: () => setShowCur(!showCur) },
            { label: "Mật khẩu mới", val: newPassword, set: onNewPasswordChange, show: showNew, toggle: () => setShowNew(!showNew), placeholder: "Ít nhất 6 ký tự" },
            { label: "Xác nhận mật khẩu", val: confirmNewPassword, set: onConfirmNewPasswordChange, show: showCon, toggle: () => setShowCon(!showCon), placeholder: "Nhập lại mật khẩu mới" },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Lock size={10} /> {f.label}
              </label>
              <div className="relative">
                <input
                  type={f.show ? "text" : "password"}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={(f as any).placeholder || ""}
                  required
                  minLength={f.label.includes("mới") && !f.label.includes("nhận") ? 6 : undefined}
                  className={`${inputStyle} pr-9`}
                />
                <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer">
                  {f.show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={changingPassword}
          className="w-full rounded-lg bg-[#00b7ff] hover:bg-[#00b7ff]/90 text-black font-bold py-3 text-[11px] transition-all shadow-lg shadow-[#00b7ff]/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
        >
          {changingPassword ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          {changingPassword ? "ĐANG ĐỔI..." : "ĐỔI MẬT KHẨU"}
        </button>
      </div>
    </form>
  );
}
