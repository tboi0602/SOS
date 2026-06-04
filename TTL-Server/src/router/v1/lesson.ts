import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { requireAuth } from "../../middleware/auth"
import { requireAdminOrPermission } from "../../middleware/auth"
import { lessonController } from "../../controllers/lessonController"

const router = Router()

const lessonsDir = path.join(process.cwd(), "public", "uploads", "lessons")
if (!fs.existsSync(lessonsDir)) {
  fs.mkdirSync(lessonsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, lessonsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  },
})

router.get("/", lessonController.list)
router.get("/:id", lessonController.getById)

router.post("/upload", requireAuth, requireAdminOrPermission, upload.array("files"), lessonController.uploadMedia)
router.post("/", requireAuth, requireAdminOrPermission, lessonController.create)
router.put("/:id", requireAuth, requireAdminOrPermission, lessonController.update)
router.delete("/:id", requireAuth, requireAdminOrPermission, lessonController.delete)

export default router
