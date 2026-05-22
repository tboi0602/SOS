"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, isInside: false });
  const rafRef = useRef<number | null>(null);
  const pulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const render = () => {
      const now = performance.now();
      const maxAge = 350;

      pointsRef.current = pointsRef.current.filter(
        (p) => now - p.time < maxAge,
      );
      const points = pointsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pulseRef.current += 0.04;
      const pulseFactor = Math.sin(pulseRef.current) * 4;

      if (mouseRef.current.isInside) {
        ctx.save();
        const glowRadius = 50 + pulseFactor;
        const glowGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          glowRadius,
        );
        glowGrad.addColorStop(0, "rgba(34, 211, 238, 0.35)");
        glowGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.1)");
        glowGrad.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(
          mouseRef.current.x,
          mouseRef.current.y,
          glowRadius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      }

      // 3. ĐƯỜNG VỆT SÁNG LIỀN MẠCH TUYỆT ĐỐI (SINGLE-PATH STROKE)
      if (points.length > 1) {
        ctx.save();

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 4; // Độ dày dải lụa neon ổn định chống đứt đoạn
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(6, 182, 212, 0.7)";

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // Tạo dải Gradient mờ dần từ đuôi lên đến đầu chuột
        const pTail = points[0];
        const pHead = points[points.length - 1];
        const dist = Math.hypot(pHead.x - pTail.x, pHead.y - pTail.y);

        if (dist > 1) {
          const lineGrad = ctx.createLinearGradient(
            pTail.x,
            pTail.y,
            pHead.x,
            pHead.y,
          );
          lineGrad.addColorStop(0, "rgba(34, 211, 238, 0)");
          lineGrad.addColorStop(0.3, "rgba(99, 102, 241, 0.25)");
          lineGrad.addColorStop(0.7, "rgba(34, 211, 238, 0.65)");
          lineGrad.addColorStop(1, "rgba(34, 211, 238, 0.95)");
          ctx.strokeStyle = lineGrad;
        } else {
          ctx.strokeStyle = "rgba(34, 211, 238, 0.95)";
        }

        ctx.stroke();
        ctx.restore();
      }

      if (!mouseRef.current.isInside && points.length === 0) {
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    const startRenderLoop = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isInside = true;

      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      });

      startRenderLoop();
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    startRenderLoop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0 bg-linear-to-br/oklch from-slate-950 via-slate-900 to-zinc-950" />

      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10 h-full w-full mix-blend-screen opacity-95"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20"
      >
        {children}
      </motion.div>
    </div>
  );
}
