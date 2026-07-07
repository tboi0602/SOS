import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { requireAuth } from "../../middleware/auth"
import { membershipController } from "../../controllers/membershipController"

const router = Router()

const baseDocsDir = path.join(process.cwd(), "public", "uploads", "membership-docs")

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = (req as any).user?.userId || "unknown"
    const dir = path.join(baseDocsDir, userId)
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const prefix = Date.now() + "-" + file.fieldname + "-"
    cb(null, prefix + file.originalname)
  },
})

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"]
const DOC_EXTS = [".pdf", ".doc", ".docx", ".zip", ".rar"]

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (file.fieldname === "documents" && DOC_EXTS.includes(ext)) return cb(null, true)
    if ((file.fieldname === "idCardFront" || file.fieldname === "idCardBack" || file.fieldname === "achievements") && IMAGE_EXTS.includes(ext)) return cb(null, true)
    cb(new Error(`File không hợp lệ: ${file.originalname}`))
  },
})

router.use(requireAuth)

router.get("/my-flow", membershipController.getMyFlow)
router.post("/upload-docs", upload.fields([
  { name: "documents", maxCount: 10 },
  { name: "idCardFront", maxCount: 1 },
  { name: "idCardBack", maxCount: 1 },
  { name: "achievements", maxCount: 10 },
]), membershipController.uploadDocuments)
router.post("/confirm-payment", membershipController.confirmPayment)
router.get("/lessons", membershipController.getLessons)
router.post("/lessons/:lessonId/submit", membershipController.submitLesson)
router.get("/quiz", membershipController.getQuiz)
router.post("/quiz/submit", membershipController.submitQuiz)
router.get("/situations", membershipController.getSituations)
router.post("/situations/:index/submit", membershipController.submitSituations)

export default router
