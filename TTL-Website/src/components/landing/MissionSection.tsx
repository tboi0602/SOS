"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MISSION } from "@/utils/constants"
import { SectionGlow } from "@/components/landing/Effects"

const ease = [0.16, 1, 0.3, 1] as const

const cardVariants = {
  hidden: { y: 80, opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease, delay: i * 0.1 },
  }),
}

export default function MissionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section id="truth" ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, var(--mesh-1), transparent 60%)" }} />
      <SectionGlow position="center" color="rgba(212,175,55,0.03)" size="ellipse_50%_40%" />

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-accent tracking-[0.2em] uppercase bg-accent/10 rounded-full px-4 py-1.5">
            {MISSION.badge}
          </span>
          <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {MISSION.title.split("—")[0]}
            <span className="text-gradient-gold">
              {" — "}{MISSION.title.split("—")[1]}
            </span>
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "var(--text-tertiary)" }}>{MISSION.subtitle}</p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-5 gap-4">
          {MISSION.items.map((item, i) => (
            <motion.div
              key={item.t}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="card p-6 text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-5 ring-1 ring-accent/10 group-hover:ring-accent/30 group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl font-extrabold text-accent">
                 T
                </span>
              </div>
              <h3 className="text-base font-bold mb-2 transition-colors duration-300" style={{ color: "var(--text-primary)" }}>{item.t}</h3>
              <div className="h-px mx-auto mb-3 max-w-8 transition-all duration-300" style={{ background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
