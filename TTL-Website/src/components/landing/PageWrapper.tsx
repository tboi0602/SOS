"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

function MouseGlow() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouse = useCallback((e: MouseEvent) => {
    setPos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(300px at ${pos.x}% ${pos.y}%, rgba(34,211,238,0.08) 0%, transparent 40%),
                     radial-gradient(200px at ${pos.x}% ${pos.y}%, rgba(24,86,255,0.07) 0%, transparent 55%)`,
        transition: "background 0.1s ease-out",
      }}
    />
  );
}

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MouseGlow />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
