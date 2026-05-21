"use client"

import { useRef, useState, useCallback, type ReactNode } from "react"

interface TiltContainerProps {
  children: ReactNode
  className?: string
  limit?: number
  transition?: string
}

export default function TiltContainer({
  children,
  className = "",
  limit = 8,
  transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
}: TiltContainerProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -limit
    const rotateY = (x - 0.5) * limit
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    })
  }, [limit])

  const handleMouseLeave = useCallback(() => {
    setStyle({})
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
