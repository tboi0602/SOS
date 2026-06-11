import { Router } from "express"
import { contactController } from "../../controllers/contactController"
import { requireAuth, requireAdminOrPermission } from "../../middleware/auth"

const router = Router()

router.post("/", contactController.submit)
router.get("/", requireAuth, requireAdminOrPermission, contactController.list)
router.put("/:id/read", requireAuth, requireAdminOrPermission, contactController.markRead)
router.delete("/:id", requireAuth, requireAdminOrPermission, contactController.delete)

export default router
