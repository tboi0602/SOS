"use client";

import { Gift, Users } from "lucide-react";
import type { ReferredMember } from "@/service/api";
import ReferredMemberCard from "./ReferredMemberCard";
import { Skeleton } from "@/components/ui/Skeleton";

interface ReferredSectionProps {
  members: ReferredMember[];
  loading: boolean;
}

function ReferredHeader({ count }: { count: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--border-base)" }}>
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-linear-to-br from-emerald-500/20 to-accent/10 border flex items-center justify-center shadow-glow-emerald" style={{ borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
          <Gift size={22} className="text-emerald-400 animate-bounce" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
            DANH SÁCH GIỚI THIỆU
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Mạng lưới liên kết:{" "}
            <span className="text-emerald-400 font-mono font-bold">
              {count}
            </span>{" "}
            nhân tố
          </p>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl" style={{ color: "var(--text-tertiary)", background: "color-mix(in srgb, var(--text-primary) 2%, transparent)", borderColor: "var(--border-base)" }}>
        Hệ thống tính thưởng tự động
      </div>
    </div>
  );
}

function ReferredEmptyState() {
  return (
    <div className="text-center py-24 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 1%, transparent)", borderColor: "var(--border-base)" }}>
      <div className="size-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner" style={{ background: "color-mix(in srgb, var(--text-primary) 2%, transparent)", borderColor: "var(--border-base)", color: "var(--text-dim)" }}>
        <Users size={26} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
        Bạn chưa giới thiệu thành viên nào
      </p>
    </div>
  );
}

function ReferredList({ members }: { members: ReferredMember[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {members.map((m, index) => (
        <ReferredMemberCard key={m.id} member={m} index={index} />
      ))}
    </div>
  );
}

export default function ReferredSection({
  members,
  loading,
}: ReferredSectionProps) {
  return (
    <>
      <ReferredHeader count={members.length} />

      <Skeleton
        name="referred-section"
        loading={loading}
        rows={members.length || 1}
      >
        {members.length === 0 ? (
          <ReferredEmptyState />
        ) : (
          <ReferredList members={members} />
        )}
      </Skeleton>
    </>
  );
}
