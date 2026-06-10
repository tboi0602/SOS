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
  pointChartData,
  activityChartData,
}: {
  pointChartData: Array<{ name: string; [key: string]: string | number }>;
  activityChartData: Array<{ name: string; [key: string]: string | number }>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="chart-section rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Top 10 điểm số
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={pointChartData}
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
              maxBarSize={20}
            />
            <Bar
              dataKey="Đạo đức"
              fill="var(--color-accent-light)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="Cảm hứng"
              fill="var(--color-accent-dark)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-section rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Top 10 hoạt động
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={activityChartData}
            barCategoryGap="20%"
            className="rounded-xl"
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
              dataKey="Bài viết"
              fill="var(--color-accent)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="Tác phẩm"
              fill="var(--color-accent-light)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="Nhật ký"
              fill="var(--color-accent-dark)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
