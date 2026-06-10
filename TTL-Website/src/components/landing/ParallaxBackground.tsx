"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useId } from "react"

function useClientId() {
  const id = useId()
  return id.replace(/[^a-zA-Z0-9]/g, "")
}

function ParallaxOrbs() {
  return (
    <>
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "500px", height: "500px",
          background: "color-mix(in srgb, var(--color-accent) 5%, transparent)",
          filter: "blur(100px)",
          top: "5%", left: "-15%",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "350px", height: "350px",
          background: "color-mix(in srgb, var(--color-accent) 4%, transparent)",
          filter: "blur(80px)",
          bottom: "15%", right: "-10%",
        }}
      />
    </>
  )
}

export default function ParallaxBackground() {
  const { scrollY } = useScroll()
  const rawY = useTransform(scrollY, (v) => -v * 0.3)
  const y = useSpring(rawY, { stiffness: 80, damping: 30 })
  const uid = useClientId()

  return (
    <motion.div
      className="fixed top-0 left-0 w-full pointer-events-none overflow-hidden"
      style={{ y, height: "300vh", zIndex: 0 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 gradient-mesh" />

      <ParallaxOrbs />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "60px 60px",
        }}
      />
    </motion.div>
  )
}
