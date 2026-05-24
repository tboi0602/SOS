"use client";

import { Target, Shield, Medal, Sparkles } from "lucide-react";

interface CompetencyBarsProps {
  kLuat: number;
  dDuc: number;
  tC_Hung: number;
}

export default function CompetencyBars({
  kLuat,
  dDuc,
  tC_Hung,
}: CompetencyBarsProps) {
  const bars = [
    {
      label: "Kỷ luật",
      value: kLuat,
      color: "from-cyan to-primary",
      icon: Shield,
      textColor: "text-cyan bg-cyan/10",
    },
    {
      label: "Đạo đức",
      value: dDuc,
      color: "from-emerald-400 to-emerald-500",
      icon: Medal,
      textColor: "text-emerald-400 bg-emerald-400/10",
    },
    {
      label: "Truyền cảm hứng",
      value: tC_Hung,
      color: "from-amber-400 to-orange-500",
      icon: Sparkles,
      textColor: "text-amber-400 bg-amber-400/10",
    },
  ];

  return (
    <div className="rounded-2xl bg-linear-to-b from-white/3 to-transparent border border-white/5 p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 mb-4">
        <Target size={15} className="text-amber-400" /> Năng Lực Bản Thân
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full space-y-2">
          {bars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="p-2 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center ${p.textColor}`}
                  >
                    <Icon size={13} />
                  </div>
                  <span className="text-xs text-zinc-300 font-medium">
                    {p.label}
                  </span>
                </div>
                <span
                  className={`text-sm font-black bg-linear-to-r ${p.color} bg-clip-text text-transparent`}
                >
                  {p.value}{" "}
                  <span className="text-[9px] text-zinc-600 font-bold">
                    /100
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
