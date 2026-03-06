import { Request, Response } from "express";
import { OrderModel } from "../models/OrderModel.js";

export const OrderController = {
  createOrder: async (req: Request, res: Response): Promise<void> => {
    try {
      const { cliente_nome, cliente_endereco, itens } = req.body;

      if (!cliente_nome || !cliente_endereco || !itens || !itens.length) {
        res
          .status(400)
          .json({
            error: "Dados inválidos: Nome, endereço e itens são obrigatórios.",
          });
        return;
      }

      //Criar pedido usando os preços do banco de dados
      const order = await OrderModel.createOrder(
        cliente_nome,
        cliente_endereco,
        itens,
      );

      res.status(201).json({
        message: "Pedido criado com sucesso",
        orderId: order.id,
        total: order.total,
      });
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({
        error: error.message || "Erro interno ao processar o pedido",
      });
    }
  },

  getAllOrders: async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await OrderModel.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  },

  getOrderDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const items = await OrderModel.getOrderItems(Number(id));
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar detalhes do pedido" });
    }
  },

  updateOrderStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: "Status é obrigatório" });
        return;
      }

      const updatedOrder = await OrderModel.updateStatus(Number(id), status);

      if (!updatedOrder) {
        res.status(404).json({ error: "Pedido não encontrado" });
        return;
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar status" });
    }
  },
};
