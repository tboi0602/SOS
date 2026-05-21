"use client"

import { BookOpen, Plus } from "lucide-react"

interface JournalHeaderProps {
  onOpenCreate: () => void
}

export default function JournalHeader({ onOpenCreate }: JournalHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen size={20} className="text-primary" /> Nhật ký
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Ghi lại những việc tốt bạn đã làm</p>
      </div>
      <button onClick={onOpenCreate}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 cursor-pointer"
      ><Plus size={16} /> Thêm</button>
    </div>
  )
}
