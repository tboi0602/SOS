"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { HERO } from "@/utils/constants";
import { ArrowRight, Play } from "lucide-react";
import { useMousePosition } from "@/hook/common";
import TiltContainer from "@/components/ui/TiltContainer";

const ThreeScene = dynamic(() => import("@/components/landing/ThreeScene"), {
  ssr: false,
});
const RotatingCube = dynamic(() => import("@/components/ui/RotatingCube"), {
  ssr: false,
});

const ease = [0.16, 1, 0.3, 1] as const;

function HeroLighting() {
  const { x, y } = useMousePosition();
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        className="absolute top-1/4 -left-32 w-125 h-125 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 0.3], [x * 40 - 20, 0]),
          y: useTransform(scrollYProgress, [0, 0.3], [y * 40 - 20, 0]),
          opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-24 w-100 h-100 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(24,86,255,0.1) 0%, transparent 70%)",
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease, delay: 0.3 }}
      className="hidden lg:flex items-center justify-center w-full"
      style={{ scale }}
    >
      <div className="relative w-full h-120 min-h-100">
        <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-cyan/10 blur-3xl animate-pulse-soft" />
        <div
          className="absolute -bottom-4 -left-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl animate-pulse-soft"
          style={{ animationDelay: "-1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="size-full cursor-pointer">
          <TiltContainer className="size-full" limit={8}>
            <RotatingCube />
          </TiltContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll();
  const heroGlow = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity: sceneOpacity }}
      >
        <ThreeScene />
      </motion.div>

      <motion.div
        className="absolute inset-0 gradient-mesh"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.15], [0.6, 0.2]),
        }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#0c1e3a] via-transparent to-[#0c1e3a] opacity-80" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(34,211,238,0.03)_0%,transparent_70%)]"
        style={{ opacity: heroGlow }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(24,86,255,0.04)_0%,transparent_70%)]"
        style={{ opacity: heroGlow }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-[#0c1e3a] to-transparent" />

      <HeroLighting />

      <div
        ref={ref}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-[11px] font-semibold text-zinc-400 tracking-[0.15em] uppercase">
                {HERO.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
              className="heading-xl font-extrabold text-white leading-[1.05] whitespace-pre-line"
            >
              {HERO.title.split("\n")[0]}
              <br />
              <span className="text-gradient">{HERO.title.split("\n")[1]}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.35 }}
              className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg"
            >
              {HERO.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="divider-gradient mt-8 max-w-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.55 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="/home"
                className="group relative btn-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-primary z-10 transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {HERO.cta}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-zinc-300 glass glass-hover"
              >
                <Play size={15} />
                {HERO.secondary}
              </a>
            </motion.div>
          </motion.div>

          <HeroVisual />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.65 }}
        >
          <div className="relative mt-16 flex items-center gap-6 text-xs text-zinc-600">
            <span className="tracking-[0.15em] uppercase">Đối tác</span>
            <div className="gradient-line flex-1" />
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-zinc-500">
            {[
              "Doanh nghiệp vừa & nhỏ",
              "Startup",
              "Bán lẻ",
              "Sàn TMĐT",
              "Nhà phân phối",
            ].map((p) => (
              <span
                key={p}
                className="px-4 py-2 glass rounded-lg text-xs cursor-pointer hover:bg-white/10 transition-all"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
