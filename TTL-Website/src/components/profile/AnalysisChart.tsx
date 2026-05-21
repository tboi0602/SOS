"use client";

import { useState } from "react";
import LineChart from "./LineChart";

type TimeFilter = "month" | "year" | "quarter";

export default function AnalysisChart({
  labels,
  datasets,
}: {
  labels: string[];
  datasets: { values: number[]; color: string }[];
}) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");

  return (
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff]">
          PHÂN TÍCH NĂNG LỰC
        </h3>
        <div
          className="flex gap-0.5 p-0.5 rounded-lg"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          {(["month", "quarter", "year"] as TimeFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setTimeFilter(key)}
              className={`px-2 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${timeFilter === key ? "text-black" : "text-zinc-500 hover:text-zinc-300"}`}
              style={
                timeFilter === key
                  ? {
                      background: "#00b7ff",
                      boxShadow: "0 0 10px rgba(0,183,255,0.4)",
                    }
                  : {}
              }
            >
              {key === "month"
                ? "Tháng"
                : key === "quarter"
                  ? "Quý"
                  : "Năm"}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 mb-3">
        Biểu đồ thống kê điểm số định kỳ
      </p>
      <div className="flex-1 flex items-center justify-center min-h-50">
        <LineChart labels={labels} datasets={datasets} />
      </div>
      <div className="flex justify-center gap-4 pt-3 mt-2 border-t border-white/4">
        {datasets.map((ds) => (
          <div key={ds.color} className="flex items-center gap-1.5">
            <div
              className="size-2 rounded-full"
              style={{
                background: ds.color,
                boxShadow: `0 0 6px ${ds.color}`,
              }}
            />
            <span className="text-[10px] text-zinc-400 font-medium">
              {ds.color === "#00b7ff"
                ? "Kỷ luật"
                : ds.color === "#10b981"
                  ? "Đạo đức"
                  : "Truyền cảm hứng"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
