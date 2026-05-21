"use client"

import { Gift, Users } from "lucide-react"
import type { MemberInfo } from "@/service/api"
import ReferredMemberCard from "./ReferredMemberCard"

interface ReferredSectionProps {
  members: MemberInfo[]
  loading: boolean
}

function ReferredHeader({ count }: { count: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Gift size={22} className="text-emerald-400 animate-bounce" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            DANH SÁCH GIỚI THIỆU
          </h1>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
            Mạng lưới liên kết: <span className="text-emerald-400 font-mono font-bold">{count}</span> nhân tố
          </p>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
        Hệ thống tính thưởng tự động
      </div>
    </div>
  )
}

function ReferredEmptyState() {
  return (
    <div className="text-center py-24 rounded-3xl bg-black/20 border border-white/5">
      <div className="size-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-4 text-zinc-600 shadow-inner">
        <Users size={26} />
      </div>
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Bạn chưa giới thiệu thành viên nào</p>
    </div>
  )
}

function ReferredList({ members }: { members: MemberInfo[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {members.map((m, index) => (
        <ReferredMemberCard key={m.id} member={m} index={index} />
      ))}
    </div>
  )
}

export default function ReferredSection({ members, loading }: ReferredSectionProps) {
  return (
    <>
      <ReferredHeader count={members.length} />

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-3">
          <div className="relative size-10 flex items-center justify-center">
            <div className="absolute size-full rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin" />
          </div>
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Đang quét liên kết dữ liệu...</p>
        </div>
      )}

      {!loading && members.length === 0 && <ReferredEmptyState />}

      {!loading && members.length > 0 && <ReferredList members={members} />}
    </>
  )
}
