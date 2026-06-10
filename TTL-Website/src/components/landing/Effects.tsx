"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useCallback } from "react"

interface SectionGlowProps {
  color?: string
  position?: "top" | "center" | "bottom"
  size?: string
}

export function SectionGlow({
  color = "rgba(88,19,15,0.06)",
  position = "top",
  size = "ellipse_80%_50%",
}: SectionGlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const posMap = {
    top: "at_50%_0%",
    center: "at_50%_50%",
    bottom: "at_50%_100%",
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: glowOpacity,
        background: `radial-gradient(${size}_${posMap[position]}, ${color} 0%, transparent 60%)`,
      }}
    />
  )
}

interface ShineCardProps {
  children: React.ReactNode
  className?: string
  lightColor?: string
}

export function ShineCard({ children, className = "", lightColor = "rgba(240,204,26,0.08)" }: ShineCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setShine({ x, y, opacity: 1 })
  }, [])

  const handleLeave = useCallback(() => {
    setShine((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: shine.opacity,
          background: `radial-gradient(circle 150px at ${shine.x}% ${shine.y}%, ${lightColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
