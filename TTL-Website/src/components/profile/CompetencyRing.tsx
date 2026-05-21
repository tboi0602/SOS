"use client";

export default function CompetencyRing({
  score,
  topPercent,
  level,
  strength,
}: {
  score: number;
  topPercent: string;
  level: string;
  strength: string;
}) {
  return (
    <div className="p-4">
      <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff] mb-4">
        NĂNG LỰC TỔNG HỢP
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
              style={{ filter: "drop-shadow(0 0 6px #00b7ff)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-white font-mono">
              {score}
            </span>
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">
              /100
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[
            { label: "Xếp hạng", val: topPercent, cls: "text-white" },
            { label: "Cấp bậc", val: level, cls: "text-white" },
            {
              label: "Điểm mạnh",
              val: strength,
              cls: "text-emerald-400 font-bold",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-[10px] py-1 px-2.5 rounded-lg bg-black/20 border border-white/2"
            >
              <span className="text-zinc-400">{item.label}</span>
              <span className={item.cls}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
