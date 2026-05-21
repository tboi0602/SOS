"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { STATS_DATA } from "@/utils/constants"
import { SectionGlow } from "@/components/landing/Effects"

const ease = [0.16, 1, 0.3, 1] as const

function StatCard({ value, suffix, label, color, index }: typeof STATS_DATA[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, ease, delay: index * 0.1 }}
      className="glass rounded-3xl p-8 text-center hover:border-primary/20 transition-all duration-300"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, ease, delay: index * 0.1 + 0.15 }}
          className={`text-5xl sm:text-6xl font-extrabold bg-linear-to-b ${color} bg-clip-text text-transparent`}
        >
          {value}
        </motion.div>
        <div className="mt-2 text-sm font-semibold text-cyan/80 uppercase tracking-wider">{suffix}</div>
        <div className="gradient-line mx-auto mt-4 max-w-[60%]" />
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{label}</p>
      </div>
    </motion.div>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh-cyan" />
      <SectionGlow position="center" color="rgba(34,211,238,0.03)" />

      <div className="relative z-10 mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="gradient-line flex-1" />
            <span className="text-[11px] font-semibold text-zinc-500 tracking-[0.2em] uppercase">Thành tựu</span>
            <div className="gradient-line flex-1" />
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS_DATA.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
