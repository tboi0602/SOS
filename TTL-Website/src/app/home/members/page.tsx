"use client";

import { Users } from "lucide-react";
import { useMembers } from "@/hook/members";
import MembersHeader from "@/components/members/MembersHeader";
import MembersGrid from "@/components/members/MembersGrid";
import MembersPagination from "@/components/members/MembersPagination";

export default function MembersPage() {
  const { data, page, setPage, search, setSearch, loading, filtered, totalPages } = useMembers();

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 text-white select-none relative z-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <MembersHeader search={search} onSearchChange={setSearch} total={data?.total ?? 0} />

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="relative size-10 flex items-center justify-center">
              <div className="absolute size-full rounded-full border-2 border-primary/10 border-t-cyan animate-spin" />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Đang đồng bộ dữ liệu...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 rounded-3xl bg-black/20 border border-white/5">
            <div className="size-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-4 text-zinc-600 shadow-inner">
              <Users size={26} />
            </div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Không tìm thấy thành viên phù hợp</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-8">
            <MembersGrid filtered={filtered} />
            <MembersPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
