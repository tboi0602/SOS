"use client"
import type { ComponentType } from "react"

export default function StatCard({
  label,
  value,
  rawValue,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  rawValue: number
  icon: ComponentType<{ size?: number; className?: string }>
  color: string
}) {
  return (
    <div
      className="stat-card relative overflow-hidden rounded-2xl p-5 card-hover"
      style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}
    >
      <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-[0.06]`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</p>
          <p className="text-2xl font-bold mt-1 stat-value" data-target={String(rawValue)} style={{ color: "var(--text-primary)" }}>
            {value}
          </p>
        </div>
        <div className={`stat-icon p-2.5 rounded-xl bg-linear-to-br ${color}`}>
          <Icon size={18} className="text-[var(--text-primary)]" />
        </div>
      </div>
    </div>
  )
}
