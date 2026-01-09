import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/populares", ProductController.getPopular);
router.get("/novidades", ProductController.getNew);
router.patch("/:id/like", ProductController.addLike);
router.patch("/:id/unlike", ProductController.removeLike);

export default router;
