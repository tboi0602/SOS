export interface SafeUser {
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
  referralCode: string;
  memberId: string | null;
  kyLuat: number;
  daoDuc: number;
  truyenCamHung: number;
  postScore: number;
  referredScore: number;
  isActive: boolean;
  permissions: string[];
  createdAt?: string;
}

export function toSafeUser(user: {
  id: string;
  email: string;
  name: string;
  role?: string;
  job: string | null;
  address: string | null;
  avatar?: string | null;
  bio?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  zalo?: string | null;
  referralCode: string;
  memberId?: string | null;
  kyLuat?: number;
  daoDuc?: number;
  truyenCamHung?: number;
  postScore?: number;
  referredScore?: number;
  isActive?: boolean;
  permissions?: unknown;
  createdAt?: Date | string;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "user",
    job: user.job,
    address: user.address,
    avatar: user.avatar ?? null,
    bio: user.bio ?? null,
    facebook: user.facebook ?? null,
    twitter: user.twitter ?? null,
    tiktok: user.tiktok ?? null,
    youtube: user.youtube ?? null,
    zalo: user.zalo ?? null,
    referralCode: user.referralCode,
    memberId: user.memberId ?? null,
    kyLuat: user.kyLuat ?? 0,
    daoDuc: user.daoDuc ?? 0,
    truyenCamHung: user.truyenCamHung ?? 0,
    postScore: user.postScore ?? 0,
    referredScore: user.referredScore ?? 0,
    isActive: user.isActive ?? true,
    permissions: Array.isArray(user.permissions) ? user.permissions as string[] : [],
    createdAt: typeof user.createdAt === "string"
      ? user.createdAt
      : user.createdAt?.toISOString?.(),
  };
}
