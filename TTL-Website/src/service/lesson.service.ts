import { request } from "./client";
import type { LessonsResponse, Lesson } from "@/types/content";

export const lessonService = {
  list(page = 1, limit = 50) {
    return request<LessonsResponse>(`/api/v1/lessons?page=${page}&limit=${limit}`);
  },

  getById(id: string) {
    return request<{ lesson: Lesson }>(`/api/v1/lessons/${id}`);
  },

  create(data: { title: string; content?: string; images?: string[]; videoUrl?: string }) {
    return request<{ lesson: Lesson }>("/api/v1/lessons", {
      method: "POST",
      body: data,
    });
  },

  update(id: string, data: { title?: string; content?: string; images?: string[]; videoUrl?: string }) {
    return request<{ lesson: Lesson }>(`/api/v1/lessons/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  delete(id: string) {
    return request<{ message: string }>(`/api/v1/lessons/${id}`, {
      method: "DELETE",
    });
  },
};
