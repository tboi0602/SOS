"use client";

import { User, FileText } from "lucide-react";

interface ProfileTabsProps {
  tab: "profile" | "posts";
  onTabChange: (tab: "profile" | "posts") => void;
}

export default function ProfileTabs({ tab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex justify-between items-center pb-2 animate-fade-up" style={{ borderBottom: "1px solid var(--border-base)" }}>
      <div className="flex gap-2 p-1.5 rounded-2xl" style={{ background: "var(--surface-strong)", border: "1px solid var(--border-base)" }}>
        {[
          { key: "profile" as const, label: "Hồ Sơ Năng Lực", icon: User },
          {
            key: "posts" as const,
            label: "Dòng Hoạt Động",
            icon: FileText,
          },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer outline-none"
              style={active ? {
                background: "linear-gradient(135deg, var(--clr-accent), var(--clr-primary-dark))",
                color: "#000000",
                boxShadow: "0 10px 20px -5px color-mix(in srgb, var(--clr-accent) 40%, transparent)",
              } : {
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; }}}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; }}}
              onFocus={(e) => { e.currentTarget.style.outline = "2px solid var(--clr-accent)"; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
