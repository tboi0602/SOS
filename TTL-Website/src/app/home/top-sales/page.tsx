"use client";

import { TrendingUp } from "lucide-react";
import { useTopSales } from "@/hook/top-sales";
import TopSalesHeader from "@/components/top-sales/TopSalesHeader";
import Podium from "@/components/top-sales/Podium";
import RankingList from "@/components/top-sales/RankingList";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TopSalesPage() {
  const { members, loading } = useTopSales();
  const top3 = members.slice(0, 3);
  const rest = members.slice(3);

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-6 animate-fade-up">
      <div className="max-w-5xl mx-auto space-y-5">
        <TopSalesHeader />
        <Skeleton name="top-sales" loading={loading}>
          <>
            {members.length === 0 && (
              <div className="text-center py-24 rounded-3xl"
                style={{
                  background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                  boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                  border: "0.5px solid var(--border-base)",
                }}>
                <div className="size-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                    boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                    border: "0.5px solid var(--border-base)",
                  }}>
                  <TrendingUp size={26} style={{ color: "var(--text-tertiary)" }} />
                </div>
                <p className="text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider">
                  Hệ thống chưa có dữ liệu xếp hạng
                </p>
              </div>
            )}

            {top3.length > 0 && <Podium members={members} />}

            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] to-transparent" />
                  <span className="text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                    Xếp hạng tiếp theo
                  </span>
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] to-transparent" />
                </div>
                <RankingList members={rest} />
              </div>
            )}

            {members.length > 3 && (
              <p className="text-[10px] text-[var(--text-tertiary)] text-center font-medium tracking-wider">
                Hiển thị {members.length} thành viên có điểm số cao nhất
              </p>
            )}
          </>
        </Skeleton>
      </div>
    </div>
  );
}
