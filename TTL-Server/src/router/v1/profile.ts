import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { optionalAuth } from "../../middleware/optionalAuth"
import { profileController } from "../../controllers/profileController"

const router = Router()

router.get("/", requireAuth, profileController.getProfile)
router.get("/public/:userId", optionalAuth, profileController.getPublicProfile)
router.get("/members", optionalAuth, profileController.listMembers)
router.get("/referred-members", requireAuth, profileController.getReferredMembers)
router.get("/top-sales", optionalAuth, profileController.getTopSales)

export default router
