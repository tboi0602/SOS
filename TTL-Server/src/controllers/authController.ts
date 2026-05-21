import { type Request, type Response } from "express";
import { authService } from "../services/authService";
import { asyncHandler } from "../lib/asyncHandler";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, COOKIE_OPTIONS);
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setTokenCookie(res, result.token);
    res.status(201).json({ user: result.user });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    setTokenCookie(res, result.token);
    res.json({ user: result.user });
  }),

  google: asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;
    const result = await authService.googleAuth(credential);
    setTokenCookie(res, result.token);
    res.json({ user: result.user });
  }),

  logout(_req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Đã đăng xuất" });
  },

  activate: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.activate(req.body.token);
    res.json(result);
  }),

  resendActivation: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resendActivation(req.body.email);
    res.json(result);
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resetPassword(
      req.body.token,
      req.body.password,
    );
    res.json(result);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!.userId);
    res.json({ user });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!.userId, req.body);
    res.json({ user });
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changePassword(
      req.user!.email,
      req.body.currentPassword,
      req.body.newPassword,
    );
    res.json(result);
  }),

  checkReferral: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.checkReferral(String(req.params.code));
    res.json(result);
  }),

  uploadAvatar: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "Vui lòng chọn file ảnh" });
      return;
    }
    const url = `/uploads/avatars/${req.file.filename}`;
    const user = await authService.updateProfile(req.user!.userId, {
      avatar: url,
    });
    res.json({ user });
  }),
};
