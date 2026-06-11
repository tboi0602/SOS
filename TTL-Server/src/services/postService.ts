import { getDb } from "../db";
import { BadRequestError, NotFoundError, ForbiddenError } from "../lib/errors";
import { notificationService } from "./notificationService";

const postInclude = {
  user: {
    select: { id: true, name: true, email: true, avatar: true },
  },
  likes: {
    select: { userId: true },
  },
  comments: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

interface CreateData {
  content: string;
  images?: string[];
  videos?: string[];
  productLink?: string | null;
  hashtags?: string[];
}

interface UpdateData {
  content?: string;
  images?: string[];
  videos?: string[];
  productLink?: string | null;
  hashtags?: string[];
}

export const postService = {
  async create(userId: string, data: CreateData) {
    const user = await getDb().user.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = user?.role === "admin";
    const post = await getDb().post.create({
      data: {
        userId,
        content: data.content,
        images: data.images ?? [],
        videos: data.videos ?? [],
        productLink: data.productLink ?? null,
        hashtags: data.hashtags ?? [],
        status: isAdmin ? "approved" : "pending",
      },
      include: postInclude,
    });
    if (isAdmin) {
      await getDb().notification.create({
        data: {
          userId: null,
          title: "Bài viết mới từ Tinh Hoa Việt",
          content: data.content.slice(0, 120),
          type: "auto",
          link: `/home/posts/${post.id}`,
        },
      });
    }
    return this.formatPost(post, userId);
  },

  async getAll(userId: string | null, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        where: { status: "approved" },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: postInclude,
      }),
      getDb().post.count({ where: { status: "approved" } }),
    ]);
    return {
      posts: posts.map((p: any) => this.formatPost(p, userId)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getMyPosts(userId: string, page = 1, limit = 10, status?: string, dateFrom?: string, dateTo?: string) {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (status && status !== "all") where.status = status;
    if (dateFrom) where.createdAt = { ...where.createdAt, gte: new Date(dateFrom + "T00:00:00") };
    if (dateTo) where.createdAt = { ...where.createdAt, lte: new Date(dateTo + "T23:59:59") };

    const [posts, total, allCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      getDb().post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: postInclude,
      }),
      getDb().post.count({ where }),
      getDb().post.count({ where: { userId } }),
      getDb().post.count({ where: { userId, status: "pending" } }),
      getDb().post.count({ where: { userId, status: "approved" } }),
      getDb().post.count({ where: { userId, status: "rejected" } }),
    ]);
    return {
      posts: posts.map((p: any) => this.formatPost(p, userId)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      counts: { all: allCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
    };
  },

  async getById(postId: string, userId: string | null) {
    const post = await getDb().post.findUnique({
      where: { id: postId },
      include: postInclude,
    });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");
    return this.formatPost(post, userId);
  },

  async update(postId: string, userId: string, data: UpdateData) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");
    if (post.userId !== userId)
      throw new BadRequestError("Bạn không có quyền sửa bài viết này");

    const updated = await getDb().post.update({
      where: { id: postId },
      data,
      include: postInclude,
    });
    return this.formatPost(updated, userId);
  },

  async delete(postId: string, userId: string) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");
    if (post.userId !== userId)
      throw new BadRequestError("Bạn không có quyền xoá bài viết này");

    await getDb().post.delete({ where: { id: postId } });
    if (post.status === "approved") {
      await getDb().user.update({
        where: { id: userId },
        data: { postScore: { decrement: 1 } },
      });
    }
    return { message: "Đã xoá bài viết" };
  },

  async adminDelete(postId: string) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");

    await getDb().post.delete({ where: { id: postId } });
    if (post.status === "approved") {
      await getDb().user.update({
        where: { id: post.userId },
        data: { postScore: { decrement: 1 } },
      });
    }
    return { message: "Đã xoá bài viết" };
  },

  async toggleLike(postId: string, userId: string) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");

    const existing = await getDb().like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await getDb().like.delete({
        where: { userId_postId: { userId, postId } },
      });
      return { liked: false };
    }
    await getDb().like.create({ data: { userId, postId } });
    return { liked: true };
  },

  async addComment(postId: string, userId: string, content: string) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");

    const comment = await getDb().comment.create({
      data: { userId, postId, content },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return comment;
  },

  async deleteComment(commentId: string, userId: string) {
    const comment = await getDb().comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundError("Bình luận không tồn tại");
    if (comment.userId !== userId)
      throw new BadRequestError("Bạn không có quyền xoá bình luận này");

    await getDb().comment.delete({ where: { id: commentId } });
    return { message: "Đã xoá bình luận" };
  },

  async getNews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const admins = await getDb().user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });
    const adminIds = admins.map((a: any) => a.id);
    if (adminIds.length === 0) return { posts: [], total: 0, page, totalPages: 0 };

    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        where: { userId: { in: adminIds }, status: "approved" },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: postInclude,
      }),
      getDb().post.count({ where: { userId: { in: adminIds }, status: "approved" } }),
    ]);
    return {
      posts: posts.map((p: any) => this.formatPost(p, null)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async listPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          likes: { select: { userId: true } },
          comments: { select: { id: true, userId: true, content: true, createdAt: true }, orderBy: { createdAt: "asc" } },
        },
      }),
      getDb().post.count({ where: { status: "pending" } }),
    ]);
    return { posts, total, page, limit };
  },

  async listApproved(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          likes: { select: { userId: true } },
          comments: { select: { id: true, userId: true, content: true, createdAt: true }, orderBy: { createdAt: "asc" } },
        },
      }),
      getDb().post.count({ where: { status: "approved" } }),
    ]);
    return { posts, total, page, limit };
  },

  async listAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          likes: { select: { userId: true } },
          comments: { select: { id: true, userId: true, content: true, createdAt: true }, orderBy: { createdAt: "asc" } },
        },
      }),
      getDb().post.count(),
    ]);
    return { posts, total, page, limit };
  },

  async approve(postId: string, adminNote?: string, actorId?: string) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");
    if (post.status !== "pending") throw new ForbiddenError("Chỉ duyệt được bài viết đang chờ");

    const updated = await getDb().post.update({
      where: { id: postId },
      data: { status: "approved", adminNote: adminNote ?? null },
      include: postInclude,
    });
    await getDb().user.update({
      where: { id: post.userId },
      data: { postScore: { increment: 1 } },
    });

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "APPROVE_POST",
        resource: "post",
        resourceId: postId,
        metadata: { postContent: post.content?.slice(0, 100), authorId: post.userId },
      },
    });

    if (adminNote) {
      await notificationService.create({
        userId: post.userId,
        title: "Admin đã nhận xét bài viết của bạn",
        content: adminNote,
        type: "auto",
        link: `/home/posts/${postId}`,
      }).catch(() => {});
    }

    return updated;
  },

  async reject(postId: string, adminNote?: string, actorId?: string) {
    const post = await getDb().post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Bài viết không tồn tại");
    if (post.status !== "pending") throw new ForbiddenError("Chỉ từ chối được bài viết đang chờ");

    const updated = await getDb().post.update({
      where: { id: postId },
      data: { status: "rejected", adminNote: adminNote ?? null },
      include: postInclude,
    });

    await getDb().auditLog.create({
      data: {
        userId: actorId ?? null,
        action: "REJECT_POST",
        resource: "post",
        resourceId: postId,
        metadata: { postContent: post.content?.slice(0, 100), authorId: post.userId },
      },
    });

    if (adminNote) {
      await notificationService.create({
        userId: post.userId,
        title: "Admin đã nhận xét bài viết của bạn",
        content: adminNote,
        type: "auto",
        link: `/home/posts/${postId}`,
      }).catch(() => {});
    }

    return updated;
  },

  formatPost(post: any, currentUserId: string | null) {
    return {
      id: post.id,
      userId: post.userId,
      user: post.user,
      content: post.content,
      images: post.images,
      videos: post.videos ?? [],
      productLink: post.productLink,
      hashtags: post.hashtags ?? [],
      status: post.status,
      adminNote: post.adminNote,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0,
      liked: post.likes ? post.likes.some((l: any) => l.userId === currentUserId) : false,
      comments: post.comments ? post.comments.map((c: any) => ({
        ...c,
        isOwner: c.userId === currentUserId,
      })) : [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  },
};
