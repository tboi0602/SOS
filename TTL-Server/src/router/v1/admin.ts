import { Router } from "express"
import { requireAuth, requireAdminOrPermission, requirePermission } from "../../middleware/auth"
import { adminController } from "../../controllers/adminController"
import { journalController } from "../../controllers/journalController"
import { submissionController } from "../../controllers/submissionController"
import { postController } from "../../controllers/postController"

const router = Router()

router.use(requireAuth)
router.use(requireAdminOrPermission)

router.get("/dashboard", adminController.getDashboard)
router.get("/stats", adminController.getStats)
router.get("/activity-log", adminController.getActivityLog)
router.delete("/activity-log", adminController.deleteAllActivityLog)
router.delete("/activity-log/:id", adminController.deleteActivityLog)

router.get("/users", requirePermission("manage_users"), adminController.listUsers)
router.get("/users/:id", requirePermission("manage_users"), adminController.getUserById)
router.put("/users/:id/role", requirePermission("manage_users"), adminController.updateUserRole)
router.delete("/users/:id", requirePermission("manage_users"), adminController.deleteUser)
router.put("/users/:id/permissions", requirePermission("manage_permissions"), adminController.updateUserPermissions)
router.post("/users/:id/block", requirePermission("manage_users"), adminController.blockUser)
router.post("/users/:id/unblock", requirePermission("manage_users"), adminController.unblockUser)

router.get("/journals/pending", requirePermission("approve_journals"), journalController.listPending)
router.get("/journals/approved", requirePermission("approve_journals"), journalController.listApproved)
router.put("/journals/:id/approve", requirePermission("approve_journals"), journalController.approve)
router.put("/journals/:id/reject", requirePermission("approve_journals"), journalController.reject)

router.get("/submissions/pending", requirePermission("approve_submissions"), submissionController.listPending)
router.get("/submissions/approved", requirePermission("approve_submissions"), submissionController.listApproved)
router.put("/submissions/:id/approve", requirePermission("approve_submissions"), submissionController.approve)
router.put("/submissions/:id/reject", requirePermission("approve_submissions"), submissionController.reject)

router.get("/posts", requirePermission("approve_posts"), postController.listAll)
router.get("/posts/pending", requirePermission("approve_posts"), postController.listPending)
router.get("/posts/approved", requirePermission("approve_posts"), postController.listApproved)
router.put("/posts/:id/approve", requirePermission("approve_posts"), postController.approve)
router.put("/posts/:id/reject", requirePermission("approve_posts"), postController.reject)
router.delete("/posts/:id", requirePermission("approve_posts"), postController.adminDelete)

router.get("/pending-members", adminController.getPendingMembers)
router.get("/pending-members/:userId/items", adminController.getUserPendingItems)

export default router
