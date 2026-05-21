"use client";

import { useState, useEffect } from "react";

function useClientRandom<T>(factory: () => T): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    setValue(factory());
  }, []);
  return value;
}

function Stars({ count = 160 }: { count?: number }) {
  const items = useClientRandom(() =>
    Array.from({ length: count }, (_, i) => {
      const type =
        i < count * 0.6
          ? "star"
          : i < count * 0.85
            ? "star-bright"
            : "star-blue";
      const hue =
        type === "star-blue"
          ? Math.random() > 0.5
            ? "rgba(34,211,238,"
            : "rgba(24,86,255,"
          : "";
      const alpha =
        type === "star-blue" ? (Math.random() * 0.3 + 0.15).toFixed(2) : "";
      return {
        type,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size:
          type === "star"
            ? `${Math.random() * 2 + 1}px`
            : `${Math.random() * 2.5 + 1.5}px`,
        delay: `${Math.random() * 8}s`,
        dur: `${Math.random() * 4 + 2}s`,
        bg: hue ? `${hue}${alpha})` : undefined,
      };
    }),
  );

  if (!items) return <div className="starfield" aria-hidden="true" />;

  return (
    <div className="starfield" aria-hidden="true">
      {items.map((s, i) => (
        <div
          key={i}
          className={s.type}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
            ...(s.bg ? { background: s.bg } : {}),
          }}
        />
      ))}
    </div>
  );
}

function ShootingStars({ count = 4 }: { count?: number }) {
  const items = useClientRandom(() =>
    Array.from({ length: count }, (_, i) => ({
      top: `${Math.random() * 40 + 5}%`,
      left: `${Math.random() * 40 + 50}%`,
      delay: `${Math.random() * 12 + i * 6}s`,
      dur: `${Math.random() * 1.5 + 1.5}s`,
      size: Math.random() * 1.5 + 1,
    })),
  );

  if (!items)
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      />
    );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    >
      {items.map((s, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
    </div>
  );
}

function Particles({ count = 40 }: { count?: number }) {
  const items = useClientRandom(() =>
    Array.from({ length: count }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 10}s`,
      dur: `${Math.random() * 8 + 6}s`,
      bg:
        i % 3 === 0
          ? "rgba(34,211,238,0.3)"
          : i % 3 === 1
            ? "rgba(24,86,255,0.25)"
            : "rgba(200,168,78,0.2)",
    })),
  );

  if (!items)
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      />
    );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    >
      {items.map((s, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.bg,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
    </div>
  );
}

function Orbs() {
  const list = [
    {
      w: 600,
      h: 600,
      bg: "rgba(24,86,255,0.07)",
      t: "3%",
      l: "-12%",
      dur: "18s",
      del: "0s",
    },
    {
      w: 400,
      h: 400,
      bg: "rgba(34,211,238,0.05)",
      t: "auto",
      b: "10%",
      r: "-8%",
      dur: "22s",
      del: "-5s",
    },
    {
      w: 350,
      h: 350,
      bg: "rgba(24,86,255,0.05)",
      t: "40%",
      l: "50%",
      dur: "16s",
      del: "-8s",
    },
    {
      w: 250,
      h: 250,
      bg: "rgba(200,168,78,0.04)",
      t: "70%",
      l: "15%",
      dur: "20s",
      del: "-3s",
    },
    {
      w: 180,
      h: 180,
      bg: "rgba(34,211,238,0.04)",
      t: "20%",
      l: "80%",
      dur: "14s",
      del: "-10s",
    },
    {
      w: 300,
      h: 300,
      bg: "rgba(24,86,255,0.03)",
      t: "80%",
      l: "75%",
      dur: "24s",
      del: "-6s",
    },
  ];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {list.map((o, i) => (
        <div
          key={i}
          className="orb"
          style={{
            width: `${o.w}px`,
            height: `${o.h}px`,
            background: o.bg,
            top: o.t,
            bottom: o.b,
            left: o.l,
            right: o.r,
            animationDuration: o.dur,
            animationDelay: o.del,
          }}
        />
      ))}
    </div>
  );
}

export default function BackgroundEffects() {
  return (
    <>
      <Stars />
      <ShootingStars />
      <Particles />
      <Orbs />
      <div className="vignette" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
    </>
  );
}
