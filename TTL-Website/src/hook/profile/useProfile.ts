import { useState, useEffect } from "react";
import { profileService } from "@/service/profile.service";
import type { ProfileResponse, ReferredMember } from "@/service/api";

export function useProfile(user: { id: string } | null) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [referred, setReferred] = useState<ReferredMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const id = setTimeout(() => {
      Promise.all([
        profileService.getProfile(),
        profileService.getReferredMembers(),
      ])
        .then(([p, r]) => {
          setProfile(p);
          setReferred(r.members);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(id);
  }, [user]);

  return { profile, referred, loading };
}
