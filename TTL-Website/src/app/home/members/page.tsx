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
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 ">
        <MembersHeader
          search={search}
          onSearchChange={setSearch}
          total={data?.total ?? 0}
        />

        <Skeleton name="members-page" loading={loading} rows={filtered.length || 1}>
          {filtered.length === 0 ? (
            <div className="text-center py-24 rounded-3xl bg-black/20 border border-white/5">
              <div className="size-16 rounded-full bg-white/2 border border-white/5 flex items-center justify-center mx-auto mb-4 text-zinc-600 shadow-inner">
                <Users size={26} />
              </div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
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
