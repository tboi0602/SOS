"use client";

import { Clock, Shield, Megaphone } from "lucide-react";

export default function TriangleChart({
  kyLuat,
  daoDuc,
  truyenCamHung,
}: {
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
}) {
  const cx = 240,
    cy = 220,
    r = 240;
  const angles = [
    -90 * (Math.PI / 180),
    30 * (Math.PI / 180),
    150 * (Math.PI / 180),
  ];
  const scores = [kyLuat, daoDuc, truyenCamHung];
  const vertices = angles.map((a) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  }));
  const dataPoints = scores.map((s, i) => ({
    x: cx + (s / 100) * r * Math.cos(angles[i]),
    y: cy + (s / 100) * r * Math.sin(angles[i]),
  }));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") +
    " Z";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 480 440"
      className="overflow-visible"
      style={{ maxWidth: "520px", maxHeight: "480px" }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="polyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--clr-accent)", stopOpacity: "0.35" }} />
          <stop offset="100%" style={{ stopColor: "var(--clr-accent-dark)", stopOpacity: "0.05" }} />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((scale, si) => (
        <polygon
          key={si}
          points={vertices
            .map((v) => `${cx + (v.x - cx) * scale},${cy + (v.y - cy) * scale}`)
            .join(" ")}
          fill="none"
          style={{ stroke: "color-mix(in srgb, var(--clr-accent) 52.1%, transparent)" }}
          strokeWidth={1}
          strokeDasharray={si === 3 ? "none" : "3,3"}
        />
      ))}
      {vertices.map((v, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={v.x}
          y2={v.y}
          style={{ stroke: "color-mix(in srgb, var(--clr-accent) 20%, transparent)" }}
          strokeWidth={1}
        />
      ))}

      <polygon
        points={dataPath}
        fill="url(#polyGrad)"
        style={{ stroke: "var(--clr-accent)" }}
        strokeWidth="2.5"
        filter="url(#glow)"
        strokeLinejoin="round"
      />

      {/* Icons + labels + scores at vertices */}
      {vertices.map((v, i) => {
        const Icon = [Clock, Shield, Megaphone][i];
        const labels = ["KỶ LUẬT", "ĐẠO ĐỨC", "CẢM HỨNG"];
        const isTop = i === 0;
        const dx = i === 0 ? 0 : i === 1 ? 1 : -1;
        return (
          <g key={i}>
            <foreignObject x={v.x - 20} y={v.y - 20} width="40" height="40">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "color-mix(in srgb, var(--clr-accent) 19%, transparent)",
                  borderRadius: "50%",
                  border: "2px solid color-mix(in srgb, var(--clr-accent) 31%, transparent)",
                }}
              >
                <Icon size={20} style={{ color: "var(--clr-accent)" }} />
              </div>
            </foreignObject>
            <text
              x={v.x + dx * -12}
              y={isTop ? v.y - 30 : v.y + 34}
              textAnchor={isTop ? "middle" : dx > 0 ? "start" : "end"}
              fontSize="10"
              fontWeight="700"
              style={{ fill: "var(--text-primary)" }}
              letterSpacing="1.5"
            >
              {labels[i]}
            </text>
            <text
              x={v.x + dx * 15}
              y={isTop ? v.y - 48 : v.y + 52}
              textAnchor={isTop ? "middle" : dx > 0 ? "start" : "end"}
              fontSize="16"
              fontWeight="900"
              fontFamily="monospace"
              style={{ fill: "var(--clr-accent)", filter: "drop-shadow(0 0 8px var(--clr-accent))" }}
            >
              {scores[i]}
            </text>
          </g>
        );
      })}

      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="36"
        fontWeight="900"
        style={{ fill: "var(--clr-accent)", filter: "drop-shadow(0 0 12px var(--clr-accent))" }}
        letterSpacing="-1"
      >
        {Math.round(scores.reduce((a, b) => a + b, 0) / 3)}
      </text>
      <text
        x={cx}
        y={cy + 24}
        textAnchor="middle"
        fontSize="10"
        style={{ fill: "var(--text-primary)" }}
        fontWeight="bold"
        letterSpacing="2.5"
      >
        NĂNG LỰC TỔNG
      </text>
    </svg>
  );
}
