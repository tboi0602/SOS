"use client";

import { Target, Layers } from "lucide-react";
import StarRadar from "./StarRadar";

interface CompetencyGridProps {
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  postScore: number;
  referredScore: number;
  totalCompetency: number;
}

export default function CompetencyGrid({
  kyLuat,
  daoDuc,
  truyenCamHung,
  postScore,
  referredScore,
  totalCompetency,
}: CompetencyGridProps) {
  return (
    <div className="rounded-3xl p-6 relative overflow-hidden group animate-fade-up" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <div className="absolute top-0 right-0 size-32 rounded-full blur-2xl pointer-events-none" style={{ background: "color-mix(in srgb, var(--clr-accent) 10%, transparent)" }} />
      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6" style={{ color: "var(--text-tertiary)" }}>
        <Target size={14} className="text-accent animate-pulse" /> Chỉ Số Năng
        Lực Thước Đo
      </h3>

      <div className="flex gap-5 flex-col lg:flex-row items-center">
        <div className="w-full">
          <StarRadar
            kyLuat={kyLuat}
            daoDuc={daoDuc}
            truyenCamHung={truyenCamHung}
            postScore={postScore}
            referredScore={referredScore}
          />
        </div>
        <div className="flex flex-col w-full gap-4">
          {[
            {
              label: "Kỷ Luật",
              value: kyLuat ?? 0,
              color: "from-accent via-accent-dark to-primary",
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
            {
              label: "Bài Viết",
              value: postScore ?? 0,
              color: "from-sky-400 via-cyan-400 to-sky-600",
              shadow: "shadow-sky-500/20",
              desc: "Giá trị nội dung",
            },
            {
              label: "Giới Thiệu",
              value: referredScore ?? 0,
              color: "from-violet-400 via-purple-400 to-violet-600",
              shadow: "shadow-violet-500/20",
              desc: "Mở rộng mạng lưới",
            },
          ].map((p, index) => {
            return (
              <div
                key={p.label}
                style={{ animationDelay: `${index * 100}ms`, background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}
                className="py-1 rounded-2xl text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group/item animate-[scaleUp_0.4s_ease-out_both]"
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px color-mix(in srgb, var(--clr-primary) 18%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)"; }}
              >
                <div
                  className={`absolute inset-x-0 bottom-[-30%] h-1/2 bg-linear-to-t ${p.color} opacity-10 blur-xl group-hover/item:opacity-40 transition-opacity duration-500`}
                />

                <div
                  className={`text-2xl font-black tracking-tight bg-linear-to-b ${p.color} bg-clip-text text-transparent`}
                >
                  {p.value}
                </div>

                <p className="text-[11px] font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>
                  {p.label}
                </p>
                <p className="text-[9px] font-light mt-0.5 hidden sm:block" style={{ color: "var(--text-tertiary)" }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 p-4 rounded-xl flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px color-mix(in srgb, var(--clr-primary) 18%, transparent)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)"; }}
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Layers size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Năng lực tổng hòa</h4>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              Đánh giá trên toàn dữ liệu hoạt động
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-accent">
            {totalCompetency}/100
          </span>
        </div>
      </div>
    </div>
  );
}
