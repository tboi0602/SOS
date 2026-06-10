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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BG = "color-mix(in srgb, var(--surface-elevated) 18%, transparent)";
const SHADOW = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, referred, loading } = useProfile(user);

  if (!user) return null;

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${user.referralCode || user.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&color=FFFFFF&bgcolor=1A1A1A`;
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
    <div className="min-h-screen px-6 py-4 select-none flex items-center justify-center animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <Skeleton name="home-profile" loading={loading}>
        <div ref={profileRef} className="w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-5">
          {/* LEFT */}

          {profile && (
            <>
              <div className="flex flex-col justify-center gap-4 h-full">
                <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                  <ProfileHeader
                    name={user.name}
                    referralCode={user.referralCode}
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
                </AnimatedBorder>

                <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                  <CompetencyRing
                    score={profile.competency.score}
                    topPercent={profile.competency.topPercent}
                    level={profile.competency.level}
                    strength={profile.competency.strength}
                  />
                </AnimatedBorder>

                <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                  <ActivityTimeline activities={activities} />
                </AnimatedBorder>
              </div>

              {/* CENTER */}
              <div className="profile-section flex flex-col items-center justify-center h-full mt-25 max-lg:mt-15">
                <StarChart
                  kyLuat={profile.core.kyLuat}
                  daoDuc={profile.core.daoDuc}
                  truyenCamHung={profile.core.truyenCamHung}
                  postScore={profile.core.postScore}
                  referredScore={profile.core.referredScore}
                />
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4 h-full">
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
                  <ReferredMembers members={referred} />
                </AnimatedBorder>

                <AnimatedBorder className="profile-section" style={{ background: BG, boxShadow: SHADOW }}>
                  <QrCodeCard qrUrl={qrUrl} profileUrl={profileUrl} />
                </AnimatedBorder>
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
