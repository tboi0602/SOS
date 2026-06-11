"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ECOSYSTEM } from "@/utils/constants";
import { Award, Globe } from "lucide-react";
import { SectionGlow } from "@/components/landing/Effects";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1] as const;

const portalIcons = [Award, Globe];

const cardVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.9, filter: "blur(6px)" },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease, delay: i * 0.1 },
  }),
};


export default function EcosystemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background Mesh Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, var(--mesh-1), transparent 60%), radial-gradient(ellipse 50% 40% at 50% 100%, var(--mesh-2), transparent 50%)",
        }}
      />
      <SectionGlow
        position="top"
        color="rgba(212,175,55,0.02)"
        size="ellipse_60%_30%"
      />

      <div ref={contentRef} className="relative z-10 mx-auto max-w-7xl px-8">
        {/* Header Title */}
        <motion.div
          className="text-center mb-16"
          style={{
            y: titleY,
            filter: `blur(${titleBlur}px)`,
            opacity: titleOpacity,
          }}
        >
          <span className="text-[10px] font-semibold text-accent tracking-[0.2em] uppercase bg-accent/10 rounded-full px-4 py-1.5">
            {ECOSYSTEM.badge}
          </span>
          <h2
            className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {ECOSYSTEM.title}
          </h2>
          <p
            className="mt-3 text-sm max-w-md mx-auto"
            style={{ color: "var(--text-tertiary)" }}
          >
            {ECOSYSTEM.subtitle}
          </p>
        </motion.div>

        {/* 4 Portals Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-4 gap-3">
          {ECOSYSTEM.portals.map((portal, i) => {
            const Icon = portalIcons[i];
            return (
              <motion.div
                key={portal.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="card p-7 group"
              >
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="inline-flex items-center justify-center">
                    {Icon ? (
                      <div className="relative">
                        <Image
                          src={`/images/tbv-logo.png`}
                          alt="Placeholder Icon"
                          width={94}
                          height={94}
                          className="text-accent rounded-xl "
                        />
                        <Icon
                          className="text-accent bg-amber-400/15 p-1 rounded-full absolute top-0 -right-2 backdrop-blur-md"
                          size={32}
                        />
                      </div>
                    ) : (
                      <Image
                        src={`/images/eco/eco-${i + 1}.jpg`}
                        alt="Placeholder Icon"
                        width={94}
                        height={94}
                        className="text-accent rounded-xl"
                      />
                    )}
                  </div>
                </div>

                <h3
                  className="text-base font-bold mb-2 transition-colors duration-300"
                  style={{ color: "var(--text-primary)" }}
                >
                  {portal.name}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {portal.desc}
                </p>

                <a
                  href={`https://` + portal.url}
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs font-medium text-accent  "
                >
                  {portal.url}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* --- KHU VỰC 4 LOGO CHẠY NGANG TRANG TRÍ --- */}
        <div className="mt-20 pt-12 border-t border-white/5 relative overflow-hidden w-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />

          <div className="flex w-full max-w-5xl mx-auto overflow-hidden mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <motion.div
              className="flex gap-6 pr-6 shrink-0 pt-2"
              animate={{
                x: ["0%", "-33.33%"],
              }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map((num, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -6,
                    filter: "brightness(1.16)",
                  }}
                  className="relative flex items-center justify-center p-4 w-fit rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <Image
                    src={`/images/logo/logo-${num}.jpg`}
                    alt={`Decoration Logo ${num}`}
                    width={100}
                    height={100}
                    className="object-contain rounded-xl filter opacity-95 transition-all duration-300 contrast-125 "
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
