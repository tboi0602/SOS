"use client"

import { useState, useEffect } from "react"
import { profileService } from "@/service/profile.service"
import type { ReferredMember } from "@/service/api"

export function useReferredMembers() {
  const [members, setMembers] = useState<ReferredMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileService.getReferredMembers()
      .then((data) => setMembers(data.members))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return { members, loading }
}
