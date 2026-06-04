import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { postController } from "../../controllers/postController";
import { requireAuth } from "../../middleware/auth";
import { optionalAuth } from "../../middleware/optionalAuth";
import { validate } from "../../middleware/validate";
import {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
} from "../../schemas/post";

const router = Router();

const postsDir = path.join(process.cwd(), "public", "uploads", "posts");
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, postsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

router.post("/upload", requireAuth, upload.array("files"), postController.uploadMedia);
router.post("/", requireAuth, validate(createPostSchema), postController.create);
router.get("/", optionalAuth, postController.getAll);
router.get("/my-posts", requireAuth, postController.getMyPosts);
router.get("/news", optionalAuth, postController.getNews);
router.get("/search", optionalAuth, postController.search);
router.get("/:id", optionalAuth, postController.getById);
router.put("/:id", requireAuth, validate(updatePostSchema), postController.update);
router.delete("/:id", requireAuth, postController.delete);
router.post("/:id/like", requireAuth, postController.toggleLike);
router.post(
  "/:id/comments",
  requireAuth,
  validate(createCommentSchema),
  postController.addComment,
);
router.delete("/:id/comments/:commentId", requireAuth, postController.deleteComment);

export default router;
