import { Router } from "express"
import multer from "multer"
import path from "node:path"
import { requireAuth, requirePermission } from "../../middleware/auth"
import { customerVisitController } from "../../controllers/customerVisitController"

const customerVisitDir = path.join(process.cwd(), "public", "uploads", "customer-visits")

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, customerVisitDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp, gif)"))
    }
  },
})

const router = Router()

router.use(requireAuth)

router.post("/upload", upload.array("images", 10), customerVisitController.upload)
router.get("/", customerVisitController.list)
router.delete("/:id", customerVisitController.delete)

// Admin routes
router.get("/admin", requirePermission("manage_content"), customerVisitController.adminList)
router.put("/:id/review", requirePermission("manage_content"), customerVisitController.review)

export default router
