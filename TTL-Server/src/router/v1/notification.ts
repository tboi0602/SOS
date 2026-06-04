import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { requireAdminOrPermission } from "../../middleware/auth"
import { notificationController } from "../../controllers/notificationController"

const router = Router()

router.get("/unread-count", requireAuth, notificationController.unreadCount)
router.get("/", requireAuth, notificationController.list)
router.put("/:id/read", requireAuth, notificationController.markRead)
router.put("/read-all", requireAuth, notificationController.markAllRead)

router.post("/", requireAuth, requireAdminOrPermission, notificationController.create)
router.delete("/:id", requireAuth, requireAdminOrPermission, notificationController.delete)

export default router
