import { type Request, type Response } from "express"
import { customerVisitService } from "../services/customerVisitService"
import { asyncHandler } from "../lib/asyncHandler"

export const customerVisitController = {
  upload: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh" });
    }
    const urls = files.map((file) => `/uploads/customer-visits/${file.filename}`);
    const description = req.body.description as string | undefined;
    const results = await Promise.all(
      urls.map((url) => customerVisitService.upload(req.user!.userId, url, description)),
    );
    res.json({ images: results, urls });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const images = await customerVisitService.listByUser(req.user!.userId);
    res.json({ images });
  }),

  adminList: asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const images = await customerVisitService.listAll(status);
    res.json({ images });
  }),

  review: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: "APPROVED" | "REJECTED" };
    const result = await customerVisitService.review(id, req.user!.userId, status);
    res.json({ image: result });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const result = await customerVisitService.delete(req.params.id, req.user!.userId);
    res.json(result);
  }),
};
