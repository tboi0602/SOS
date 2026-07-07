import { type Request, type Response } from "express"
import { getDb } from "../db"
import { NotFoundError } from "../lib/errors"
import { asyncHandler } from "../lib/asyncHandler"

export const publicController = {
  checkGraduated: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId as string
    if (!userId) throw new NotFoundError("Thiếu ID người dùng")

    const user = await getDb().user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError("Không tìm thấy người dùng")

    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      hasGraduated: user.graduationId != null,
    })
  }),
}
