"use client";

import type { LucideIcon } from "lucide-react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import DateFilter from "./DateFilter";

export function statusFilters(allIcon: LucideIcon) {
  return [
    { key: "all", label: "Tất cả", icon: allIcon },
    { key: "pending", label: "Chờ duyệt", icon: Clock },
    { key: "approved", label: "Đã duyệt", icon: CheckCircle },
    { key: "rejected", label: "Từ chối", icon: XCircle },
  ] as const;
}

interface FilterDef {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface StatusFilterBarProps {
  filters: readonly FilterDef[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
  counts: Record<string, number>;
  dateFrom: string;
  dateTo: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

export default function StatusFilterBar({
  filters,
  activeFilter,
  onFilterChange,
  counts,
  dateFrom,
  dateTo,
  onFromChange,
  onToChange,
}: StatusFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => {
          const Icon = f.icon;
          const active = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              aria-label={`Lọc ${f.label.toLowerCase()}`}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-9 ${
                active
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "bg-[color-mix(in_srgb,_var(--text-primary)_5%,_transparent)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,_var(--text-primary)_10%,_transparent)] border border-transparent"
              }`}
            >
              <Icon size={14} />
              {f.label}
              <span
                className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  active ? "bg-primary/20" : "bg-[color-mix(in_srgb,_var(--text-primary)_10%,_transparent)]"
                }`}
              >
                {counts[f.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
      <DateFilter
        from={dateFrom}
        to={dateTo}
        onFromChange={onFromChange}
        onToChange={onToChange}
      />
    </div>
  );
}
