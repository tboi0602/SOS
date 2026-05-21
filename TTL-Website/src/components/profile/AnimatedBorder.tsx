"use client";

import type { ReactNode } from "react";

export default function AnimatedBorder({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={style}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ border: "1px solid rgba(0,183,255,0.08)" }}
      />

      {children}
    </div>
  );
}
