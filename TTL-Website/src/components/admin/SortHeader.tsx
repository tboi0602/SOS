"use client"
import { useState } from "react"

const SortIcon = ({
  column,
  sortKey,
  sortDir,
}: {
  column: string
  sortKey: string
  sortDir: "asc" | "desc"
}) => {
  if (sortKey !== column) return <span className="ml-1" style={{ color: "var(--text-dim)" }}>↕</span>
  return (
    <span className="text-primary ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
  )
}

export const SortHeader = ({
  column,
  label,
  sortKey,
  sortDir,
  onSort,
}: {
  column: string
  label: string
  sortKey: string
  sortDir: "asc" | "desc"
  onSort: (k: string) => void
}) => {
  const [hovered, setHovered] = useState(false)
  return (
    <th
      className="px-3 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors select-none"
      style={{ color: hovered ? "var(--text-primary)" : "var(--text-tertiary)" }}
      onClick={() => onSort(column)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon column={column} sortKey={sortKey} sortDir={sortDir} />
      </div>
    </th>
  )
}
