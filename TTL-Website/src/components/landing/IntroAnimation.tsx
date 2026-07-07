"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function IntroAnimation({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShowContent(true)
      },
    })

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 })
      .fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        "-=0.1",
      )
      .fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1.2, duration: 0.5, ease: "power2.out" },
        "-=0.4",
      )
      .to(logoRef.current, { scale: 0.4, opacity: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.5")
      .to(glowRef.current, { opacity: 0, scale: 0.3, duration: 0.4, ease: "power2.in" }, "-=0.35")
      .to(containerRef.current, { opacity: 0, duration: 0.2 }, "-=0.15")

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{
          background: "#0d0808",
          opacity: 0,
          pointerEvents: showContent ? "none" : "auto",
        }}
      >
        <div className="relative flex items-center justify-center">
          <div
            ref={glowRef}
            className="absolute rounded-full"
            style={{
              width: "150%",
              height: "150%",
              background:
                "radial-gradient(circle, rgba(212,168,67,0.35) 0%, rgba(212,168,67,0.1) 40%, transparent 70%)",
              opacity: 0,
            }}
          />
          <img
            ref={logoRef}
            src="/images/logo.png"
            alt="Tinh Hoa Việt"
            className="size-[27rem] md:size-[36rem] object-contain"
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 40px rgba(212,168,67,0.4)) drop-shadow(0 0 80px rgba(212,168,67,0.2))",
            }}
          />
        </div>
      </div>

      <div style={{ opacity: showContent ? 1 : 0, transition: "opacity 0.6s ease" }}>
        {children}
      </div>
    </>
  )
}
