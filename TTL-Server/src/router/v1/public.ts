import { Router } from "express"
import { publicController } from "../../controllers/publicController"

const router = Router()

router.get("/graduate/:userId", publicController.checkGraduated)

export default router
