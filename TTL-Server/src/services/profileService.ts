import { User } from "../models/User";
import { getDb } from "../db";
import { NotFoundError } from "../lib/errors";

export const profileService = {
  async getPublicProfile(targetUserId: string, currentUserId: string) {
    const user = await User.findById(targetUserId);
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    const [postCount, referredCount, posts, journals] = await Promise.all([
      getDb().post.count({ where: { userId: targetUserId } }),
      getDb().user.count({ where: { referredBy: targetUserId } }),
      getDb().post.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { id: true, name: true, email: true } },
          likes: { select: { userId: true } },
          comments: {
            select: { id: true, userId: true, content: true, createdAt: true },
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      getDb().journal.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const safe = User.toSafeUser(user);
    const score = Math.round((safe.kyLuat + safe.daoDuc + safe.truyenCamHung) / 3);
    const rank = score >= 85 ? "Xuất sắc" : score >= 70 ? "Tốt" : score >= 50 ? "Khá" : "Cơ bản";

    const formattedPosts = posts.map((p: any) => ({
      id: p.id,
      userId: p.userId,
      user: p.user,
      content: p.content,
      images: p.images,
      videos: p.videos ?? [],
      productLink: p.productLink,
      hashtags: p.hashtags ?? [],
      likeCount: p.likes.length,
      commentCount: p.comments.length,
      liked: p.likes.some((l: any) => l.userId === currentUserId),
      comments: p.comments.map((c: any) => ({ ...c, isOwner: c.userId === currentUserId })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      user: safe,
      stats: { postCount, referredCount },
      score,
      rank,
      posts: formattedPosts,
      journals,
    };
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId, true);
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    const [postCount, commentCount, likeCount, referredCount, recentPosts, recentComments] = await Promise.all([
      getDb().post.count({ where: { userId } }),
      getDb().comment.count({ where: { userId } }),
      getDb().like.count({ where: { post: { userId } } }),
      getDb().user.count({ where: { referredBy: userId } }),
      getDb().post.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { createdAt: true, content: true },
      }),
      getDb().comment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { post: { select: { content: true } } },
      }),
    ]);

    const membershipDays = Math.floor(
      (Date.now() - (user.createdAt?.getTime() || Date.now())) / 86400000,
    );

    const kyLuat = Math.min(100, Math.round(postCount * 5 + commentCount * 3 + membershipDays * 0.5));
    const daoDuc = Math.min(100, Math.round(likeCount * 2 + referredCount * 10 + (user.isActive ? 20 : 0)));
    const truyenCamHung = Math.min(100, Math.round(postCount * 3 + likeCount * 3 + referredCount * 15));
    const score = Math.round((kyLuat + daoDuc + truyenCamHung) / 3);

    const rank = score >= 85 ? "Xuất sắc" : score >= 70 ? "Tốt" : score >= 50 ? "Khá" : "Cơ bản";

    const activities = [
      ...recentPosts.map((p) => ({
        type: "post" as const,
        title: p.content.length > 60 ? p.content.substring(0, 60) + "..." : p.content,
        time: timeAgo(p.createdAt),
      })),
      ...recentComments.map((c) => ({
        type: "comment" as const,
        title: `Bình luận: ${c.content.length > 60 ? c.content.substring(0, 60) + "..." : c.content}`,
        time: timeAgo(c.createdAt),
      })),
    ].sort((a, b) => parseTimeAgo(a.time) - parseTimeAgo(b.time)).slice(0, 10);

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const monthlyPosts = await getDb().$queryRawUnsafe<{ month: string; count: bigint }[]>(
      `SELECT to_char("created_at", 'YYYY-MM') as month, COUNT(*)::bigint as count
       FROM "posts"
       WHERE "user_id" = $1 AND "created_at" >= $2
       GROUP BY month ORDER BY month`,
      userId,
      sixMonthsAgo,
    );

    const months = ["T1", "T2", "T3", "T4", "T5", "T6"];
    const postData = months.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = monthlyPosts.find((r) => r.month === key);
      return found ? Number(found.count) : 0;
    });
    const chartData = {
      labels: months,
      kyLuat: computeTrend(kyLuat, postData),
      daoDuc: computeTrend(daoDuc, postData),
      truyenCamHung: computeTrend(truyenCamHung, postData),
    };

    const safeUser = User.toSafeUser(user);

    return {
      user: safeUser,
      stats: {
        postCount,
        commentCount,
        likeCount,
        referredCount,
        membershipDays,
      },
      competency: {
        score,
        rank,
        topPercent: score >= 85 ? "Top 5%" : score >= 70 ? "Top 15%" : score >= 50 ? "Top 35%" : "Top 60%",
        level: score >= 85 ? "Chuyên gia" : score >= 70 ? "Nâng cao" : score >= 50 ? "Trung bình" : "Cơ bản",
        strength: kyLuat >= Math.max(daoDuc, truyenCamHung) ? "Kỷ luật" : daoDuc >= truyenCamHung ? "Đạo đức" : "Truyền cảm hứng",
      },
      core: { kyLuat, daoDuc, truyenCamHung },
      activities,
      chartData,
    };
  },

  async listMembers(page: number, limit: number) {
    const where = { role: { not: "admin" } };
    const [users, total] = await Promise.all([
      getDb().user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      getDb().user.count({ where }),
    ]);

    return {
      members: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        job: u.job,
        avatar: u.avatar,
        referralCode: u.referralCode,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getTopSales() {
    const users = await getDb().user.findMany({
      where: { role: { not: "admin" }, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const scored = users.map((u) => {
      const safe = User.toSafeUser(u);
      const score = Math.round((safe.kyLuat + safe.daoDuc + safe.truyenCamHung) / 3);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        job: u.job,
        avatar: u.avatar,
        referralCode: u.referralCode,
        isActive: u.isActive,
        kyLuat: safe.kyLuat,
        daoDuc: safe.daoDuc,
        truyenCamHung: safe.truyenCamHung,
        score,
        createdAt: u.createdAt.toISOString(),
      };
    });

    const ranked = scored.sort((a, b) => b.score - a.score).filter((m) => m.score > 0);
    return { members: ranked };
  },

  async getReferredMembers(userId: string) {
    const members = await getDb().user.findMany({
      where: { referredBy: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      referralCode: m.referralCode,
      avatar: m.avatar,
      isActive: m.isActive,
      createdAt: m.createdAt.toISOString(),
    }));
  },
};

function computeTrend(base: number, monthlyData: number[]): number[] {
  if (monthlyData.every((v) => v === 0)) {
    const step = base / 6;
    return monthlyData.map((_, i) => Math.round(step * (i + 1) * 0.5));
  }
  const max = Math.max(...monthlyData, 1);
  return monthlyData.map((v) => Math.round((v / max) * base));
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
}

function parseTimeAgo(t: string): number {
  if (t === "Vừa xong") return 0;
  const n = parseInt(t) || 0;
  if (t.includes("phút")) return n;
  if (t.includes("giờ")) return n * 60;
  if (t.includes("ngày")) return n * 1440;
  if (t.includes("tháng")) return n * 43200;
  return 999999;
}
