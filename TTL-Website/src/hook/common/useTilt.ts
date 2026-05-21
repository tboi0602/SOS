"use client"

import { useRef, useCallback, useState } from "react"

export function useTilt(limit = 8) {
  const ref = useRef<HTMLDivElement>(null!)
  const [style, setStyle] = useState({})

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -limit
    const rotateY = (x - 0.5) * limit
    setStyle({ rotateX, rotateY })
  }, [limit])

  const handleMouseLeave = useCallback(() => {
    setStyle({})
  }, [])

  return { ref, style, handleMouseMove, handleMouseLeave }
}
