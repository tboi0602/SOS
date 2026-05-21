import { Router } from "express"
import { requireAuth, requireAdmin } from "../../middleware/auth"
import { adminController } from "../../controllers/adminController"
import { journalController } from "../../controllers/journalController"
import { submissionController } from "../../controllers/submissionController"

const router = Router()

router.use(requireAuth)
router.use(requireAdmin)

router.get("/users", adminController.listUsers)
router.get("/users/:id", adminController.getUserById)
router.put("/users/:id/role", adminController.updateUserRole)
router.delete("/users/:id", adminController.deleteUser)
router.get("/stats", adminController.getStats)

router.get("/journals/pending", journalController.listPending)
router.get("/journals/approved", journalController.listApproved)
router.put("/journals/:id/approve", journalController.approve)
router.put("/journals/:id/reject", journalController.reject)

router.get("/submissions/pending", submissionController.listPending)
router.get("/submissions/approved", submissionController.listApproved)
router.put("/submissions/:id/approve", submissionController.approve)
router.put("/submissions/:id/reject", submissionController.reject)

export default router
