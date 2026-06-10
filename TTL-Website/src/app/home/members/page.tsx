"use client";

import { Users } from "lucide-react";
import { useMembers } from "@/hook/members";
import MembersHeader from "@/components/members/MembersHeader";
import MembersGrid from "@/components/members/MembersGrid";
import MembersPagination from "@/components/members/MembersPagination";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MembersPage() {
  const {
    data,
    page,
    setPage,
    search,
    setSearch,
    loading,
    filtered,
    totalPages,
  } = useMembers();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto space-y-8 ">
        <MembersHeader
          search={search}
          onSearchChange={setSearch}
          total={data?.total ?? 0}
        />

        <Skeleton
          name="members-page"
          loading={loading}
          rows={filtered.length || 1}
        >
          {filtered.length === 0 ? (
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
                <Users size={26} style={{ color: "var(--text-tertiary)" }} />
              </div>
              <p className="text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider">
                Không tìm thấy thành viên phù hợp
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <MembersGrid filtered={filtered} />
              <MembersPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </Skeleton>
      </div>
    </div>
  );
}
