"use client";

import { TrendingUp, Award, Calendar, Shield, Star } from "lucide-react";

interface Activity {
  icon: string;
  title: string;
  points: number;
  time: string;
}

const iconMap: Record<string, { comp: typeof TrendingUp; cls: string }> = {
  trending: { comp: TrendingUp, cls: "text-[#00b7ff]" },
  award: { comp: Award, cls: "text-amber-400" },
  book: { comp: Calendar, cls: "text-purple-400" },
  shield: { comp: Shield, cls: "text-emerald-400" },
  star: { comp: Star, cls: "text-yellow-400" },
};

export default function ActivityTimeline({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff] mb-3">
        HOẠT ĐỘNG GẦN ĐÂY
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-65">
        {activities.map((act, i) => {
          const m = iconMap[act.icon];
          const Icon = m?.comp;
          return (
            <div key={i} className="flex items-start gap-2.5 group">
              <div className="flex flex-col items-center">
                <div
                  className="size-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(0,183,255,0.06)" }}
                >
                  {Icon && <Icon size={12} className={m.cls} />}
                </div>
                {i < activities.length - 1 && (
                  <div
                    className="w-px h-8 mt-1.5"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,183,255,0.15), transparent)",
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 font-medium leading-tight">
                  {act.title}
                </p>
                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                  {act.time}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 font-mono shrink-0">
                +{act.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
