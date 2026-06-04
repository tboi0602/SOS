import { getDb } from "../db";
import { NotFoundError } from "../lib/errors";

export const lessonService = {
  async list(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [lessons, total] = await Promise.all([
      getDb().lesson.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      getDb().lesson.count(),
    ]);
    return { lessons, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    const lesson = await getDb().lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundError("Bài học không tồn tại");
    return lesson;
  },

  async create(data: { title: string; content?: string; images?: string[]; videoUrl?: string }) {
    return getDb().lesson.create({
      data: {
        title: data.title,
        content: data.content ?? null,
        images: data.images ?? [],
        videoUrl: data.videoUrl ?? null,
      },
    });
  },

  async update(id: string, data: { title?: string; content?: string; images?: string[]; videoUrl?: string }) {
    const lesson = await getDb().lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundError("Bài học không tồn tại");
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
    return getDb().lesson.update({ where: { id }, data: updateData });
  },

  async delete(id: string) {
    const lesson = await getDb().lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundError("Bài học không tồn tại");
    await getDb().lesson.delete({ where: { id } });
    return { message: "Đã xoá bài học" };
  },
};
