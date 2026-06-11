"use client";

import { usePublicProfile } from "@/hook/members";
import { useAuth } from "@/lib/auth-context";
import Loading from "@/components/ui/Loading";
import PostCard from "@/components/feed/PostCard";
import ProfileHero from "@/components/members/ProfileHero";
import ProfileTabs from "@/components/members/ProfileTabs";
import CompetencyGrid from "@/components/members/CompetencyGrid";
import StatsBlock from "@/components/members/StatsBlock";
import QrCodeSection from "@/components/members/QrCodeSection";
import JournalsList from "@/components/members/JournalsList";
import { FileText, ShieldBan } from "lucide-react";

export default function PublicProfilePage() {
  const { user } = useAuth();
  const {
    data,
    loading,
    tab,
    setTab,
    handleLike,
    handleComment,
    handleDeleteComment,
    handleDeletePost,
    totalCompetency,
    memberDays,
    qrUrl,
  } = usePublicProfile();

  if (loading) return <Loading />;

  const isMember = user?.role === "member" || user?.role === "admin";

  if (!isMember)
    return (
      <div className="min-h-screen px-4 sm:px-6 py-10 select-none animate-fade-up flex items-center justify-center" style={{ color: "var(--text-primary)" }}>
        <div className="text-center max-w-sm space-y-4">
          <div className="size-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--text-tertiary) 10%, transparent)" }}>
            <ShieldBan size={28} style={{ color: "var(--text-tertiary)" }} />
          </div>
          <h2 className="text-base font-bold">Chưa phải hội viên</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Người dùng này chưa là thành viên chính thức không thể xem
          </p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium" style={{ color: "var(--text-tertiary)" }}>
        Không tìm thấy hồ sơ người dùng này
      </div>
    );

  const { user: u, stats, score, rank, posts, journals } = data;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 select-none relative overflow-hidden animate-fade-up" style={{ color: "var(--text-primary)" }}>
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
                  postScore={u.postScore ?? 0}
                  referredScore={u.referredScore ?? 0}
                  totalCompetency={totalCompetency}
                />
                <StatsBlock
                  postCount={stats.postCount}
                  memberDays={memberDays}
                />
              </div>
              <QrCodeSection
                qrUrl={qrUrl}
                userName={u.name}
                id={u.id}
              />
            </div>
          )}

          {tab === "posts" && (
            <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
              <JournalsList journals={journals} />

              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="transition-all duration-300 hover:-translate-y-0.5 max-w-2xl mx-auto"
                  >
                    <PostCard
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onDeleteComment={handleDeleteComment}
                      onDeletePost={handleDeletePost}
                    />
                  </div>
                ))}

                {posts.length === 0 && journals.length === 0 && (
                  <div className="text-center py-20 rounded-3xl" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
                    <div className="size-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)", color: "var(--text-tertiary)" }}>
                      <FileText size={28} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
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
