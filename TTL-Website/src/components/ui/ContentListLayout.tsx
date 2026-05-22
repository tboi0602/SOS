/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import StatusFilterBar from "./StatusFilterBar";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatDef {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
}

interface FilterDef {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface HeaderConfig {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconClass?: string;
  createLabel: string;
  onCreate?: () => void;
  createBtnClass?: string;
}

interface ContentListLayoutProps {
  header: HeaderConfig;
  stats: StatDef[];
  filters?: readonly FilterDef[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
  counts: Record<string, number>;
  dateFrom: string;
  dateTo: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  skeletonName: string;
  skeletonRows?: number;
  loading: boolean;
  items: any[];
  children: ReactNode;
  renderEmptyState?: () => ReactNode;
  createForm?: ReactNode;
}

export default function ContentListLayout({
  header,
  stats,
  filters,
  activeFilter,
  onFilterChange,
  counts,
  dateFrom,
  dateTo,
  onFromChange,
  onToChange,
  skeletonName,
  skeletonRows,
  loading,
  items,
  children,
  renderEmptyState,
  createForm,
}: ContentListLayoutProps) {
  const HeaderIcon = header.icon;

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-xl flex items-center justify-center ${header.iconClass || "bg-primary/15"}`}
            >
              <HeaderIcon
                size={20}
                className={header.iconClass ? "text-white" : "text-primary"}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{header.title}</h1>
              <p className="text-xs text-zinc-500">{header.subtitle}</p>
            </div>
          </div>
          {header.createLabel && header.onCreate && (
            <button
              onClick={header.onCreate}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-10 ${header.createBtnClass || "bg-primary hover:bg-primary-light shadow-primary/25"}`}
            >
              <Plus size={16} /> {header.createLabel}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 ">
          {stats.map((s, i) => {
            const StatIcon = s.icon;
            return (
              <div
                key={i}
                className=" bg-white/1 rounded-2xl p-5 border border-white/6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-zinc-500">{s.label}</p>
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center ${s.iconBg || "bg-white/5"}`}
                  >
                    <StatIcon
                      size={14}
                      className={s.iconColor || "text-zinc-500"}
                    />
                  </div>
                </div>
                <p
                  className={`text-2xl font-bold ${s.valueColor || "text-white"}`}
                >
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        {filters && (
          <StatusFilterBar
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            counts={counts}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onFromChange={onFromChange}
            onToChange={onToChange}
          />
        )}

        {createForm}

        {/* List */}
        <Skeleton name={skeletonName} loading={loading} rows={skeletonRows ?? 1}>
          {items.length === 0 ? renderEmptyState?.() : children}
        </Skeleton>
      </div>
    </div>
  );
}
