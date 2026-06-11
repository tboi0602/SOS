import { Router } from "express"
import { requireAuth, requireAdminOrPermission, requireAdmin, requirePermission } from "../../middleware/auth"
import { adminController } from "../../controllers/adminController"
import { journalController } from "../../controllers/journalController"
import { submissionController } from "../../controllers/submissionController"
import { postController } from "../../controllers/postController"

const router = Router()

router.use(requireAuth)
router.use(requireAdminOrPermission)

router.get("/dashboard", adminController.getDashboard)
router.get("/stats", adminController.getStats)
router.get("/activity-log", requireAdmin, adminController.getActivityLog)
router.delete("/activity-log", requireAdmin, adminController.deleteAllActivityLog)
router.delete("/activity-log/:id", requireAdmin, adminController.deleteActivityLog)

router.get("/users", requirePermission("manage_users"), adminController.listUsers)
router.get("/users/:id", requirePermission("manage_users"), adminController.getUserById)
router.put("/users/:id/role", requirePermission("manage_users"), adminController.updateUserRole)
router.delete("/users/:id", requirePermission("manage_users"), adminController.deleteUser)
router.put("/users/:id/permissions", requirePermission("manage_users"), adminController.updateUserPermissions)
router.post("/users/:id/block", requirePermission("manage_users"), adminController.blockUser)
router.post("/users/:id/unblock", requirePermission("manage_users"), adminController.unblockUser)

router.get("/journals/pending", requirePermission("manage_content"), journalController.listPending)
router.get("/journals/approved", requirePermission("manage_content"), journalController.listApproved)
router.put("/journals/:id/approve", requirePermission("manage_content"), journalController.approve)
router.put("/journals/:id/reject", requirePermission("manage_content"), journalController.reject)

router.get("/submissions/pending", requirePermission("manage_content"), submissionController.listPending)
router.get("/submissions/approved", requirePermission("manage_content"), submissionController.listApproved)
router.put("/submissions/:id/approve", requirePermission("manage_content"), submissionController.approve)
router.put("/submissions/:id/reject", requirePermission("manage_content"), submissionController.reject)

router.get("/posts", requirePermission("manage_content"), postController.listAll)
router.get("/posts/pending", requirePermission("manage_content"), postController.listPending)
router.get("/posts/approved", requirePermission("manage_content"), postController.listApproved)
router.put("/posts/:id/approve", requirePermission("manage_content"), postController.approve)
router.put("/posts/:id/reject", requirePermission("manage_content"), postController.reject)
router.delete("/posts/:id", requirePermission("manage_content"), postController.adminDelete)

router.get("/pending-counts", requirePermission("manage_content"), adminController.getPendingCounts)

export default router
