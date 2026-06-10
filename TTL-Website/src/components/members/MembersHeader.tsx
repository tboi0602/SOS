"use client";

import { useRef, useEffect } from "react";
import { Users, Search } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MembersHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
}

export default function MembersHeader({ search, onSearchChange, total }: MembersHeaderProps) {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el, { y: 20, opacity: 0, duration: 0.5, force3D: true, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-base)" }}>
      <div ref={headingRef} className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-accent-dark/10 border border-primary/20 flex items-center justify-center shadow-glow-gold">
          <Users size={22} className="text-accent animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
            CỘNG ĐỒNG ĐỐI TÁC
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Tổng số tinh anh: <span className="text-accent font-mono font-bold">{total}</span> thành viên
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-72 group">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" style={{ color: "var(--text-tertiary)" }} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm danh tính thành viên..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder:text-[var(--text-tertiary)] focus:border-accent/40 focus:ring-1 focus:ring-accent/10 outline-none transition-all duration-300 shadow-inner" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}
