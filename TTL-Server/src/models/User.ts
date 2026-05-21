import { v4 as uuid } from "uuid";
import { getDb } from "../db";

const safeFields = {
  id: true,
  email: true,
  name: true,
  role: true,
  job: true,
  address: true,
  avatar: true,
  bio: true,
  facebook: true,
  twitter: true,
  tiktok: true,
  youtube: true,
  zalo: true,
  referralCode: true,
  kyLuat: true,
  daoDuc: true,
  truyenCamHung: true,
  createdAt: true,
  isActive: true,
} as const;

export const User = {
  async findAll() {
    return getDb().user.findMany({ orderBy: { createdAt: "desc" } });
  },

  async findByEmail(email: string) {
    return getDb().user.findUnique({ where: { email } });
  },

  async findById(id: string, includePassword = false) {
    const select = includePassword ? undefined : safeFields;
    return getDb().user.findUnique({
      where: { id },
      ...(select ? { select } : {}),
    });
  },

  async findByActivationToken(token: string) {
    return getDb().user.findFirst({
      where: {
        activationToken: token,
        activationTokenExpires: { gte: new Date() },
      },
    });
  },

  async findByResetToken(token: string) {
    return getDb().user.findFirst({
      where: { resetToken: token, resetTokenExpires: { gte: new Date() } },
    });
  },

  async findByReferralCode(code: string) {
    return getDb().user.findFirst({ where: { referralCode: code } });
  },

  async create(data: {
    email: string;
    password: string;
    name: string;
    avatar?: string | null;
    job?: string | null;
    address?: string | null;
    referredBy?: string | null;
    activationToken?: string | null;
    activationTokenExpires?: Date | null;
  }) {
    const id = uuid();

    await getDb().user.create({
      data: {
        id,
        email: data.email,
        password: data.password,
        avatar: data.avatar ?? null,
        name: data.name,
        job: data.job ?? null,
        address: data.address ?? null,
        referralCode: id,
        referredBy: data.referredBy ?? null,
        activationToken: data.activationToken ?? null,
        activationTokenExpires: data.activationTokenExpires ?? null,
      },
    });

    return { id, referralCode: id };
  },

  async update(id: string, data: Record<string, unknown>) {
    return getDb().user.update({ where: { id }, data, select: safeFields });
  },

  async updatePassword(id: string, hashedPassword: string) {
    await getDb().user.update({
      where: { id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        tokenVersion: { increment: 1 },
      },
    });
  },

  async incrementLoginAttempts(id: string) {
    await getDb().user.update({
      where: { id },
      data: { loginAttempts: { increment: 1 } },
    });
  },

  async resetLoginAttempts(id: string) {
    await getDb().user.update({
      where: { id },
      data: { loginAttempts: 0, lockedUntil: null },
    });
  },

  async addPoints(id: string, points: { kyLuat?: number; daoDuc?: number; truyenCamHung?: number }) {
    const data: Record<string, unknown> = {};
    if (points.kyLuat) data.kyLuat = { increment: points.kyLuat };
    if (points.daoDuc) data.daoDuc = { increment: points.daoDuc };
    if (points.truyenCamHung) data.truyenCamHung = { increment: points.truyenCamHung };
    return getDb().user.update({ where: { id }, data, select: safeFields });
  },

  async lockAccount(id: string, durationMinutes = 15) {
    await getDb().user.update({
      where: { id },
      data: {
        lockedUntil: new Date(Date.now() + durationMinutes * 60 * 1000),
      },
    });
  },

  toSafeUser(user: {
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
    kyLuat?: number;
    daoDuc?: number;
    truyenCamHung?: number;
    isActive?: boolean;
    createdAt?: Date;
  }) {
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
      kyLuat: user.kyLuat ?? 0,
      daoDuc: user.daoDuc ?? 0,
      truyenCamHung: user.truyenCamHung ?? 0,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt?.toISOString(),
    };
  },
};
