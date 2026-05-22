import type { User } from "./auth";
import type { Post } from "./post";
import type { JournalEntry } from "./journal";

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

export interface ReferredMember {
  id: string;
  name: string;
  referralCode: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  score: number;
  rank: string;
}

export interface PublicProfileResponse {
  user: User;
  stats: { postCount: number; referredCount: number };
  score: number;
  rank: string;
  posts: Post[];
  journals: JournalEntry[];
}

export interface ProfileResponse {
  user: User;
  stats: {
    postCount: number;
    commentCount: number;
    likeCount: number;
    referredCount: number;
    membershipDays: number;
  };
  competency: {
    score: number;
    rank: string;
    topPercent: string;
    level: string;
    strength: string;
  };
  core: {
    kyLuat: number;
    daoDuc: number;
    truyenCamHung: number;
  };
  activities: {
    type: string;
    title: string;
    time: string;
  }[];
  chartData: {
    labels: string[];
    kyLuat: number[];
    daoDuc: number[];
    truyenCamHung: number[];
  };
}
