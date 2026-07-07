import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/service/notification.service";
import type { Notification } from "@/types/content";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const fetch = useCallback(() => {
    const id = setTimeout(() => {
      setLoading(true);
      notificationService
        .list(page, limit)
        .then((res) => {
          setNotifications(res.notifications);
          setTotal(res.total);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 0);
    return id;
  }, [page]);

  useEffect(() => {
    const id = fetch();
    return () => clearTimeout(id);
  }, [fetch]);

  const markRead = async (id: string) => {
    await notificationService.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    window.dispatchEvent(new CustomEvent("notifications-read"));
  };

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    window.dispatchEvent(new CustomEvent("notifications-read"));
  };

  return {
    notifications,
    loading,
    page,
    total,
    totalPages: Math.ceil(total / limit),
    setPage,
    markRead,
    markAllRead,
  };
}
