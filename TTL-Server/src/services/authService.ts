import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { sendActivationEmail, sendResetPasswordEmail } from "./mail";
import { logger } from "../lib/logger";
import { config } from "../config";
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
} from "../lib/errors";

const googleClient = new OAuth2Client(config.google.clientId);

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;
const ACTIVATION_TOKEN_EXPIRY_HOURS = 24;

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    job?: string | null;
    address?: string | null;
    referralCode?: string | null;
  }) {
    const existing = await User.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("Email đã được đăng ký");
    }

    let referredById: string | null = null;
    if (data.referralCode) {
      const referrer = await User.findByReferralCode(data.referralCode);
      if (!referrer) {
        throw new BadRequestError("Mã giới thiệu không hợp lệ");
      }
      referredById = referrer.id;
      await User.addPoints(referrer.id, { truyenCamHung: 2 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const activationToken = uuid();
    const activationTokenExpires = new Date(
      Date.now() + ACTIVATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    const { id, referralCode } = await User.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      job: data.job ?? null,
      address: data.address ?? null,
      referredBy: referredById,
      activationToken,
      activationTokenExpires,
    });

    sendActivationEmail(data.email, data.name, activationToken);

    const token = signToken({
      userId: id,
      email: data.email,
      tokenVersion: 0,
      role: "user",
    });

    return {
      token,
      user: {
        id,
        email: data.email,
        name: data.name,
        role: "user",
        job: data.job ?? null,
        address: data.address ?? null,
        referralCode,
        kyLuat: 0,
        daoDuc: 0,
        truyenCamHung: 0,
        isActive: false,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remaining = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new TooManyRequestsError(
        `Tài khoản bị khoá. Vui lòng thử lại sau ${remaining} phút`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await User.incrementLoginAttempts(user.id);
      const attempts = user.loginAttempts + 1;
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        await User.lockAccount(user.id, LOCK_DURATION_MINUTES);
        throw new TooManyRequestsError(
          `Tài khoản đã bị khoá do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${LOCK_DURATION_MINUTES} phút`,
        );
      }
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    await User.resetLoginAttempts(user.id);

    if (!user.isActive) {
      throw new ForbiddenError(
        "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.",
        "ACCOUNT_NOT_ACTIVATED",
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
      role: user.role,
    });

    return { token, user: User.toSafeUser(user) };
  },

  async googleAuth(credential: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedError("Xác thực Google thất bại");
    }

    let user = await User.findByEmail(payload.email);
    if (!user) {
      const tempPassword = await bcrypt.hash(uuid(), 12);
      await User.create({
        email: payload.email,
        avatar: payload.picture || null,
        password: tempPassword,
        name: payload.name || payload.email,
      });
      user = await User.findByEmail(payload.email)!;
      await User.update(user!.id, { isActive: true });
      user = await User.findByEmail(payload.email)!;
    }

    const token = signToken({
      userId: user!.id,
      email: user!.email,
      tokenVersion: user!.tokenVersion,
      role: user!.role,
    });

    return { token, user: User.toSafeUser(user!) };
  },

  async activate(token: string) {
    const user = await User.findByActivationToken(token);
    if (!user) {
      throw new BadRequestError("Mã kích hoạt không hợp lệ hoặc đã hết hạn");
    }

    if (user.isActive) {
      return { message: "Tài khoản đã được kích hoạt trước đó" };
    }

    await User.update(user.id, {
      isActive: true,
      activationToken: null,
      activationTokenExpires: null,
    });
    return { message: "Kích hoạt tài khoản thành công" };
  },

  async resendActivation(email: string) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new NotFoundError("Email không tồn tại trong hệ thống");
    }

    if (user.isActive) {
      return { message: "Tài khoản đã được kích hoạt" };
    }

    const activationToken = uuid();
    const activationTokenExpires = new Date(
      Date.now() + ACTIVATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );
    await User.update(user.id, { activationToken, activationTokenExpires });

    sendActivationEmail(user.email, user.name, activationToken);
    return { message: "Email kích hoạt đã được gửi lại" };
  },

  async forgotPassword(email: string) {
    const user = await User.findByEmail(email);
    if (!user) {
      return {
        message:
          "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
      };
    }

    const resetToken = uuid();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await User.update(user.id, { resetToken, resetTokenExpires });

    sendResetPasswordEmail(user.email, user.name, resetToken);
    return {
      message: "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
    };
  },

  async resetPassword(token: string, password: string) {
    const user = await User.findByResetToken(token);
    if (!user) {
      throw new BadRequestError(
        "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updatePassword(user.id, hashedPassword);
    return { message: "Mật khẩu đã được đặt lại thành công" };
  },

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Không tìm thấy người dùng");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Mật khẩu hiện tại không đúng");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(user.id, hashedPassword);
    return { message: "Mật khẩu đã được thay đổi thành công" };
  },

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      job?: string | null;
      address?: string | null;
      avatar?: string | null;
      bio?: string | null;
      facebook?: string | null;
      twitter?: string | null;
      tiktok?: string | null;
      youtube?: string | null;
      zalo?: string | null;
    },
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.job !== undefined) updateData.job = data.job ?? null;
    if (data.address !== undefined) updateData.address = data.address ?? null;
    if (data.avatar !== undefined) updateData.avatar = data.avatar ?? null;
    if (data.bio !== undefined) updateData.bio = data.bio ?? null;
    if (data.facebook !== undefined)
      updateData.facebook = data.facebook ?? null;
    if (data.twitter !== undefined) updateData.twitter = data.twitter ?? null;
    if (data.tiktok !== undefined) updateData.tiktok = data.tiktok ?? null;
    if (data.youtube !== undefined) updateData.youtube = data.youtube ?? null;
    if (data.zalo !== undefined) updateData.zalo = data.zalo ?? null;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("Không có thông tin nào để cập nhật");
    }

    return User.update(userId, updateData);
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }
    return user;
  },

  async checkReferral(code: string) {
    const user = await User.findByReferralCode(code);
    return { valid: !!user, name: user?.name || null };
  },
};
