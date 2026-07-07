"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const chartTooltipStyle = {
  contentStyle: {
    background: "var(--surface-elevated)",
    border: "1px solid var(--border-base)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--text-primary)",
  },
  labelStyle: { color: "var(--text-primary)" },
};

export default function ChartSection({
  chartData,
}: {
  chartData: Array<{ name: string; [key: string]: string | number }>;
}) {
  return (
    <div className="chart-section rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Top 10 thành viên
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          barCategoryGap="20%"
          className="rounded-xl"
          accessibilityLayer={false}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-base)"
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...chartTooltipStyle} cursor={false} />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "var(--text-tertiary)" }}
          />
          <Bar
            dataKey="Kỷ luật"
            fill="var(--color-accent)"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
          <Bar
            dataKey="Đạo đức"
            fill="var(--color-accent-light)"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
          <Bar
            dataKey="Cảm hứng"
            fill="var(--color-accent-dark)"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
          <Bar
            dataKey="Bài viết"
            fill="#818cf8"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
          <Bar
            dataKey="Giới thiệu"
            fill="#f472b6"
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
