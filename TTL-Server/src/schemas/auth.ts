import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên quá dài"),
  email: z.string().email("Email không hợp lệ").max(255),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(128, "Mật khẩu quá dài"),
  job: z.string().max(100).optional(),
  address: z.string().max(255).optional(),
  referralCode: z.string().max(36).optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

export const googleAuthSchema = z.object({
  credential: z.string().min(1, "Thiếu credential"),
})

export const activateSchema = z.object({
  token: z.string().min(1, "Thiếu mã kích hoạt"),
})

export const resendActivationSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Thiếu mã đặt lại mật khẩu"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(128, "Mật khẩu quá dài"),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  job: z.string().max(100).nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  avatar: z.string().max(500).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  facebook: z.string().max(300).nullable().optional(),
  twitter: z.string().max(300).nullable().optional(),
  tiktok: z.string().max(300).nullable().optional(),
  youtube: z.string().max(300).nullable().optional(),
  zalo: z.string().max(300).nullable().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .max(128, "Mật khẩu mới quá dài"),
})

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "ai"]),
        text: z.string().min(1).max(4000),
      }),
    )
    .min(1, "Phải có ít nhất 1 tin nhắn")
    .max(50, "Quá nhiều tin nhắn"),
})
