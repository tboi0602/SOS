"use client";

import { Trophy, Medal, Crown, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { TopSalesResponse } from "@/service/api";
gsap.registerPlugin(ScrollTrigger);

type Member = TopSalesResponse["members"][number];

const scoreLabel = (label: string, value: number, color: string) => (
  <div className="flex items-center gap-1.5">
    <div className={`size-1.5 rounded-full ${color}`} />
    <span className="text-[9px] font-mono text-[var(--text-tertiary)]">{label}:</span>
    <span className={`text-[9px] font-bold font-mono ${color.replace('bg-', 'text-')}`}>{value}</span>
  </div>
);

function PodiumCard({
  member,
  rank,
  heightClass,
  borderColor,
  glowColor,
  avatarBorder,
  icon: Icon,
  isFirst,
}: {
  member: Member;
  rank: number;
  heightClass: string;
  borderColor: string;
  glowColor: string;
  avatarBorder: string;
  icon: typeof Trophy;
  isFirst?: boolean;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hoverTl = gsap.timeline({ paused: true, defaults: { force3D: true } });
    hoverTl.to(el, { y: -4, duration: 0.2, ease: "power2.out" })
      .to(el.querySelector(".avatar-glow"), { opacity: 1, scale: 1.15, duration: 0.25, ease: "power2.out" }, "-=0.1")
      .to(el.querySelector(".podium-icon"), { scale: 1.15, duration: 0.2, ease: "back.out(2)" }, "-=0.1");

    const onEnter = () => hoverTl.play();
    const onLeave = () => hoverTl.reverse();

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      hoverTl.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/home/members/${member.id}`)}
      className={`podium-card flex flex-col items-center w-28 sm:w-36 group cursor-pointer ${isFirst ? "-mt-8" : ""}`}
    >
      <div className={`relative mb-3 ${isFirst ? "mb-4" : ""}`}>
        <div className="avatar-glow absolute -inset-1.5 rounded-full" style={{ background: glowColor }} />
        {member.avatar ? (
          <Image
            src={member.avatar.replace("http://", "https://")}
            alt={member.name}
            width={isFirst ? 64 : 56}
            height={isFirst ? 64 : 56}
            className={`relative ${isFirst ? "size-14 sm:size-16" : "size-12 sm:size-14"} rounded-full object-cover border-2 shadow-lg group-hover:scale-105 transition duration-300`}
            style={avatarBorder ? { borderColor: avatarBorder } : undefined}
          />
        ) : (
          <div className={`relative ${isFirst ? "size-14 sm:size-16" : "size-12 sm:size-14"} rounded-full bg-[var(--surface-elevated)] border-2 flex items-center justify-center ${isFirst ? "text-xl" : "text-lg"} font-black text-[var(--text-primary)] shadow-lg group-hover:scale-105 transition duration-300`}
            style={avatarBorder ? { borderColor: avatarBorder } : undefined}>
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
        {isFirst && <Crown size={18} className="absolute -top-4 left-1/2 -translate-y-1/2 -translate-x-1/2 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce" />}
        {!isFirst && (
          <div className={`absolute -top-3 ${rank === 2 ? "-right-1" : "-left-1"} size-5 rounded-full text-[var(--border-base)] text-[10px] font-black flex items-center justify-center border-2 border-[var(--border-base)]`}
            style={{ background: borderColor }}>
            {rank}
          </div>
        )}
      </div>
      <p className={`${isFirst ? "text-sm font-black" : "text-xs font-bold"} text-[var(--text-primary)] truncate max-w-full text-center group-hover:text-accent transition-colors`}>
        {member.name}
      </p>
      <div className="flex flex-col items-center gap-0.5 mt-1.5 mb-2">
        {scoreLabel("KL", member.kyLuat ?? 0, "bg-accent")}
        {scoreLabel("ĐĐ", member.daoDuc ?? 0, "bg-green-400")}
        {scoreLabel("TCH", member.truyenCamHung ?? 0, "bg-amber-400")}
        <div className="flex items-center gap-1 mt-1 pt-1 border-t border-[var(--border-base)] w-full justify-center">
          <Star size={9} className="text-accent" />
          <span className={`font-mono font-black ${isFirst ? "text-sm text-amber-400" : "text-xs text-accent"}`}>
            {member.score}
          </span>
          <span className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest">TB</span>
        </div>
      </div>
      <div className={`w-full ${heightClass} rounded-t-2xl to-transparent border-t border-x border-[var(--border-base)] flex items-center justify-center shadow-inner group-hover:border-[var(--border-base)] transition-all duration-300`}
        style={{ background: `linear-gradient(to bottom, color-mix(in srgb, ${borderColor.replace('color-mix(in srgb, ', '').replace(/, transparent\)/, ' 10%, transparent)')}, transparent)` }}>
        <Icon size={isFirst ? 26 : 20} className={`podium-icon ${isFirst ? "text-amber-500/70" : "text-[var(--text-tertiary)]"}`} />
      </div>
    </div>
  );
}

export default function Podium({ members }: { members: Member[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      const cards = q(".podium-card");

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", force3D: true },
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });

        tl.fromTo(cards,
          { y: 50, opacity: 0, scale: 0.85, rotateX: 10 },
          { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.6, stagger: gsap.utils.distribute({ base: 0.05, amount: 0.3, from: "center", ease: "power2.inOut" }) }
        )
        .fromTo(cards,
          { scale: 1 },
          { scale: 1.04, duration: 0.15, stagger: 0.05, ease: "power1.inOut" },
          "-=0.1"
        )
        .to(cards,
          { scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" }
        )
        .fromTo(q(".podium-card .avatar-glow"),
          { opacity: 0.2, scale: 0.9 },
          { opacity: 0.6, scale: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={listRef} className="flex items-end justify-center gap-3 sm:gap-6 pt-12 pb-4 max-w-2xl mx-auto border-b border-[var(--border-base)]">
      {members[1] && (
        <PodiumCard
          member={members[1]}
          rank={2}
          heightClass="h-20 sm:h-24"
          borderColor="color-mix(in srgb, var(--text-primary) 40%, transparent)"
          glowColor="color-mix(in srgb, var(--text-primary) 20%, transparent)"
          avatarBorder="color-mix(in srgb, var(--text-primary) 40%, transparent)"
          icon={Medal}
        />
      )}
      {members[0] && (
        <PodiumCard
          member={members[0]}
          rank={1}
          heightClass="h-28 sm:h-36"
          borderColor="color-mix(in srgb, var(--color-warning) 30%, transparent)"
          glowColor="color-mix(in srgb, var(--color-warning) 30%, transparent)"
          avatarBorder="var(--color-warning)"
          icon={Trophy}
          isFirst
        />
      )}
      {members[2] && (
        <PodiumCard
          member={members[2]}
          rank={3}
          heightClass="h-16 sm:h-20"
          borderColor="color-mix(in srgb, var(--color-danger) 40%, transparent)"
          glowColor="color-mix(in srgb, var(--color-danger) 20%, transparent)"
          avatarBorder="color-mix(in srgb, var(--color-danger) 40%, transparent)"
          icon={Medal}
        />
      )}
    </div>
  );
}
