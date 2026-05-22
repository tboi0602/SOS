import type { User } from "./auth";

export interface Post {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "email" | "avatar">;
  content: string;
  images: string[];
  videos: string[];
  productLink: string | null;
  hashtags: string[];
  status: string;
  adminNote: string | null;
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
  user?: Pick<User, "id" | "name" | "email" | "avatar">;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}
