import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { authController } from "../../controllers/authController"
import { requireAuth } from "../../middleware/auth"
import { authLimiter } from "../../middleware/rateLimit"
import { validate } from "../../middleware/validate"
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  activateSchema,
  resendActivationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../../schemas/auth"

const router = Router()

const avatarDir = path.join(process.cwd(), "public", "uploads", "avatars")
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  },
})

router.post("/register", authLimiter, validate(registerSchema), authController.register)
router.post("/login", authLimiter, validate(loginSchema), authController.login)
router.post("/google", authLimiter, validate(googleAuthSchema), authController.google)
router.post("/logout", authController.logout)
router.get("/me", requireAuth, authController.me)
router.get("/referral/:code", authController.checkReferral)

router.get("/oidc/init", authLimiter, authController.oidcInit)
router.get("/oidc/callback", authLimiter, authController.oidcCallback)

router.post("/activate", validate(activateSchema), authController.activate)
router.post("/resend-activation", authLimiter, validate(resendActivationSchema), authController.resendActivation)
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword)
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword)
router.put("/profile", requireAuth, validate(updateProfileSchema), authController.updateProfile)
router.put("/change-password", requireAuth, validate(changePasswordSchema), authController.changePassword)
router.post("/avatar", requireAuth, upload.single("avatar"), authController.uploadAvatar)
router.delete("/account", requireAuth, authController.deleteAccount)

export default router
