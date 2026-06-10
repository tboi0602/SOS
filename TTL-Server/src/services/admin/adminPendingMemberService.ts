import { getDb } from "../../db";

export const adminPendingMemberService = {
  async getPendingMembers(page: number, limit: number) {
    const pendingWhere = { status: "pending" as const };

    const [postUsers, journalUsers, submissionUsers, visitUsers] = await Promise.all([
      getDb().post.findMany({ where: pendingWhere, select: { userId: true }, distinct: ["userId"] }),
      getDb().journal.findMany({ where: pendingWhere, select: { userId: true }, distinct: ["userId"] }),
      getDb().submission.findMany({ where: pendingWhere, select: { userId: true }, distinct: ["userId"] }),
      getDb().customerVisitImage.findMany({ where: { status: "PENDING" }, select: { userId: true }, distinct: ["userId"] }),
    ]);

    const userIds = new Set([
      ...postUsers.map((u) => u.userId),
      ...journalUsers.map((u) => u.userId),
      ...submissionUsers.map((u) => u.userId),
      ...visitUsers.map((u) => u.userId),
    ]);

    const userIdsArr = Array.from(userIds);
    const total = userIdsArr.length;
    const pagedIds = userIdsArr.slice((page - 1) * limit, page * limit);

    if (pagedIds.length === 0) {
      return { members: [], total: 0, page, totalPages: 0 };
    }

    const [users, postCounts, journalCounts, submissionCounts, visitCounts] = await Promise.all([
      getDb().user.findMany({
        where: { id: { in: pagedIds } },
        select: { id: true, name: true, email: true, avatar: true, memberId: true },
      }),
      getDb().post.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "pending" }, _count: { id: true } }),
      getDb().journal.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "pending" }, _count: { id: true } }),
      getDb().submission.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "pending" }, _count: { id: true } }),
      getDb().customerVisitImage.groupBy({ by: ["userId"], where: { userId: { in: pagedIds }, status: "PENDING" }, _count: { id: true } }),
    ]);

    const countMap = (arr: { userId: string; _count: { id: number } }[]) => {
      const map = new Map<string, number>();
      for (const item of arr) map.set(item.userId, item._count.id);
      return map;
    };

    const postMap = countMap(postCounts);
    const journalMap = countMap(journalCounts);
    const submissionMap = countMap(submissionCounts);
    const visitMap = countMap(visitCounts);

    const members = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      memberId: u.memberId,
      pendingCounts: {
        posts: postMap.get(u.id) ?? 0,
        journals: journalMap.get(u.id) ?? 0,
        submissions: submissionMap.get(u.id) ?? 0,
        customerVisits: visitMap.get(u.id) ?? 0,
      },
      totalPending:
        (postMap.get(u.id) ?? 0) +
        (journalMap.get(u.id) ?? 0) +
        (submissionMap.get(u.id) ?? 0) +
        (visitMap.get(u.id) ?? 0),
    }));

    return {
      members,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getUserPendingItems(userId: string, filterType?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const items: Record<string, unknown>[] = [];
    let total = 0;

    const fetchPosts = !filterType || filterType === "post";
    const fetchJournals = !filterType || filterType === "journal";
    const fetchSubmissions = !filterType || filterType === "submission";
    const fetchVisits = !filterType || filterType === "customer-visit";

    const queries: Promise<void>[] = [];

    if (fetchPosts) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().post.findMany({
              where: { userId, status: "pending" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, content: true, createdAt: true, status: true },
            }),
            getDb().post.count({ where: { userId, status: "pending" } }),
          ]);
          items.push(...list.map((p) => ({ ...p, itemType: "post", title: p.content.slice(0, 100) })));
          total += count;
        })(),
      );
    }

    if (fetchJournals) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().journal.findMany({
              where: { userId, status: "pending" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, title: true, createdAt: true, status: true },
            }),
            getDb().journal.count({ where: { userId, status: "pending" } }),
          ]);
          items.push(...list.map((j) => ({ ...j, itemType: "journal" })));
          total += count;
        })(),
      );
    }

    if (fetchSubmissions) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().submission.findMany({
              where: { userId, status: "pending" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, title: true, createdAt: true, status: true },
            }),
            getDb().submission.count({ where: { userId, status: "pending" } }),
          ]);
          items.push(...list.map((s) => ({ ...s, itemType: "submission" })));
          total += count;
        })(),
      );
    }

    if (fetchVisits) {
      queries.push(
        (async () => {
          const [list, count] = await Promise.all([
            getDb().customerVisitImage.findMany({
              where: { userId, status: "PENDING" },
              orderBy: { createdAt: "desc" },
              skip: filterType ? skip : 0,
              take: filterType ? limit : undefined,
              select: { id: true, description: true, createdAt: true, status: true, imageUrl: true },
            }),
            getDb().customerVisitImage.count({ where: { userId, status: "PENDING" } }),
          ]);
          items.push(...list.map((v) => ({ ...v, itemType: "customer-visit", title: v.description ?? "Hình ảnh gặp khách hàng" })));
          total += count;
        })(),
      );
    }

    await Promise.all(queries);

    if (!filterType) {
      items.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
      const sliced = items.slice(skip, skip + limit);
      return { items: sliced, total, page, totalPages: Math.ceil(total / limit) };
    }

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};
