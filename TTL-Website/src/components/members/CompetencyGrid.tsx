"use client";

import { Target, Layers } from "lucide-react";
import TriangleChart from "../profile/TriangleChart";

interface CompetencyGridProps {
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  totalCompetency: number;
}

export default function CompetencyGrid({
  kyLuat,
  daoDuc,
  truyenCamHung,
  totalCompetency,
}: CompetencyGridProps) {
  return (
    <div className="rounded-3xl bg-linear-to-b from-[#08102b] to-[#04081c] p-6 border border-white/5 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-6">
        <Target size={14} className="text-primary animate-pulse" /> Chỉ Số Năng
        Lực Thước Đo
      </h3>

      <div className="flex gap-5 flex-col lg:flex-row items-center">
        <div className="max-w-sm w-full mt-20">
          <TriangleChart
            kyLuat={kyLuat}
            daoDuc={daoDuc}
            truyenCamHung={truyenCamHung}
          />
        </div>
        <div className="flex flex-col w-full gap-4">
          {[
            {
              label: "Kỷ Luật",
              value: kyLuat ?? 0,
              color: "from-cyan via-blue-500 to-primary",
              shadow: "shadow-primary/20",
              desc: "Tinh thần nhất quán",
            },
            {
              label: "Đạo Đức",
              value: daoDuc ?? 0,
              color: "from-emerald-400 via-teal-400 to-emerald-600",
              shadow: "shadow-emerald-500/20",
              desc: "Giá trị cốt lõi",
            },
            {
              label: "Truyền Cảm Hứng",
              value: truyenCamHung ?? 0,
              color: "from-amber-400 via-orange-400 to-amber-600",
              shadow: "shadow-amber-500/20",
              desc: "Sức mạnh lan tỏa",
            },
          ].map((p, index) => {
            return (
              <div
                key={p.label}
                style={{ animationDelay: `${index * 100}ms` }}
                className="bg-black/20 py-1 rounded-2xl  border border-white/7 text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:bg-black/40 hover:border-white/10 group/item animate-[scaleUp_0.4s_ease-out_both]"
              >
                <div
                  className={`absolute inset-x-0 bottom-[-30%] h-1/2 bg-linear-to-t ${p.color} opacity-10 blur-xl group-item-hover:opacity-30 transition-opacity`}
                />

                <div
                  className={`text-2xl font-black tracking-tight bg-linear-to-b ${p.color} bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,1)]`}
                >
                  {p.value}
                </div>

                <p className="text-[11px] font-bold text-white tracking-wide">
                  {p.label}
                </p>
                <p className="text-[9px] text-zinc-500 font-light mt-0.5 hidden sm:block">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan">
            <Layers size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold">Năng lực tổng hòa</h4>
            <p className="text-[10px] text-zinc-500">
              Đánh giá trên toàn dữ liệu hoạt động
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            {totalCompetency}/100
          </span>
        </div>
      </div>
    </div>
  );
}
