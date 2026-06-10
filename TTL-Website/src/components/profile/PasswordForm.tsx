"use client";

import { useState } from "react";
import { Loader2, KeyRound, Lock, Eye, EyeOff } from "lucide-react";

const inputStyle =
  "w-full rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--clr-accent)]/40 focus:ring-1 focus:ring-[var(--clr-accent)]/20 outline-none transition-all";

export default function PasswordForm({
  currentPassword, newPassword, confirmNewPassword,
  changingPassword,
  onCurrentPasswordChange, onNewPasswordChange, onConfirmNewPasswordChange,
  onSubmit,
}: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  changingPassword: boolean;
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
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-[var(--clr-accent)] flex items-center gap-2">
            <KeyRound size={12} /> BẢO MẬT
          </h2>
          <p className="text-[10px] text-[var(--text-tertiary)] mt-1">Đổi mật khẩu đăng nhập</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[var(--text-tertiary)] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Lock size={10} /> Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCur ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => onCurrentPasswordChange(e.target.value)}
                required
                className={`${inputStyle} pr-9`}
              />
              <button type="button" onClick={() => setShowCur(!showCur)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-tertiary)] transition-colors cursor-pointer">
                {showCur ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[var(--text-tertiary)] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Lock size={10} /> Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
                className={`${inputStyle} pr-9`}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-tertiary)] transition-colors cursor-pointer">
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[var(--text-tertiary)] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Lock size={10} /> Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showCon ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                className={`${inputStyle} pr-9`}
              />
              <button type="button" onClick={() => setShowCon(!showCon)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-tertiary)] transition-colors cursor-pointer">
                {showCon ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={changingPassword}
          className="w-full rounded-lg bg-[var(--clr-accent)] hover:bg-[var(--clr-accent)]/90 text-black font-bold py-3 text-[11px] transition-all shadow-lg shadow-[var(--clr-accent)]/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
        >
          {changingPassword ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          {changingPassword ? "ĐANG ĐỔI..." : "ĐỔI MẬT KHẨU"}
        </button>
      </div>
    </form>
  );
}
