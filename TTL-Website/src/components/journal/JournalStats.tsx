"use client"

interface JournalStatsProps {
  count: number
  totalPoints: number
}

export default function JournalStats({ count, totalPoints }: JournalStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass-strong rounded-xl p-4 border border-white/6 text-center hover:border-white/20 transition-all duration-300">
        <div className="text-2xl font-bold text-white">{count}</div>
        <p className="text-[10px] text-zinc-500 mt-1">Số nhật ký</p>
      </div>
      <div className="glass-strong rounded-xl p-4 border border-white/6 text-center hover:border-white/20 transition-all duration-300">
        <div className="text-2xl font-bold text-amber-400">{totalPoints}</div>
        <p className="text-[10px] text-zinc-500 mt-1">Tổng điểm</p>
      </div>
    </div>
  )
}
