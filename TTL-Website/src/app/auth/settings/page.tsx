"use client";

import { useState } from "react";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
              <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Mật khẩu mới</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
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
