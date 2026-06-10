"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Briefcase, Shield, Medal, Sparkles, FileText, UserPlus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MemberInfo } from "@/service/api";

gsap.registerPlugin(ScrollTrigger);

interface MembersGridProps {
  filtered: MemberInfo[];
}

export default function MembersGrid({ filtered }: MembersGridProps) {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      const cards = q(".member-card");

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });

        tl.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, force3D: true, stagger: gsap.utils.distribute({ base: 0.02, amount: 0.3, from: "center", ease: "power1.inOut" }), ease: "power3.out" }
        )
        .to(cards,
          { scale: 1.03, duration: 0.12, force3D: true, stagger: 0.04, ease: "power1.out" },
          "-=0.05"
        )
        .to(cards,
          { scale: 1, duration: 0.3, force3D: true, stagger: 0.04, ease: "back.out(1.7)" }
        );
      });
    });

    return () => ctx.revert();
  }, [filtered.length]);

  return (
    <div ref={gridRef} className="rounded-2xl overflow-hidden" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
      <div className="divide-y divide-[var(--border-base)]">
        {filtered.map((m, index) => {
          const score = m.kyLuat != null ? Math.round((m.kyLuat + (m.daoDuc ?? 0) + (m.truyenCamHung ?? 0) + (m.postScore ?? 0) + (m.referredScore ?? 0)) / 5) : null;
          return (
            <div
              key={m.id}
              onClick={() => router.push(`/home/members/${m.id}`)}
              className="member-card w-full flex items-center gap-4 px-5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
              style={{ animationDelay: `${index * 60}ms`, boxShadow: "0 1px 3px color-mix(in srgb, var(--clr-primary) 8%, transparent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-strong)"; e.currentTarget.style.boxShadow = "0 8px 30px color-mix(in srgb, var(--clr-primary) 14%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "0 1px 3px color-mix(in srgb, var(--clr-primary) 8%, transparent)"; }}
            >
              <div className="shrink-0">
                {m.avatar ? (
                  <Image src={m.avatar} alt={m.name} width={40} height={40} className="size-10 rounded-xl object-cover transition-all" style={{ boxShadow: "0 0 0 1px var(--border-base)" }} />
                ) : (
                  <div className="size-10 rounded-xl bg-linear-to-br from-primary/15 to-accent/10 flex items-center justify-center text-sm font-bold text-primary">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-7 gap-2 items-center">
                <div className="col-span-2 min-w-0">
                  <p className="text-sm font-semibold group-hover:text-accent transition-colors truncate" style={{ color: "var(--text-primary)" }}>{m.name}</p>
                  <p className="text-[11px] truncate flex items-center gap-1 mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    <Briefcase size={10} className="shrink-0" style={{ color: "var(--text-tertiary)" }} /> {m.job || "Thành viên"}
                  </p>
                </div>

                <div className="col-span-4 grid grid-cols-5 gap-1.5 text-center">
                  <div className="px-1 py-1.5 rounded-lg" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)" }}>
                    <p className="text-xs font-bold text-accent">{m.kyLuat ?? 0}</p>
                    <p className="text-[8px] flex items-center justify-center gap-0.5" style={{ color: "var(--text-tertiary)" }}><Shield size={8} /> KL</p>
                  </div>
                  <div className="px-1 py-1.5 rounded-lg" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)" }}>
                    <p className="text-xs font-bold text-emerald-400">{m.daoDuc ?? 0}</p>
                    <p className="text-[8px] flex items-center justify-center gap-0.5" style={{ color: "var(--text-tertiary)" }}><Medal size={8} /> ĐĐ</p>
                  </div>
                  <div className="px-1 py-1.5 rounded-lg" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)" }}>
                    <p className="text-xs font-bold text-amber-400">{m.truyenCamHung ?? 0}</p>
                    <p className="text-[8px] flex items-center justify-center gap-0.5" style={{ color: "var(--text-tertiary)" }}><Sparkles size={8} /> TH</p>
                  </div>
                  <div className="px-1 py-1.5 rounded-lg" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)" }}>
                    <p className="text-xs font-bold text-sky-400">{m.postScore ?? 0}</p>
                    <p className="text-[8px] flex items-center justify-center gap-0.5" style={{ color: "var(--text-tertiary)" }}><FileText size={8} /> BV</p>
                  </div>
                  <div className="px-1 py-1.5 rounded-lg" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)" }}>
                    <p className="text-xs font-bold text-violet-400">{m.referredScore ?? 0}</p>
                    <p className="text-[8px] flex items-center justify-center gap-0.5" style={{ color: "var(--text-tertiary)" }}><UserPlus size={8} /> GT</p>
                  </div>
                </div>

                {score !== null && (
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>{score}</span>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Điểm</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
