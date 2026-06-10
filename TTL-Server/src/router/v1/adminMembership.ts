import { Router } from "express"
import { requireAuth, requireAdminOrPermission } from "../../middleware/auth"
import { adminMembershipController } from "../../controllers/adminMembershipController"

const router = Router()

router.use(requireAuth)
router.use(requireAdminOrPermission)

router.get("/settings", adminMembershipController.getSettings)
router.put("/settings", adminMembershipController.updateFlow)

router.post("/lessons", adminMembershipController.createLesson)
router.put("/lessons/:id", adminMembershipController.updateLesson)
router.delete("/lessons/:id", adminMembershipController.deleteLesson)

router.post("/quiz-questions", adminMembershipController.createQuizQuestion)
router.put("/quiz-questions/:id", adminMembershipController.updateQuizQuestion)
router.delete("/quiz-questions/:id", adminMembershipController.deleteQuizQuestion)

router.post("/situation-questions", adminMembershipController.createSituationQuestion)
router.put("/situation-questions/:id", adminMembershipController.updateSituationQuestion)
router.delete("/situation-questions/:id", adminMembershipController.deleteSituationQuestion)

router.get("/pending-docs", adminMembershipController.getPendingDocs)
router.get("/pending-payments", adminMembershipController.getPendingPayments)
router.get("/active", adminMembershipController.getActiveMembers)

router.put("/:userId/approve-docs", adminMembershipController.approveDocs)
router.put("/:userId/reject-docs", adminMembershipController.rejectDocs)
router.put("/:userId/verify-payment", adminMembershipController.verifyPayment)
router.put("/:userId/reject-payment", adminMembershipController.rejectPayment)
router.put("/:userId/complete", adminMembershipController.completeFlow)

router.put("/score-lesson/:lessonId", adminMembershipController.scoreLesson)
router.put("/score-situation/:userId/:index", adminMembershipController.scoreSituation)

/* ─── Exam Set CRUD ─── */
router.post("/exam-sets", adminMembershipController.createExamSet)
router.put("/exam-sets/:id", adminMembershipController.updateExamSet)
router.delete("/exam-sets/:id", adminMembershipController.deleteExamSet)
router.post("/exam-sets/:id/questions", adminMembershipController.addQuestionsToExamSet)
router.delete("/exam-sets/:id/questions/:questionId", adminMembershipController.removeQuestionFromExamSet)
router.get("/exam-sets", adminMembershipController.getExamSets)

export default router
