import { Router } from "express";
import { PedidoController } from "../controllers/PedidoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Endpoint público para criar o carrinho
router.post("/", PedidoController.criarPedido);

// Endpoints protegidos para o painel admin
router.get("/", authMiddleware, PedidoController.listarTodos);
router.get("/:id", authMiddleware, PedidoController.buscarItens);
router.put("/:id/status", authMiddleware, PedidoController.atualizarStatus);

export default router;
