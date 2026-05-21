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
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-lg font-extrabold text-primary">{step}</span>
          </div>
          {index < APPROACH_DATA.length - 1 && (
            <div className="w-px flex-1 min-h-15 bg-linear-to-b from-primary/40 to-transparent mt-2" />
          )}
        </div>

        <div className="glass rounded-2xl p-6 flex-1 border-t border-white/4 hover:bg-white/6 transition-all">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <div className="divider-cyan my-3" />
          <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}

export default function ApproachSection() {
  return (
    <section id="approach" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(34,211,238,0.04)_0%,transparent_60%)]" />
      <SectionGlow position="center" color="rgba(34,211,238,0.03)" size="ellipse_50%_40%" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-cyan tracking-[0.2em] uppercase">Lộ trình</span>
          <h2 className="heading-lg font-bold text-white mt-2">
            Hành trình <span className="text-gradient-cyan">phát triển</span>
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
          <div className="absolute inset-0 ring-1 ring-inset ring-white/6 rounded-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
