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
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(24,86,255,0.05)_0%,transparent_60%)]" />
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
            <div className="absolute inset-0 ring-1 ring-inset ring-white/6 rounded-2xl pointer-events-none" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase">
              {TARGET.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {TARGET.title}
            </h2>

            <div className="flex items-center gap-3 mt-5 mb-6">
              <Sparkles size={18} className="text-cyan shrink-0" />
              <p className="text-lg font-semibold text-cyan">
                {TARGET.emphasis}
              </p>
            </div>

            <div className="divider-gradient max-w-sm mb-6" />

            <p className="text-zinc-400 leading-relaxed">{TARGET.text}</p>

            <div className="flex flex-wrap gap-4 mt-8">
              {["Hiền tài", "Thực chiến", "Kỷ luật thép", "Khát vọng lớn"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-4 py-2 text-xs text-zinc-400 flex items-center gap-1.5"
                  >
                    <Target size={12} className="text-cyan" />
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
