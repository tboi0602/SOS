"use client";

import { TrendingUp, Loader2 } from "lucide-react";
import { useTopSales } from "@/hook/top-sales";
import TopSalesHeader from "@/components/top-sales/TopSalesHeader";
import Podium from "@/components/top-sales/Podium";
import RankingList from "@/components/top-sales/RankingList";

export default function TopSalesPage() {
  const { members, loading } = useTopSales();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center space-y-3">
        <div className="relative size-10 flex items-center justify-center">
          <Loader2 className="animate-spin text-cyan size-8" />
        </div>
        <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
          Đang đồng bộ thứ hạng...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 text-white select-none relative z-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <TopSalesHeader />
        {members.length > 0 && <Podium members={members} />}
        {members.length > 0 && <RankingList members={members} />}
        {members.length === 0 && (
          <div className="text-center py-24 rounded-3xl bg-black/20 border border-white/5">
            <div className="size-16 rounded-full bg-white/2 border border-white/5 flex items-center justify-center mx-auto mb-4 text-zinc-600 shadow-inner">
              <TrendingUp size={26} />
            </div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Hệ thống chưa có dữ liệu xếp hạng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
