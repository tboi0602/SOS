"use client";

import { useState } from "react";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/service/auth.service";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (name) await authService.updateProfile({ name });
      if (currentPassword && newPassword) {
        await authService.changePassword(currentPassword, newPassword);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi cập nhật", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-up" style={{ background: "var(--surface-base)" }}>
      <div className="w-full max-w-lg">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
            Cài đặt tài khoản
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Họ và tên</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Mật khẩu hiện tại</label>
              <input id="currentPassword" type={showPassword ? "text" : "password"} value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Mật khẩu mới</label>
              <div className="relative">
                <input id="newPassword" type={showPassword ? "text" : "password"} value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                  className="w-full rounded-xl pl-4 pr-11 py-3 text-sm outline-none transition-all"
                  style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "var(--text-dim)" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-accent hover:bg-accent-dark font-semibold py-3 text-sm transition-all shadow-lg shadow-accent/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              style={{ color: "var(--text-primary)" }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {loading ? "Đang lưu..." : saved ? "Đã lưu ✓" : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
      <ThemeToggleButton />
    </div>
  );
}
