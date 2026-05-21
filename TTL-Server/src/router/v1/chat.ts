import { Router } from "express"
import { chatController } from "../../controllers/chatController"
import { chatLimiter } from "../../middleware/rateLimit"
import { validate } from "../../middleware/validate"
import { chatSchema } from "../../schemas/auth"

const router = Router()

router.post("/", chatLimiter, validate(chatSchema), chatController.send)

export default router
