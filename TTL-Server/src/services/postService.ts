import { getDb } from "../db";
import { BadRequestError, NotFoundError } from "../lib/errors";

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
    const post = await getDb().post.create({
      data: {
        userId,
        content: data.content,
        images: data.images ?? [],
        videos: data.videos ?? [],
        productLink: data.productLink ?? null,
        hashtags: data.hashtags ?? [],
      },
      include: postInclude,
    });
    return this.formatPost(post, userId);
  },

  async getAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: postInclude,
      }),
      getDb().post.count(),
    ]);
    return {
      posts: posts.map((p) => this.formatPost(p, userId)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getMyPosts(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      getDb().post.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: postInclude,
      }),
      getDb().post.count({ where: { userId } }),
    ]);
    return {
      posts: posts.map((p) => this.formatPost(p, userId)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(postId: string, userId: string) {
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

  formatPost(post: any, currentUserId: string) {
    return {
      id: post.id,
      userId: post.userId,
      user: post.user,
      content: post.content,
      images: post.images,
      videos: post.videos ?? [],
      productLink: post.productLink,
      hashtags: post.hashtags ?? [],
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      liked: post.likes.some((l: any) => l.userId === currentUserId),
      comments: post.comments.map((c: any) => ({
        ...c,
        isOwner: c.userId === currentUserId,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  },
};
