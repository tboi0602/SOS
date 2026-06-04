export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  content: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string | null;
  images: string[];
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonsResponse {
  lessons: Lesson[];
  total: number;
  page: number;
  totalPages: number;
}
