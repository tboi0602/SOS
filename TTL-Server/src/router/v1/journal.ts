import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { journalController } from "../../controllers/journalController"
import { requireAuth } from "../../middleware/auth"
import { optionalAuth } from "../../middleware/optionalAuth"

const router = Router()

const journalsDir = path.join(process.cwd(), "public", "uploads", "journals")
if (!fs.existsSync(journalsDir)) {
  fs.mkdirSync(journalsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, journalsDir),
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

router.post("/upload", requireAuth, upload.array("files"), (req, res) => {
  const files = req.files as Express.Multer.File[]
  const urls = files.map((file) => `/uploads/journals/${file.filename}`)
  res.json({ urls })
})

router.post("/", requireAuth, journalController.create)
router.get("/me", requireAuth, journalController.getMyEntries)
router.get("/user/:userId", optionalAuth, journalController.getByUser)
router.delete("/:id", requireAuth, journalController.delete)

export default router
