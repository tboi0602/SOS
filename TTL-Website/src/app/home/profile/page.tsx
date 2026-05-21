"use client";

import { useAuth } from "@/lib/auth-context";
import AnimatedBorder from "@/components/profile/AnimatedBorder";
import TriangleChart from "@/components/profile/TriangleChart";
import ProfileHeader from "@/components/profile/ProfileHeader";
import CompetencyRing from "@/components/profile/CompetencyRing";
import ActivityTimeline from "@/components/profile/ActivityTimeline";
import AnalysisChart from "@/components/profile/AnalysisChart";
import ReferredMembers from "@/components/profile/ReferredMembers";
import QrCodeCard from "@/components/profile/QrCodeCard";

const MOCK = {
  user: {
    name: "Nguyễn Văn A",
    code: "SOS-2026-001",
    position: "Chuyên viên Sales",
    rank: "Xuất sắc",
    status: "Đang hoạt động",
  },
  overall: {
    score: 85,
    topPercent: "Top 5%",
    level: "Chuyên gia",
    strength: "Kỷ luật",
  },
  core: { kyLuat: 92, daoDuc: 88, truyenCamHung: 76 },
  activities: [
    {
      icon: "trending",
      title: "Hoàn thành chiến dịch Q1",
      points: 25,
      time: "2 giờ trước",
    },
    {
      icon: "award",
      title: "Đạt danh hiệu Sales xuất sắc",
      points: 50,
      time: "1 ngày trước",
    },
    {
      icon: "book",
      title: "Tham gia workshop nâng cao",
      points: 10,
      time: "3 ngày trước",
    },
    {
      icon: "shield",
      title: "Hướng dẫn thành viên mới",
      points: 15,
      time: "5 ngày trước",
    },
    {
      icon: "star",
      title: "Nộp minh chứng việc tốt",
      points: 8,
      time: "1 tuần trước",
    },
  ],
  chartLabels: ["T1", "T2", "T3", "T4", "T5", "T6"],
  chartData: {
    kyLuat: [70, 78, 82, 85, 90, 92],
    daoDuc: [65, 72, 78, 82, 85, 88],
    truyenCamHung: [50, 55, 62, 68, 72, 76],
  },
};

const BG = "linear-gradient(145deg, #09132e, #070d22)";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${user.referralCode || user.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&color=001425&bgcolor=00c3ff`;

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 text-white select-none overflow-hidden flex items-center justify-center">
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-5 h-full">
        {/* ===== LEFT ===== */}
        <div className="flex flex-col gap-4 h-full">
          <AnimatedBorder style={{ background: BG }}>
            <ProfileHeader
              name={user.name}
              referralCode={user.referralCode}
              avatar={user.avatar}
              bio={user.bio}
              job={user.job}
              rank={"Chưa xếp hạng"}
              facebook={user.facebook}
              twitter={user.twitter}
              tiktok={user.tiktok}
              youtube={user.youtube}
              zalo={user.zalo}
            />
          </AnimatedBorder>

          <AnimatedBorder style={{ background: BG }}>
            <CompetencyRing
              score={MOCK.overall.score}
              topPercent={MOCK.overall.topPercent}
              level={MOCK.overall.level}
              strength={MOCK.overall.strength}
            />
          </AnimatedBorder>

          <AnimatedBorder style={{ background: BG }}>
            <ActivityTimeline activities={MOCK.activities} />
          </AnimatedBorder>
        </div>

        {/* ===== CENTER ===== */}
        <div className="flex flex-col items-center justify-center h-full">
          <TriangleChart
            kyLuat={MOCK.core.kyLuat}
            daoDuc={MOCK.core.daoDuc}
            truyenCamHung={MOCK.core.truyenCamHung}
          />
        </div>

        {/* ===== RIGHT ===== */}
        <div className="flex flex-col gap-4 h-full">
          <AnimatedBorder style={{ background: BG }}>
            <AnalysisChart
              labels={MOCK.chartLabels}
              datasets={[
                { values: MOCK.chartData.kyLuat, color: "#00b7ff" },
                { values: MOCK.chartData.daoDuc, color: "#10b981" },
                { values: MOCK.chartData.truyenCamHung, color: "#f59e0b" },
              ]}
            />
          </AnimatedBorder>

          <AnimatedBorder style={{ background: BG }}>
            <ReferredMembers />
          </AnimatedBorder>

          <AnimatedBorder style={{ background: BG }}>
            <QrCodeCard qrUrl={qrUrl} profileUrl={profileUrl} />
          </AnimatedBorder>
        </div>
      </div>

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
