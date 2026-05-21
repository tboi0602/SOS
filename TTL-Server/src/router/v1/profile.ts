import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { profileController } from "../../controllers/profileController"

const router = Router()

router.use(requireAuth)

router.get("/", profileController.getProfile)
router.get("/public/:userId", profileController.getPublicProfile)
router.get("/members", profileController.listMembers)
router.get("/referred-members", profileController.getReferredMembers)
router.get("/top-sales", profileController.getTopSales)

export default router
