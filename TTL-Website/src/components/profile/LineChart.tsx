"use client";

export default function LineChart({
  labels,
  datasets,
}: {
  labels: string[];
  datasets: { values: number[]; color: string }[];
}) {
  const w = 380,
    h = 190,
    pad = { top: 15, bottom: 25, left: 28, right: 10 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const xStep = chartW / (labels.length - 1);
  const toX = (i: number) => pad.left + i * xStep;
  const toY = (v: number) => pad.top + chartH - (v / 100) * chartH;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <defs>
        {datasets.map((ds, di) => (
          <linearGradient key={di} id={`la${di}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ds.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line
            x1={pad.left}
            y1={toY(v)}
            x2={w - pad.right}
            y2={toY(v)}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
          />
          <text
            x={pad.left - 6}
            y={toY(v) + 3}
            textAnchor="end"
            fontSize="7"
            fontWeight="600"
            fill="rgba(255,255,255,0.2)"
          >
            {v}
          </text>
        </g>
      ))}
      {datasets.map((ds, di) => {
        const points = ds.values.map((v, i) => ({ x: toX(i), y: toY(v) }));
        const line = points
          .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
          .join(" ");
        return (
          <g key={di}>
            <path
              d={`${line} L${toX(points.length - 1)},${pad.top + chartH} L${toX(0)},${pad.top + chartH} Z`}
              fill={`url(#la${di})`}
            />
            <path
              d={line}
              fill="none"
              stroke={ds.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 2px 4px ${ds.color}30)` }}
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#070d22"
                stroke={ds.color}
                strokeWidth="1.5"
              />
            ))}
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text
          key={i}
          x={toX(i)}
          y={h - 6}
          textAnchor="middle"
          fontSize="8"
          fontWeight="600"
          fill="rgba(255,255,255,0.25)"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}
