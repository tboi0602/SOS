import type { User } from "./auth";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  images: string[];
  points: number;
  status: string;
  adminNote: string | null;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "email" | "avatar">;
}
