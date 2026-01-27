import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { AppError } from "../errors/AppError.js";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);

router.get("/verify", authMiddleware, (req, res) => {
  throw new AppError("Token inválido ou expirado", 401);
});

export default router;
