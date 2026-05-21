import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { submissionController } from "../../controllers/submissionController"

const router = Router()

router.use(requireAuth)

router.get("/me", submissionController.getMySubmissions)
router.post("/", submissionController.create)
router.delete("/:id", submissionController.delete)
router.get("/penalty", submissionController.checkPenalty)

export default router
