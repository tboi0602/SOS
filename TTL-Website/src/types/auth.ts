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
  memberId?: string | null;
  kyLuat?: number;
  daoDuc?: number;
  truyenCamHung?: number;
  postScore?: number;
  referredScore?: number;
  isActive?: boolean;
  createdAt?: string;
  permissions?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  job?: string;
  address?: string;
  referralCode?: string;
}
