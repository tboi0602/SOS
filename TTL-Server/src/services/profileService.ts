import { toSafeUser } from "../lib/safeUser";
import { getDb } from "../db";
import { NotFoundError } from "../lib/errors";

export const profileService = {
  async getPublicProfile(targetUserId: string, currentUserId: string | null) {
    const user = await getDb().user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");
    if (user.role !== "user" && user.role !== "member" && user.role !== "admin")
      throw new NotFoundError("Người dùng không tồn tại");

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
        where: { userId: targetUserId, status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const safe = toSafeUser(user);
    const total =
      safe.kyLuat +
      safe.daoDuc +
      safe.truyenCamHung +
      safe.postScore +
      safe.referredScore;
    const score = Math.round(total / 5);
    const rank =
      total >= 1000
        ? "R5"
        : total >= 500
          ? "R4"
          : total >= 300
            ? "R3"
            : total >= 100
              ? "R2"
              : "R1";

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
      comments: p.comments.map((c: any) => ({
        ...c,
        isOwner: c.userId === currentUserId,
      })),
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
    const user = await getDb().user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Người dùng không tồn tại");

    const [
      postCount,
      commentCount,
      likeCount,
      referredCount,
      recentPosts,
      recentComments,
      recentJournals,
      recentSubmissions,
    ] = await Promise.all([
      getDb().post.count({ where: { userId } }),
      getDb().comment.count({ where: { userId } }),
      getDb().like.count({ where: { post: { userId } } }),
      getDb().user.count({ where: { referredBy: userId } }),
      getDb().post.findMany({
        where: { userId, status: "approved" },
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
      getDb().journal.findMany({
        where: { userId, status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { createdAt: true, title: true },
      }),
      getDb().submission.findMany({
        where: { userId, status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { createdAt: true, title: true },
      }),
    ]);

    const membershipDays = Math.floor(
      (Date.now() - (user.createdAt?.getTime() || Date.now())) / 86400000,
    );

    const safe = toSafeUser(user);
    const kyLuat = safe.kyLuat;
    const daoDuc = safe.daoDuc;
    const truyenCamHung = safe.truyenCamHung;
    const postScore = safe.postScore;
    const referredScore = safe.referredScore;
    const total = kyLuat + daoDuc + truyenCamHung + postScore + referredScore;
    const score = Math.round(total / 5);

    const rank =
      total >= 1000
        ? "R5"
        : total >= 500
          ? "R4"
          : total >= 300
            ? "R3"
            : total >= 100
              ? "R2"
              : "R1";

    // Compute real percentile rank
    const allUsers = await getDb().user.findMany({
      where: { role: { not: "admin" }, isActive: true },
      select: {
        kyLuat: true,
        daoDuc: true,
        truyenCamHung: true,
        postScore: true,
        referredScore: true,
      },
    });
    const allTotals = allUsers
      .map(
        (u) =>
          u.kyLuat + u.daoDuc + u.truyenCamHung + u.postScore + u.referredScore,
      )
      .filter((t) => t > 0)
      .sort((a, b) => b - a);
    const rankIndex = allTotals.findIndex((t) => t <= total);
    const topPercent =
      allTotals.length === 0
        ? "Chưa có dữ liệu"
        : rankIndex === -1
          ? `Top ${Math.round((1 / allTotals.length) * 100)}%`
          : `Top ${Math.round(((rankIndex + 1) / allTotals.length) * 100)}%`;

    const activities = [
      ...recentPosts.map((p: any) => ({
        type: "post" as const,
        title:
          p.content.length > 60
            ? p.content.substring(0, 60) + "..."
            : p.content,
        time: timeAgo(p.createdAt),
      })),
      ...recentJournals.map((j: any) => ({
        type: "journal" as const,
        title: `Đạo đức: ${j.title.length > 60 ? j.title.substring(0, 60) + "..." : j.title}`,
        time: timeAgo(j.createdAt),
      })),
      ...recentSubmissions.map((s: any) => ({
        type: "submission" as const,
        title: `Bài dự thi: ${s.title.length > 60 ? s.title.substring(0, 60) + "..." : s.title}`,
        time: timeAgo(s.createdAt),
      })),
      ...recentComments.map((c: any) => ({
        type: "comment" as const,
        title: `Bình luận: ${c.content.length > 60 ? c.content.substring(0, 60) + "..." : c.content}`,
        time: timeAgo(c.createdAt),
      })),
    ]
      .sort((a: any, b: any) => parseTimeAgo(a.time) - parseTimeAgo(b.time))
      .slice(0, 10);

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const monthlyPosts = (await getDb().$queryRawUnsafe(
      `SELECT to_char("created_at", 'YYYY-MM') as month, COUNT(*)::bigint as count
       FROM "posts"
       WHERE "user_id" = $1 AND "created_at" >= $2
       GROUP BY month ORDER BY month`,
      userId,
      sixMonthsAgo,
    )) as { month: string; count: bigint }[];

    const months = ["T1", "T2", "T3", "T4", "T5", "T6"];
    const postData = months.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = monthlyPosts.find((r: any) => r.month === key);
      return found ? Number(found.count) : 0;
    });
    const chartData = {
      labels: months,
      kyLuat: computeTrend(kyLuat, postData),
      daoDuc: computeTrend(daoDuc, postData),
      truyenCamHung: computeTrend(truyenCamHung, postData),
      postScore: computeTrend(postScore, postData),
      referredScore: computeTrend(referredScore, postData),
    };

    const safeUser = toSafeUser(user);

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
        topPercent,
        level:
          total >= 1000
            ? "Chuyên gia"
            : total >= 500
              ? "Nâng cao"
              : total >= 300
                ? "Trung bình"
                : "Cơ bản",
        strength:
          kyLuat >= Math.max(daoDuc, truyenCamHung, postScore, referredScore)
            ? "Kỷ luật"
            : daoDuc >= Math.max(truyenCamHung, postScore, referredScore)
              ? "Đạo đức"
              : truyenCamHung >= Math.max(postScore, referredScore)
                ? "Truyền cảm hứng"
                : postScore >= referredScore
                  ? "Bài viết"
                  : "Giới thiệu",
      },
      core: { kyLuat, daoDuc, truyenCamHung, postScore, referredScore },
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
      members: users.map((u: any) => {
        const safe = toSafeUser(u);
        return {
          id: u.id,
          name: u.name,
          avatar: u.avatar,
          email: u.email,
          role: u.role,
          job: u.job,
          address: u.address,
          isActive: u.isActive,
          createdAt: u.createdAt.toISOString(),
          kyLuat: safe.kyLuat,
          daoDuc: safe.daoDuc,
          truyenCamHung: safe.truyenCamHung,
          postScore: safe.postScore,
          referredScore: safe.referredScore,
        };
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getTopSales() {
    const users = await getDb().user.findMany({
      where: { role: { not: "admin" }, isActive: true },
    });

    const scored = users.map((u: any) => {
      const safe = toSafeUser(u);
      const score = Math.round(
        (safe.kyLuat +
          safe.daoDuc +
          safe.truyenCamHung +
          safe.postScore +
          safe.referredScore) /
          5,
      );
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        job: u.job,
        avatar: u.avatar,
        isActive: u.isActive,
        kyLuat: safe.kyLuat,
        daoDuc: safe.daoDuc,
        truyenCamHung: safe.truyenCamHung,
        postScore: safe.postScore,
        referredScore: safe.referredScore,
        score,
        createdAt: u.createdAt.toISOString(),
      };
    });

    const ranked = scored
      .sort((a: any, b: any) => b.score - a.score)
      .filter((m: any) => m.score > 0);
    return { members: ranked.slice(0, 50) };
  },

  async getReferredMembers(userId: string) {
    const members = await getDb().user.findMany({
      where: { referredBy: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return members.map((m: any) => {
      const safe = toSafeUser(m);
      const total =
        safe.kyLuat +
        safe.daoDuc +
        safe.truyenCamHung +
        safe.postScore +
        safe.referredScore;
      const score = Math.round(total / 5);
      const rank =
        total >= 1000
          ? "R5"
          : total >= 500
            ? "R4"
            : total >= 300
              ? "R3"
              : total >= 100
                ? "R2"
                : "R1";
      return {
        id: m.id,
        name: m.name,
        avatar: m.avatar,
        isActive: m.isActive,
        createdAt: m.createdAt.toISOString(),
        kyLuat: safe.kyLuat,
        daoDuc: safe.daoDuc,
        truyenCamHung: safe.truyenCamHung,
        postScore: safe.postScore,
        referredScore: safe.referredScore,
        score,
        rank,
      };
    });
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
