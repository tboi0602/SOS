"use client";

import { useState, useEffect, useId, useMemo } from "react";

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const vals = useMemo(() => {
    const r = () => Math.random();
    return {
      stars: Array.from({ length: 12 }, (_, i) => ({
        left: r(),
        top: r(),
        delay: r(),
        dur: 2 + r() * 3,
      })),
    };
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 15 }} aria-hidden="true" />;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 15 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes bgStarPulse${uid} {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
      `}</style>

      {vals.stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "2px", height: "2px",
            borderRadius: "50%",
            background: "var(--color-accent)",
            left: `${s.left * 100}%`,
            top: `${s.top * 100}%`,
            opacity: 0,
            animation: `bgStarPulse${uid} ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "color-mix(in srgb, var(--color-accent) 5%, transparent)", filter: "blur(100px)", top: "3%", left: "-10%" }} />
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "color-mix(in srgb, var(--color-accent) 4%, transparent)", filter: "blur(80px)", top: "40%", left: "50%" }} />
    </div>
  );
}
