import { Router } from "express"
import multer from "multer"
import path from "path"
import { requireAuth } from "../../middleware/auth"
import { membershipController } from "../../controllers/membershipController"

const router = Router()

const docsDir = path.join(process.cwd(), "public", "uploads", "membership-docs")

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, docsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) return cb(null, true)
    cb(new Error("Chỉ chấp nhận file ảnh, PDF, DOC, DOCX"))
  },
})

router.use(requireAuth)

router.get("/my-flow", membershipController.getMyFlow)
router.post("/upload-docs", upload.array("files", 10), membershipController.uploadDocuments)
router.post("/confirm-payment", membershipController.confirmPayment)
router.get("/lessons", membershipController.getLessons)
router.post("/lessons/:lessonId/submit", membershipController.submitLesson)
router.get("/quiz", membershipController.getQuiz)
router.post("/quiz/submit", membershipController.submitQuiz)
router.get("/situations", membershipController.getSituations)
router.post("/situations/:index/submit", membershipController.submitSituations)

export default router
