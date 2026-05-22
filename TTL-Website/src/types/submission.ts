import type { User } from "./auth";

export interface Submission {
  id: string;
  userId: string;
  title: string;
  videoUrl: string | null;
  note: string | null;
  status: string;
  points: number;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "name" | "email" | "avatar">;
}
