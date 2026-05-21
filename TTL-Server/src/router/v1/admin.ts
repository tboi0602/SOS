import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { adminController } from "../../controllers/adminController";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/users", adminController.listUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/stats", adminController.getStats);

export default router;
