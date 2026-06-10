"use client";

export default function StarRadar({
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
  const labels = ["KỶ LUẬT", "ĐẠO ĐỨC", "CẢM HỨNG", "BÀI VIẾT", "GIỚI THIỆU"];
  const colors = ["var(--clr-accent)", "var(--clr-accent-light)", "var(--clr-accent)"];

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
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 480 440"
      className="overflow-visible"
      style={{ maxWidth: "520px", maxHeight: "480px" }}
    >
      <defs>
        <filter id="starRadarGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="starRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--clr-accent)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="var(--clr-accent-light)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--clr-primary-dark)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((scale, si) => (
        <polygon
          key={si}
          points={starPoints
            .map((p) => `${cx + (p.x - cx) * scale},${cy + (p.y - cy) * scale}`)
            .join(" ")}
          fill="none"
          style={{ stroke: "color-mix(in srgb, var(--clr-accent) 30%, transparent)" }}
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
          style={{ stroke: "color-mix(in srgb, var(--clr-accent) 18%, transparent)" }}
          strokeWidth={1}
        />
      ))}

      <polygon
        points={dataPath}
        fill="url(#starRadarGrad)"
        style={{ stroke: "var(--clr-accent)" }}
        strokeWidth="2.5"
        filter="url(#starRadarGlow)"
        strokeLinejoin="round"
      />

      {outerVerts.map((v, i) => {
        const isTop = i === 0;
        const isRight = i === 1 || i === 2;
        const isLeft = i === 3 || i === 4;
        return (
          <g key={i}>
            <circle cx={v.x} cy={v.y} r={18} fill="color-mix(in srgb, var(--clr-accent) 15%, transparent)" stroke="color-mix(in srgb, var(--clr-accent) 25%, transparent)" strokeWidth={2} />
            <text
              x={v.x}
              y={v.y + 5}
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              style={{ fill: "var(--clr-accent)" }}
              fontFamily="monospace"
            >
              {i + 1}
            </text>
            <text
              x={v.x}
              y={isTop ? v.y - 28 : v.y + 34}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              style={{ fill: "var(--text-primary)" }}
              letterSpacing="1"
            >
              {labels[i]}
            </text>
            <text
              x={v.x}
              y={isTop ? v.y - 46 : v.y + 52}
              textAnchor="middle"
              fontSize="16"
              fontWeight="900"
              fontFamily="monospace"
              style={{ fill: "var(--clr-accent)", filter: "drop-shadow(0 0 6px var(--clr-accent))" }}
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
        fontSize="34"
        fontWeight="900"
        style={{ fill: "var(--clr-accent)", filter: "drop-shadow(0 0 12px var(--clr-accent))" }}
        letterSpacing="-1"
      >
        {Math.round(scores.reduce((a, b) => a + b, 0) / 5)}
      </text>
      <text
        x={cx}
        y={cy + 24}
        textAnchor="middle"
        fontSize="10"
        style={{ fill: "var(--text-primary)" }}
        fontWeight="bold"
        letterSpacing="2"
      >
        NĂNG LỰC TỔNG
      </text>
    </svg>
  );
}
