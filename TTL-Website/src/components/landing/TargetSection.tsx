"use client";

import Image from "next/image";
import { TARGET } from "@/utils/constants";
import { useScrollAnimation } from "@/hook/landing/useScrollAnimation";
import { cn } from "@/utils/cn";
import { Sparkles, Target } from "lucide-react";
import { SectionGlow } from "@/components/landing/Effects";
import TiltContainer from "@/components/ui/TiltContainer";

export default function TargetSection() {
  const { ref, visible } = useScrollAnimation(0.1);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 60%)" }} />
      <SectionGlow position="bottom" color="rgba(200,168,78,0.03)" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-12 items-center transition-all duration-800",
            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-125 order-2 lg:order-1 cursor-pointer">
            <TiltContainer className="size-full" limit={6}>
              <Image
                src="/images/target-genz.png"
                alt="Thanh thiếu niên & Gen Z Việt Nam"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </TiltContainer>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 0.5px var(--glass-border)" }} />
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase">
              {TARGET.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
              {TARGET.title}
            </h2>

            <div className="flex items-center gap-3 mt-5 mb-6">
              <Sparkles size={18} className="text-accent shrink-0" />
              <p className="text-lg font-semibold text-accent">
                {TARGET.emphasis}
              </p>
            </div>

            <div className="gradient-line max-w-sm mb-6" />

            <p className="leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{TARGET.text}</p>

            <div className="flex flex-wrap gap-4 mt-8">
              {["Hiền tài", "Thực chiến", "Kỷ luật thép", "Khát vọng lớn"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-4 py-2 text-xs flex items-center gap-1.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <Target size={12} className="text-accent" />
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
