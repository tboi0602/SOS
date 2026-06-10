"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ECOSYSTEM } from "@/utils/constants"
import { Award, ShoppingCart, Globe } from "lucide-react"
import { SectionGlow } from "@/components/landing/Effects"

const ease = [0.16, 1, 0.3, 1] as const

const portalIcons = [Award, ShoppingCart, Globe]

const cardVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.9, filter: "blur(6px)" },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease, delay: i * 0.1 },
  }),
}

export default function EcosystemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-80px" })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [60, 0])
  const titleBlur = useTransform(scrollYProgress, [0, 0.5], [8, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <section id="ecosystem" ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, var(--mesh-1), transparent 60%), radial-gradient(ellipse 50% 40% at 50% 100%, var(--mesh-2), transparent 50%)",
      }} />
      <SectionGlow position="top" color="rgba(212,175,55,0.02)" size="ellipse_60%_30%" />

      <div ref={contentRef} className="relative z-10 mx-auto max-w-7xl px-8">
        <motion.div className="text-center mb-16" style={{ y: titleY, filter: `blur(${titleBlur}px)`, opacity: titleOpacity }}>
          <span className="text-[10px] font-semibold text-accent tracking-[0.2em] uppercase bg-accent/10 rounded-full px-4 py-1.5">
            {ECOSYSTEM.badge}
          </span>
          <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {ECOSYSTEM.title}
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "var(--text-tertiary)" }}>{ECOSYSTEM.subtitle}</p>
        </motion.div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {ECOSYSTEM.portals.map((portal, i) => {
            const Icon = portalIcons[i]
            return (
              <motion.div
                key={portal.acronym}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="card p-7 group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 ring-1 ring-accent/10 transition-all duration-300 group-hover:ring-accent/30">
                    {Icon && <Icon size={20} className="text-accent" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-accent tracking-wider">{portal.acronym}</span>
                    <p className="text-[11px] font-medium" style={{ color: "var(--text-dim)" }}>{portal.subtitle}</p>
                  </div>
                </div>

                <h3 className="text-base font-bold mb-2 transition-colors duration-300" style={{ color: "var(--text-primary)" }}>{portal.name}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-tertiary)" }}>{portal.desc}</p>

                <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
                  {portal.url}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
