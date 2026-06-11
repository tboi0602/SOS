"use client"

import { useEffect, useRef } from "react"

export default function MouseGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame: number
    const pts: { x: number; y: number; age: number }[] = []
    const MAX_PTS = 60
    const MAX_AGE = 40
    let mx = -200
    let my = -200

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      pts.push({ x: e.clientX, y: e.clientY, age: 0 })
      if (pts.length > MAX_PTS) pts.splice(0, pts.length - MAX_PTS)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].age++
        if (pts[i].age > MAX_AGE) { pts.splice(i, 1); continue }
      }

      // Glow dưới chân chuột
      const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 50)
      grd.addColorStop(0, "rgba(250,204,21,0.2)")
      grd.addColorStop(0.5, "rgba(250,204,21,0.06)")
      grd.addColorStop(1, "rgba(250,204,21,0)")
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(mx, my, 50, 0, Math.PI * 2)
      ctx.fill()

      // Vệt sáng lazer
      if (pts.length >= 2) {
        for (let i = 1; i < pts.length; i++) {
          const t = pts[i].age / MAX_AGE
          const alpha = Math.max(0, 1 - t) * 0.6
          const w = Math.max(0.3, (1 - t) * 3)

          ctx.beginPath()
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
          ctx.lineTo(pts[i].x, pts[i].y)
          ctx.strokeStyle = `rgba(250,204,21,${alpha})`
          ctx.lineWidth = w
          ctx.lineCap = "round"
          ctx.shadowColor = `rgba(250,204,21,${alpha * 0.5})`
          ctx.shadowBlur = 25
          ctx.stroke()
        }
      }

      ctx.shadowBlur = 0
      frame = requestAnimationFrame(animate)
    }

    resize()
    frame = requestAnimationFrame(animate)

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onMove)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  )
}
