import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { uploadConfig } from "../config/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

//Rotas públicas
router.get("/", ProductController.getAll);
router.get("/populares", ProductController.getPopular);
router.get("/novidades", ProductController.getNew);
router.patch("/:id/like", ProductController.addLike);
router.patch("/:id/unlike", ProductController.removeLike);

//Rotas privadas
router.post(
  "/",
  authMiddleware,
  uploadConfig.single("image"),
  ProductController.create
);
router.put(
  "/:id",
  authMiddleware,
  uploadConfig.single("image"),
  ProductController.update
);
router.delete("/:id", authMiddleware, ProductController.delete);

export default router;
