"use client";

import { Clock, Shield, Megaphone, PenSquare, UserPlus } from "lucide-react";

export default function StarChart({
  kyLuat,
  daoDuc,
  truyenCamHung,
  postScore,
  referredScore,
}: {
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  postScore: number;
  referredScore: number;
}) {
  const cx = 240, cy = 210, r = 200;
  const sides = 5;
  const angleOffset = -90;
  const outerAngles = Array.from({ length: sides }, (_, i) =>
    ((angleOffset + i * (360 / sides)) * Math.PI) / 180,
  );
  const innerAngles = Array.from({ length: sides }, (_, i) =>
    ((angleOffset + 36 + i * (360 / sides)) * Math.PI) / 180,
  );
  const innerR = r * 0.38;

  const scores = [kyLuat, daoDuc, truyenCamHung, postScore, referredScore];
  const colors = ["#6366f1", "#10b981", "#a855f7", "#f59e0b", "#ec4899"];
  const icons = [Clock, Shield, Megaphone, PenSquare, UserPlus];
  const labels = ["KỶ LUẬT", "ĐẠO ĐỨC", "CẢM HỨNG", "BÀI VIẾT", "GIỚI THIỆU"];

  const outerVerts = outerAngles.map((a) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  }));
  const innerVerts = innerAngles.map((a) => ({
    x: cx + innerR * Math.cos(a),
    y: cy + innerR * Math.sin(a),
  }));

  const starPoints = Array.from({ length: sides }, (_, i) =>
    [outerVerts[i], innerVerts[i]],
  ).flat();

  const dataPoints = scores.map((s, i) => ({
    x: cx + (s / 100) * r * Math.cos(outerAngles[i]),
    y: cy + (s / 100) * r * Math.sin(outerAngles[i]),
  }));

  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 480 440"
      className="overflow-visible"
      style={{ maxWidth: "520px", maxHeight: "480px" }}
    >
      <defs>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="starPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((scale, si) => (
        <polygon
          key={si}
          points={starPoints
            .map((p) => `${cx + (p.x - cx) * scale},${cy + (p.y - cy) * scale}`)
            .join(" ")}
          fill="none"
          stroke="var(--border-base)"
          strokeWidth={1}
          strokeDasharray={si === 3 ? "none" : "3,3"}
        />
      ))}
      {outerVerts.map((v, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={v.x}
          y2={v.y}
          stroke="var(--border-base)"
          strokeWidth={1}
          opacity={0.3}
        />
      ))}

      <polygon
        points={dataPath}
        fill="url(#starPolyGrad)"
        stroke="url(#starPolyGrad)"
        strokeWidth="2.5"
        filter="url(#starGlow)"
        strokeLinejoin="round"
      />

      {outerVerts.map((v, i) => {
        const Icon = icons[i];
        const isTop = i === 0;
        const isBottom = i === 2 || i === 3;
        return (
          <g key={i}>
            <foreignObject x={v.x - 18} y={v.y - 18} width="36" height="36">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${colors[i]}20`,
                  borderRadius: "50%",
                  border: `2px solid ${colors[i]}40`,
                }}
              >
                <Icon size={16} color={colors[i]} />
              </div>
            </foreignObject>
            <text
              x={v.x}
              y={isTop ? v.y - 26 : isBottom ? v.y + 34 : v.y + 34}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              style={{ fill: "var(--text-primary)" }}
              letterSpacing="1.5"
            >
              {labels[i]}
            </text>
            <text
              x={v.x}
              y={isTop ? v.y - 44 : isBottom ? v.y + 52 : v.y + 52}
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill={colors[i]}
              fontFamily="monospace"
              style={{ filter: `drop-shadow(0 0 4px ${colors[i]}40)` }}
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
        fontSize="32"
        fontWeight="900"
        fill="var(--text-primary)"
        letterSpacing="-0.5"
      >
        {Math.round(scores.reduce((a, b) => a + b, 0) / 5)}
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontSize="9"
        style={{ fill: "var(--text-secondary)" }}
        fontWeight="bold"
        letterSpacing="2"
      >
        NĂNG LỰC TỔNG
      </text>
    </svg>
  );
}
