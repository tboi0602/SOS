"use client";

import { useRef, useEffect } from "react";
import { Trophy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TopSalesHeader() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { y: 20, opacity: 0, duration: 0.5, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={headingRef} className="flex items-center gap-4 border-b border-[var(--border-base)] pb-6">
      <div className="size-12 rounded-2xl bg-linear-to-br from-amber-500/20 to-yellow-500/10 border flex items-center justify-center shadow-glow-amber" style={{ borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}>
        <Trophy size={22} className="text-amber-400 animate-pulse" />
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
          ĐẤU TRƯỜNG TINH ANH
        </h1>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">
          Vinh danh Top thành viên có điểm năng lực hệ thống cao nhất
        </p>
      </div>
    </div>
  );
}
