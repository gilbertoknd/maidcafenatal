import { Router } from "express";
import { OrderController } from "../controllers/OrderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

//Endpoint público para criar o carrinho
router.post("/", OrderController.createOrder);

//Endpoints protegidos para o painel admin
router.get("/", authMiddleware, OrderController.getAllOrders);
router.get("/:id", authMiddleware, OrderController.getOrderDetails);
router.put("/:id/status", authMiddleware, OrderController.updateOrderStatus);

export default router;
