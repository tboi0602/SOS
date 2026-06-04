"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { FEATURES_DATA } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { ShineCard, SectionGlow } from "@/components/landing/Effects";
import TiltContainer from "@/components/ui/TiltContainer";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(24,86,255,0.04)_0%,transparent_60%)]" />
      <SectionGlow position="center" color="rgba(34,211,238,0.03)" />

      <div className="relative z-10 mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-4"
        >
          <span className="text-[11px] font-semibold text-primary tracking-[0.2em] uppercase">
            Giải pháp
          </span>
          <h2 className="heading-lg font-bold text-white text-center">
            Năng lực <span className="text-gradient">cốt lõi</span>
          </h2>
        </motion.div>

        <div className="mt-16 space-y-20">
          {FEATURES_DATA.map((f, i) => {
            const isReversed = i % 2 === 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                animate={
                  inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                }
                transition={{ duration: 0.6, ease, delay: i * 0.15 }}
                className={cn(
                  "grid items-center gap-8 lg:gap-16",
                  isReversed
                    ? "lg:grid-flow-dense lg:grid-cols-2"
                    : "lg:grid-cols-2",
                )}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease, delay: i * 0.15 + 0.05 }}
                  className={cn(isReversed && "lg:col-start-2")}
                >
                  <span className="text-[11px] font-semibold text-cyan tracking-[0.15em] uppercase mb-2 block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{f.title}</h3>
                  <div className="divider-gradient my-5 max-w-xs" />
                  <p className="text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  animate={
                    inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}
                  }
                  transition={{ duration: 0.5, ease, delay: i * 0.15 + 0.1 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
                >
                  <ShineCard
                    lightColor="rgba(255,255,255,0.08)"
                    className="size-full"
                  >
                    <TiltContainer className="size-full" limit={6}>
                      <Image
                        src={`/images/features/features-${String(i + 1).padStart(2, "0")}.png`}
                        alt={f.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </TiltContainer>
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/6 rounded-2xl pointer-events-none" />
                  </ShineCard>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
