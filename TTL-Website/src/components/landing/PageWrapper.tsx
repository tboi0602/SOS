"use client";

import ParallaxBackground from "./ParallaxBackground";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: "var(--surface-base)" }}>
      <ParallaxBackground />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
