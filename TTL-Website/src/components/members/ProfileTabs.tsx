"use client";

import { User, FileText } from "lucide-react";

interface ProfileTabsProps {
  tab: "profile" | "posts";
  onTabChange: (tab: "profile" | "posts") => void;
}

export default function ProfileTabs({ tab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <div className="flex gap-2 p-1.5 rounded-2xl bg-[#070d24] border border-white/5 shadow-2xl">
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${active
                ? "bg-linear-to-r from-primary to-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(24,86,255,0.4)] scale-100"
                : "text-zinc-400 hover:text-white hover:bg-white/2"
                }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
