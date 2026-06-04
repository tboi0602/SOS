"use client";

import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/hook/profile/useProfile";
import AnimatedBorder from "@/components/profile/AnimatedBorder";
import TriangleChart from "@/components/profile/TriangleChart";
import ProfileHeader from "@/components/profile/ProfileHeader";
import CompetencyRing from "@/components/profile/CompetencyRing";
import ActivityTimeline from "@/components/profile/ActivityTimeline";
import AnalysisChart from "@/components/profile/AnalysisChart";
import ReferredMembers from "@/components/profile/ReferredMembers";
import QrCodeCard from "@/components/profile/QrCodeCard";
import { Skeleton } from "@/components/ui/Skeleton";

const BG = "linear-gradient(145deg, #09132e, #070d22)";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, referred, loading } = useProfile(user);

  if (!user) return null;

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${user.referralCode || user.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&color=001425&bgcolor=00c3ff`;

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
    <div className="min-h-screen px-6 max-lg:py-4 text-white select-none overflow-hidden flex items-center justify-center">
      <Skeleton name="home-profile" loading={loading}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-5">
          {/* LEFT */}

          {profile && (
            <>
              <div className="flex flex-col justify-center gap-4 h-full">
                <AnimatedBorder style={{ background: BG }}>
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

                <AnimatedBorder style={{ background: BG }}>
                  <CompetencyRing
                    score={profile.competency.score}
                    topPercent={profile.competency.topPercent}
                    level={profile.competency.level}
                    strength={profile.competency.strength}
                  />
                </AnimatedBorder>

                <AnimatedBorder style={{ background: BG }}>
                  <ActivityTimeline activities={activities} />
                </AnimatedBorder>
              </div>

              {/* CENTER */}
              <div className="flex flex-col items-center justify-center h-full mt-25 max-lg:mt-15">
                <TriangleChart
                  kyLuat={profile.core.kyLuat}
                  daoDuc={profile.core.daoDuc}
                  truyenCamHung={profile.core.truyenCamHung}
                />
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4 h-full">
                <AnimatedBorder style={{ background: BG }}>
                  <AnalysisChart
                    labels={profile.chartData.labels}
                    datasets={[
                      { values: profile.chartData.kyLuat, color: "#00b7ff" },
                      { values: profile.chartData.daoDuc, color: "#10b981" },
                      {
                        values: profile.chartData.truyenCamHung,
                        color: "#f59e0b",
                      },
                    ]}
                  />
                </AnimatedBorder>

                <AnimatedBorder style={{ background: BG }}>
                  <ReferredMembers members={referred} />
                </AnimatedBorder>

                <AnimatedBorder style={{ background: BG }}>
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
            <stop offset="0%" stopColor="#00b7ff" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
