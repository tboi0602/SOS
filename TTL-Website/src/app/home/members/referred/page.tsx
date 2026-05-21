"use client"

import { useReferredMembers } from "@/hook/members"
import ReferredSection from "@/components/members/ReferredSection"

export default function ReferredMembersPage() {
  const { members, loading } = useReferredMembers()

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 text-white select-none relative z-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <ReferredSection members={members} loading={loading} />
      </div>
    </div>
  )
}
