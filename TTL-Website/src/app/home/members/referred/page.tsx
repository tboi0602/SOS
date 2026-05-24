"use client";

import { useState, useMemo } from "react";
import { useReferredMembers } from "@/hook/members";
import ReferredSection from "@/components/members/ReferredSection";
import DateFilter from "@/components/ui/DateFilter";

export default function ReferredMembersPage() {
  const { members, loading } = useReferredMembers();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredMembers = useMemo(() => {
    let list = members;
    if (dateFrom) {
      const from = new Date(dateFrom + "T00:00:00");
      list = list.filter((m) => new Date(m.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59");
      list = list.filter((m) => new Date(m.createdAt) <= to);
    }
    return list;
  }, [members, dateFrom, dateTo]);

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-6xl mx-auto space-y-5">
        <ReferredSection members={filteredMembers} loading={loading} />

        <div className="flex justify-end">
          <DateFilter
            from={dateFrom}
            to={dateTo}
            onFromChange={setDateFrom}
            onToChange={setDateTo}
          />
        </div>
      </div>
    </div>
  );
}
