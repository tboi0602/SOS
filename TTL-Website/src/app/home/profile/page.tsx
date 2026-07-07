"use client";

import { useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/hook/profile/useProfile";
import AnimatedBorder from "@/components/profile/AnimatedBorder";
import StarChart from "@/components/profile/StarChart";
import ProfileHeader from "@/components/profile/ProfileHeader";
import CompetencyRing from "@/components/profile/CompetencyRing";
import ActivityTimeline from "@/components/profile/ActivityTimeline";
import AnalysisChart from "@/components/profile/AnalysisChart";
import ReferredMembers from "@/components/profile/ReferredMembers";
import QrCodeCard from "@/components/profile/QrCodeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BG = "color-mix(in srgb, var(--surface-elevated) 18%, transparent)";
const SHADOW = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, referred, loading } = useProfile(user);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = profileRef.current;
    if (!el) return;
    const sections = el.querySelectorAll(".profile-section");
    if (!sections.length) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          sections,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, force3D: true, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" } }
        );
      });
    });
    return () => ctx.revert();
  }, [profile]);

  if (!user) return null;

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/home/members/${user.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&color=FFFFFF&bgcolor=1A1A1A`;

  const maxScore = profile ? Math.max(profile.core.kyLuat, profile.core.daoDuc, profile.core.truyenCamHung, profile.core.postScore, profile.core.referredScore, 100) : 100;

  const activities =
    profile?.activities.map((a) => ({
      icon:
        a.type === "post"
          ? "trending"
          : a.type === "journal"
            ? "book"
            : a.type === "submission"
              ? "shield"
              : a.type === "comment"
                ? "award"
                : "star",
      title: a.title,
      points: 0,
      time: a.time,
    })) ?? [];

  return (
    <div className="min-h-screen px-6 py-4 select-none flex items-start justify-center animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <Skeleton name="home-profile" loading={loading}>
        <div ref={profileRef} className="w-full max-w-6xl mx-auto space-y-5">
          {profile && (
            <>
              {/* HEADER — full width */}
              <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                <ProfileHeader
                  name={user.name}
                  email={user.email}
                  id={user.id}
                  avatar={user.avatar}
                  bio={user.bio}
                  job={user.job}
                  rank={profile.competency.rank}
                  facebook={user.facebook}
                  twitter={user.twitter}
                  tiktok={user.tiktok}
                  youtube={user.youtube}
                  zalo={user.zalo}
                />
                {user.hasGraduated && (
                  <div className="flex items-center justify-center gap-1.5 px-4 pb-4">
                    <CheckCircle2 size={14} style={{ color: "var(--color-success)" }} />
                    <span className="text-[11px] font-semibold" style={{ color: "var(--color-success)" }}>
                      Đã tốt nghiệp
                    </span>
                  </div>
                )}
              </AnimatedBorder>

              {/* NĂNG LỰC TỔNG — full width, hero section */}
              <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                <CompetencyRing
                  score={profile.competency.score}
                  maxScore={maxScore}
                  topPercent={profile.competency.topPercent}
                  level={profile.competency.level}
                  strength={profile.competency.strength}
                />
              </AnimatedBorder>

              {/* TWO-COLUMN CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* LEFT COL */}
                <div className="flex flex-col gap-5 min-w-0">
                  <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                    <div className="flex items-center justify-center p-4">
                      <StarChart
                        kyLuat={profile.core.kyLuat}
                        daoDuc={profile.core.daoDuc}
                        truyenCamHung={profile.core.truyenCamHung}
                        postScore={profile.core.postScore}
                        referredScore={profile.core.referredScore}
                      />
                    </div>
                  </AnimatedBorder>

                  <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                    <ActivityTimeline activities={activities} />
                  </AnimatedBorder>

                  <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                    <ReferredMembers members={referred} />
                  </AnimatedBorder>
                </div>

                {/* RIGHT COL */}
                <div className="flex flex-col gap-5 min-w-0">
                  <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                    <AnalysisChart
                      labels={profile.chartData.labels}
                      datasets={[
                        { values: profile.chartData.kyLuat, color: "#6366f1" },
                        { values: profile.chartData.daoDuc, color: "#10b981" },
                        { values: profile.chartData.truyenCamHung, color: "#a855f7" },
                        { values: profile.chartData.postScore, color: "#f59e0b" },
                        { values: profile.chartData.referredScore, color: "#ec4899" },
                      ]}
                    />
                  </AnimatedBorder>

                  <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                    <QrCodeCard qrUrl={qrUrl} profileUrl={profileUrl} />
                  </AnimatedBorder>
                </div>
              </div>
            </>
          )}
        </div>
      </Skeleton>
      <svg className="absolute pointer-events-none opacity-0">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}


