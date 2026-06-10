"use client";

import { FileText, Calendar, Zap } from "lucide-react";

interface StatsBlockProps {
  postCount: number;
  memberDays: number;
}

export default function StatsBlock({ postCount, memberDays }: StatsBlockProps) {
  return (
    <div className="rounded-3xl p-6 animate-fade-up" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4" style={{ color: "var(--text-tertiary)" }}>
        <Zap size={14} className="text-emerald-400" /> Tiến Trình Hệ
        Thống
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            label: "Bài viết chia sẻ",
            value: postCount,
            sub: "Nội dung chất lượng",
            icon: FileText,
            color: "text-accent",
          },
          {
            label: "Thời gian đồng hành",
            value: memberDays,
            suffix: " Ngày",
            sub: "Thành viên trung thành",
            icon: Calendar,
            color: "text-emerald-400",
          },
        ].map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 animate-fade-up"
              style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", animationDelay: `${index * 80}ms`, boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px color-mix(in srgb, var(--clr-primary) 18%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)"; }}
            >
              <div
                className={`size-12 rounded-xl flex items-center justify-center ${s.color}`}
                style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}
              >
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                  {s.value}
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    {s.suffix || ""}
                  </span>
                </div>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {s.label}
                </p>
                <p className="text-[9px] font-light" style={{ color: "var(--text-tertiary)" }}>
                  {s.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
