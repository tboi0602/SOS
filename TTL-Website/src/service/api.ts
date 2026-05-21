const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiOptions {
  method?: string;
  body?: unknown;
}

async function request<T>(
  path: string,
  { method = "GET", body }: ApiOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server error");
  }

  if (!res.ok) {
    throw new Error(data.error || "Đã xảy ra lỗi");
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: User }>("/api/v1/auth/login", {
        method: "POST",
        body: { email, password },
      }),

    register: (data: RegisterData) =>
      request<{ user: User }>("/api/v1/auth/register", {
        method: "POST",
        body: data,
      }),

    logout: () =>
      request<{ message: string }>("/api/v1/auth/logout", { method: "POST" }),

    me: () => request<{ user: User }>("/api/v1/auth/me"),

    google: (credential: string) =>
      request<{ user: User }>("/api/v1/auth/google", {
        method: "POST",
        body: { credential },
      }),

    checkReferral: (code: string) =>
      request<{ valid: boolean; name: string | null }>(
        `/api/v1/auth/referral/${code}`,
      ),

    activate: (token: string) =>
      request<{ message: string }>("/api/v1/auth/activate", {
        method: "POST",
        body: { token },
      }),

    resendActivation: (email: string) =>
      request<{ message: string }>("/api/v1/auth/resend-activation", {
        method: "POST",
        body: { email },
      }),

    forgotPassword: (email: string) =>
      request<{ message: string }>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: { email },
      }),

    resetPassword: (token: string, password: string) =>
      request<{ message: string }>("/api/v1/auth/reset-password", {
        method: "POST",
        body: { token, password },
      }),

    updateProfile: (data: {
      name?: string;
      job?: string;
      address?: string;
      avatar?: string | null;
      bio?: string | null;
      facebook?: string | null;
      twitter?: string | null;
      tiktok?: string | null;
      youtube?: string | null;
      zalo?: string | null;
    }) =>
      request<{ user: User }>("/api/v1/auth/profile", {
        method: "PUT",
        body: data,
      }),

    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ message: string }>("/api/v1/auth/change-password", {
        method: "PUT",
        body: { currentPassword, newPassword },
      }),

    uploadAvatar: (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return fetch(`${API_URL}/api/v1/auth/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload thất bại");
        return data as { user: User };
      });
    },
  },

  admin: {
    listUsers: (page = 1, limit = 20, search?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      return request<AdminUserListResponse>(`/api/v1/admin/users?${params}`);
    },

    getUserById: (id: string) =>
      request<{ user: User }>(`/api/v1/admin/users/${id}`),

    updateUserRole: (id: string, role: string) =>
      request<{ user: User }>(`/api/v1/admin/users/${id}/role`, {
        method: "PUT",
        body: { role },
      }),

    deleteUser: (id: string) =>
      request<{ message: string }>(`/api/v1/admin/users/${id}`, {
        method: "DELETE",
      }),

    getStats: () => request<AdminStats>("/api/v1/admin/stats"),
  },

  chat: {
    send: (messages: { role: string; text: string }[]) =>
      request<{ text: string }>("/api/v1/chat", {
        method: "POST",
        body: { messages },
      }),
  },

  journal: {
    getMyEntries: () =>
      request<{ entries: JournalEntry[] }>("/api/v1/journal/me"),
    getByUser: (userId: string) =>
      request<{ entries: JournalEntry[] }>(`/api/v1/journal/user/${userId}`),
    uploadMedia: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      return fetch(`${API_URL}/api/v1/journal/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload thất bại");
        return data as { urls: string[] };
      });
    },
    create: (data: { title: string; content: string; images?: string[] }) =>
      request<{ entry: JournalEntry }>("/api/v1/journal", {
        method: "POST",
        body: data,
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/v1/journal/${id}`, {
        method: "DELETE",
      }),
  },

  profile: {
    getPublicProfile: (userId: string) =>
      request<PublicProfileResponse>(`/api/v1/profile/public/${userId}`),

    listMembers: (page = 1, limit = 20) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      return request<MemberListResponse>(`/api/v1/profile/members?${params}`);
    },

    getReferredMembers: () =>
      request<{ members: MemberInfo[] }>("/api/v1/profile/referred-members"),

    getTopSales: () => request<TopSalesResponse>("/api/v1/profile/top-sales"),
  },

  posts: {
    uploadMedia: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      return fetch(`${API_URL}/api/v1/posts/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload thất bại");
        return data as { urls: string[] };
      });
    },

    list: (page = 1, limit = 10) =>
      request<PostListResponse>(`/api/v1/posts?page=${page}&limit=${limit}`),

    myPosts: (page = 1, limit = 10) =>
      request<PostListResponse>(
        `/api/v1/posts/my-posts?page=${page}&limit=${limit}`,
      ),

    getById: (id: string) => request<{ post: Post }>(`/api/v1/posts/${id}`),

    search: (q: string) => {
      const params = new URLSearchParams({ q });
      return request<{ posts: Post[]; total: number }>(
        `/api/v1/posts/search?${params}`,
      );
    },

    create: (data: {
      content: string;
      images?: string[];
      videos?: string[];
      productLink?: string | null;
      hashtags?: string[];
    }) =>
      request<{ post: Post }>("/api/v1/posts", { method: "POST", body: data }),

    update: (
      id: string,
      data: {
        content?: string;
        images?: string[];
        videos?: string[];
        productLink?: string | null;
        hashtags?: string[];
      },
    ) =>
      request<{ post: Post }>(`/api/v1/posts/${id}`, {
        method: "PUT",
        body: data,
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/api/v1/posts/${id}`, { method: "DELETE" }),

    toggleLike: (id: string) =>
      request<{ liked: boolean }>(`/api/v1/posts/${id}/like`, {
        method: "POST",
      }),

    addComment: (postId: string, content: string) =>
      request<{ comment: Comment }>(`/api/v1/posts/${postId}/comments`, {
        method: "POST",
        body: { content },
      }),

    deleteComment: (postId: string, commentId: string) =>
      request<{ message: string }>(
        `/api/v1/posts/${postId}/comments/${commentId}`,
        { method: "DELETE" },
      ),
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  job: string | null;
  address: string | null;
  avatar: string | null;
  bio: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  zalo: string | null;
  referralCode: string | null;
  kyLuat?: number;
  daoDuc?: number;
  truyenCamHung?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  job?: string;
  address?: string;
  referralCode?: string;
}

export interface Post {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; avatar: string | null };
  content: string;
  images: string[];
  videos: string[];
  productLink: string | null;
  hashtags: string[];
  likeCount: number;
  commentCount: number;
  liked: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
  user?: { id: string; name: string; email: string; avatar: string | null };
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  images: string[];
  points: number;
  createdAt: string;
}

export interface PublicProfileResponse {
  user: User;
  stats: { postCount: number; referredCount: number };
  score: number;
  rank: string;
  posts: Post[];
  journals: JournalEntry[];
}

export interface MemberInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  job: string | null;
  avatar: string | null;
  referralCode: string;
  isActive: boolean;
  createdAt: string;
  kyLuat?: number;
  daoDuc?: number;
  truyenCamHung?: number;
}

export interface MemberListResponse {
  members: MemberInfo[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TopSalesResponse {
  members: (MemberInfo & { score: number })[];
}

export interface AdminUserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}
