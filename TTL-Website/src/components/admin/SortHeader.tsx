"use client"

const SortIcon = ({
  column,
  sortKey,
  sortDir,
}: {
  column: string
  sortKey: string
  sortDir: "asc" | "desc"
}) => {
  if (sortKey !== column) return <span className="text-zinc-600 ml-1">↕</span>
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
}) => (
  <th
    className="px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none"
    onClick={() => onSort(column)}
  >
    <div className="flex items-center gap-1">
      {label}
      <SortIcon column={column} sortKey={sortKey} sortDir={sortDir} />
    </div>
  </th>
)
