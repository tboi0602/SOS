"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { HERO } from "@/utils/constants";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useMousePosition } from "@/hook/common";

const RotatingStar = dynamic(() => import("@/components/ui/RotatingStar"), {
  ssr: false,
});

function HeroLighting() {
  const { x, y } = useMousePosition();
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        className="absolute top-1/4 -left-32 w-125 h-125 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--glow-gold) 0%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 0.3], [x * 40 - 20, 0]),
          y: useTransform(scrollYProgress, [0, 0.3], [y * 40 - 20, 0]),
          opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-24 w-100 h-100 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,101,8,0.06) 0%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 0.3], [x * -30 + 15, 0]),
          y: useTransform(scrollYProgress, [0, 0.3], [y * -30 + 15, 0]),
          opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
        }}
      />
    </>
  );
}

function HeroVisual() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const yOffset = useTransform(scrollYProgress, [0, 0.15], [0, 20]);

  return (
    <motion.div
      className="hidden lg:flex items-center justify-center w-full"
      style={{ scale, y: yOffset }}
    >
      <div className="relative w-full h-120 min-h-100">
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" />
        <div
          className="absolute -bottom-6 -left-16 w-56 h-56 rounded-full bg-primary/15 blur-3xl animate-pulse-soft"
          style={{ animationDelay: "-1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-pulse-soft" />
        <div className="relative size-full cursor-pointer">
          <RotatingStar />
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const titleWords = HERO.title.split(" ");

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-[1] gradient-mesh"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0.8, 0.3]) }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, var(--hero-gradient-from) 0%, transparent 40%, transparent 60%, var(--hero-gradient-from) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1] bg-linear-to-t from-[var(--fade-to-bottom)] to-transparent" />

      <HeroLighting />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div>
            <span className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 mb-8">
              <Sparkles size={14} className="text-accent" />
              <span
                className="text-[10px] font-semibold"
                style={{ color: "var(--text-tertiary)" }}
              >
                {HERO.badge}
              </span>
            </span>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {titleWords.map((w, i) => (
                <span key={i} className="word inline-block mr-[0.28em]">
                  {w === "Trí" ||
                  w === "tuệ" ||
                  w === "Lưu" ||
                  w === "truyền" ? (
                    <span className="text-gradient">{w}</span>
                  ) : (
                    w
                  )}
                </span>
              ))}
              <span className="block mt-3 text-sm sm:text-base font-semibold tracking-[0.15em] text-accent/80">
                {HERO.tagline}
              </span>
            </h1>

            <p
              className="mt-8 text-base sm:text-lg leading-relaxed max-w-lg"
              style={{ color: "var(--text-tertiary)" }}
            >
              {HERO.subtitle}
            </p>

            <div
              className="h-px mt-10 max-w-xs"
              style={{
                background:
                  "linear-gradient(90deg, var(--glass-border), transparent)",
              }}
            />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/home"
                className="btn-el group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-accent hover:bg-accent-dark shadow-lg shadow-accent/25 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {HERO.cta}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </span>
              </a>
              <a
                href="#truth"
                className="btn-el inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold glass"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Play size={15} />
                {HERO.secondary}
              </a>
            </div>
          </motion.div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
