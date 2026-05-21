"use client"

interface JournalStatsProps {
  count: number
  totalPoints: number
}

export default function JournalStats({ count, totalPoints }: JournalStatsProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 glass-strong rounded-xl p-4 border border-white/6 text-center">
        <div className="text-2xl font-bold text-white">{count}</div>
        <p className="text-[10px] text-zinc-500 mt-1">Số nhật ký</p>
      </div>
      <div className="flex-1 glass-strong rounded-xl p-4 border border-white/6 text-center">
        <div className="text-2xl font-bold text-amber-400">{totalPoints}</div>
        <p className="text-[10px] text-zinc-500 mt-1">Tổng điểm</p>
      </div>
    </div>
  )
}
