"use client"

import Image from "next/image"
import { APPROACH_DATA } from "@/utils/constants"
import { useScrollAnimation } from "@/hook/landing/useScrollAnimation"
import { cn } from "@/utils/cn"
import { SectionGlow } from "@/components/landing/Effects"
import TiltContainer from "@/components/ui/TiltContainer"

function StepCard({ step, title, desc, index }: typeof APPROACH_DATA[0] & { index: number }) {
  const { ref, visible } = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-all duration-700",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${index * 180}ms` }}
    >
      <div className="flex items-start gap-6 cursor-pointer">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", border: "0.5px solid var(--glass-border)" }}>
            <span className="text-lg font-extrabold text-accent">{step}</span>
          </div>
          {index < APPROACH_DATA.length - 1 && (
            <div className="w-px flex-1 min-h-15 mt-2" style={{ background: "linear-gradient(to bottom, var(--color-accent), transparent)" }} />
          )}
        </div>

        <div className="glass rounded-2xl p-6 flex-1 transition-all" style={{ borderTop: "0.5px solid var(--glass-border)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <div className="gradient-line my-3" />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{desc}</p>
        </div>
      </div>
    </div>
  )
}

export default function ApproachSection() {
  return (
    <section id="approach" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 60%)" }} />
      <SectionGlow position="center" color="color-mix(in srgb, var(--color-accent) 5%, transparent)" size="ellipse_50%_40%" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase">Lộ trình</span>
          <h2 className="heading-lg font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            Hành trình <span className="text-gradient-gold">phát triển</span>
          </h2>
        </div>

        <div className="space-y-8">
          {APPROACH_DATA.map((s, i) => (
            <StepCard key={s.step} {...s} index={i} />
          ))}
        </div>

        <div className="mt-16 relative rounded-2xl overflow-hidden aspect-21/9 cursor-pointer">
          <TiltContainer className="size-full" limit={6}>
            <Image
              src="/images/approach-flow.png"
              alt="Hành trình phát triển"
              fill
              sizes="(max-width: 768px) 100vw, 67vw"
              className="object-cover"
            />
          </TiltContainer>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 0.5px var(--glass-border)" }} />
        </div>
      </div>
    </section>
  )
}
