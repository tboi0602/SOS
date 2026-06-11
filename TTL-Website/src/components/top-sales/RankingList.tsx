"use client";
import { getInitial } from "@/utils/cn";

import { useRef, useEffect } from "react";
import { Briefcase, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TopSalesResponse } from "@/service/api";

gsap.registerPlugin(ScrollTrigger);

type Member = TopSalesResponse["members"][number];

export default function RankingList({
  members,
  startIndex = 4,
}: {
  members: Member[];
  startIndex?: number;
}) {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      const items = q(".rank-item");

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });

        tl.fromTo(items,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, force3D: true, stagger: gsap.utils.distribute({ base: 0.02, amount: 0.35, from: "start", ease: "power2.out" }), ease: "power3.out" }
        )
        .to(items,
          { scale: 1.01, duration: 0.12, force3D: true, ease: "power1.out", stagger: 0.04 },
          "-=0.05"
        )
        .to(items,
          { scale: 1, duration: 0.25, force3D: true, ease: "back.out(1.7)", stagger: 0.04 }
        );

        items.forEach((item) => {
          gsap.to(item, {
            y: gsap.utils.mapRange(0, 1, -6, 6),
            ease: "none", force3D: true,
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        });
      });
    });

    return () => ctx.revert();
  }, [members.length]);

  return (
    <div ref={listRef} className="rounded-2xl overflow-hidden" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <div className="divide-y divide-[var(--border-base)]">
        {members.map((m, i) => {
          const rank = startIndex + i;

          return (
            <div
              key={m.id}
              onClick={() => router.push(`/home/members/${m.id}`)}
              className="rank-item flex items-center gap-4 px-5 py-3.5 transition-all duration-200 group cursor-pointer"
              onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--surface-elevated) 18%, transparent)"; e.currentTarget.style.boxShadow = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="size-8 rounded-xl bg-[color-mix(in srgb, var(--text-primary) 30%, transparent)] border border-[var(--border-base)] flex items-center justify-center text-xs font-black text-[var(--text-tertiary)] shrink-0">
                {rank}
              </div>

              {m.avatar ? (
                <Image
                  src={m.avatar.replace("http://", "https://")}
                  alt={m.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-xl object-cover shrink-0 shadow-md border border-[var(--border-base)] group-hover:border-accent/40 transition-colors"
                />
              ) : (
                <div className="size-10 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-base)] flex items-center justify-center text-sm font-black text-[var(--text-tertiary)] shrink-0 shadow-md">
                  {getInitial(m.name)}
                </div>
              )}

              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-1 sm:gap-4">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-accent transition-colors truncate tracking-wide">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-tertiary)] truncate flex items-center gap-1 font-light">
                    <Briefcase size={10} className="text-[var(--text-tertiary)] shrink-0" />
                    {m.job || "Thành viên"}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <ScoreChip label="KL" value={m.kyLuat ?? 0} color="text-accent" bg="bg-accent/10" borderColor="color-mix(in srgb, var(--color-accent) 20%, transparent)" />
                  <ScoreChip label="ĐĐ" value={m.daoDuc ?? 0} color="text-green-400" bg="bg-green-400/10" borderColor="color-mix(in srgb, var(--color-success) 20%, transparent)" />
                  <ScoreChip label="TCH" value={m.truyenCamHung ?? 0} color="text-amber-400" bg="bg-amber-400/10" borderColor="color-mix(in srgb, var(--color-warning) 20%, transparent)" />
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
                    <Star size={9} className="text-accent" />
                    <span className="text-xs font-mono font-black text-accent">{m.score}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreChip({
  label,
  value,
  color,
  bg,
  borderColor,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  borderColor?: string;
}) {
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${bg}`} style={borderColor ? { borderColor } : undefined}>
      <span className="text-[9px] font-mono font-bold text-[var(--text-tertiary)]">{label}</span>
      <span className={`text-[11px] font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}


