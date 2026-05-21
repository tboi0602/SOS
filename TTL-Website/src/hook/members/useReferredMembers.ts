"use client"

import { useState, useEffect } from "react"
import { api, type MemberInfo } from "@/service/api"

export function useReferredMembers() {
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.profile.getReferredMembers()
      .then((data) => setMembers(data.members))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return { members, loading }
}
