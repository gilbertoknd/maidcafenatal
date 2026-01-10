import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { uploadConfig } from "../config/upload.js";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/populares", ProductController.getPopular);
router.get("/novidades", ProductController.getNew);
router.patch("/:id/like", ProductController.addLike);
router.patch("/:id/unlike", ProductController.removeLike);
router.post("/", uploadConfig.single("image"), ProductController.create);
router.put("/:id", uploadConfig.single("image"), ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
