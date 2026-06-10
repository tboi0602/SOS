"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  lift?: number;
  glowColor?: string;
  onClick?: () => void;
}

export default function HoverCard({ children, className = "", style, lift = -3, glowColor, onClick }: HoverCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({ paused: true, defaults: { duration: 0.2, ease: "power2.out", force3D: true } });
    tl.to(el, { y: lift });
    if (glowColor) {
      tl.to(el, { boxShadow: `0 8px 32px ${glowColor}`, duration: 0.15 }, 0);
    }
    tl.to(el, { scale: 1.01 }, 0);

    const onEnter = () => tl.play();
    const onLeave = () => tl.reverse();

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      tl.kill();
    };
  }, [lift, glowColor]);

  return (
    <div ref={ref} className={className} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
