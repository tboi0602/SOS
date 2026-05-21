"use client"

import { useState, useEffect, useCallback } from "react"

export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })

  const handleMouse = useCallback((e: MouseEvent) => {
    setPos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [handleMouse])

  return pos
}
