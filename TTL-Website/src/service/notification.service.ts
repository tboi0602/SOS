import { request } from "./client";
import type { NotificationsResponse, Notification } from "@/types/content";

export const notificationService = {
  list(page = 1, limit = 50) {
    return request<NotificationsResponse>(`/api/v1/notifications?page=${page}&limit=${limit}`);
  },

  markRead(id: string) {
    return request<{ notification: Notification }>(`/api/v1/notifications/${id}/read`, {
      method: "PUT",
    });
  },

  markAllRead() {
    return request<{ message: string }>("/api/v1/notifications/read-all", {
      method: "PUT",
    });
  },

  create(data: { title: string; content: string; type?: string; link?: string; userId?: string }) {
    return request<{ notification: Notification }>("/api/v1/notifications", {
      method: "POST",
      body: data,
    });
  },

  delete(id: string) {
    return request<{ message: string }>(`/api/v1/notifications/${id}`, {
      method: "DELETE",
    });
  },
};
