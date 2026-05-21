"use client";

import { usePublicProfile } from "@/hook/members";
import Loading from "@/components/ui/Loading";
import PostCard from "@/components/feed/PostCard";
import ProfileHero from "@/components/members/ProfileHero";
import ProfileTabs from "@/components/members/ProfileTabs";
import CompetencyGrid from "@/components/members/CompetencyGrid";
import StatsBlock from "@/components/members/StatsBlock";
import QrCodeSection from "@/components/members/QrCodeSection";
import JournalsList from "@/components/members/JournalsList";
import { FileText } from "lucide-react";

export default function PublicProfilePage() {
  const {
    data, loading, tab, setTab,
    handleLike, handleComment, handleDeleteComment,
    totalCompetency, memberDays, profileUrl, qrUrl, id, user,
  } = usePublicProfile();

  if (loading) return <Loading />;

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center text-zinc-500 font-medium">
      Không tìm thấy hồ sơ người dùng này
    </div>
  );

  const { user: u, stats, score, rank, posts, journals } = data;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 text-white select-none relative overflow-hidden font-sans">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10 animate-[fadeIn_0.6s_ease-out]">
        <ProfileHero
          user={u}
          totalCompetency={totalCompetency}
          rank={rank}
          score={score}
          referredCount={stats.referredCount}
        />

        <ProfileTabs tab={tab} onTabChange={setTab} />

        <div className="transition-all duration-500">
          {tab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[slideUp_0.5s_ease-out]">
              <div className="lg:col-span-2 space-y-6">
                <CompetencyGrid
                  kyLuat={u.kyLuat ?? 0}
                  daoDuc={u.daoDuc ?? 0}
                  truyenCamHung={u.truyenCamHung ?? 0}
                  totalCompetency={totalCompetency}
                />
                <StatsBlock postCount={stats.postCount} memberDays={memberDays} />
              </div>
              <QrCodeSection qrUrl={qrUrl} userName={u.name} referralCode={u.referralCode} />
            </div>
          )}

          {tab === "posts" && (
            <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
              <JournalsList journals={journals} />

              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="transition-all duration-300 hover:translate-y-[-2px]">
                    <PostCard
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onDeleteComment={handleDeleteComment}
                    />
                  </div>
                ))}

                {posts.length === 0 && journals.length === 0 && (
                  <div className="text-center py-20 rounded-3xl bg-gradient-to-b from-[#08102b] to-[#04081c] border border-white/5">
                    <div className="size-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-4 text-zinc-600 shadow-inner">
                      <FileText size={28} />
                    </div>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                      Chưa có thông tin dòng thời gian
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
