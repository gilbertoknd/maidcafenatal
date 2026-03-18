import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../models/OrderModel.js";
import { AppError } from "../errors/AppError.js";

export const OrderController = {
  createOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cliente_nome, cliente_endereco, itens } = req.body;

      if (!cliente_nome || !cliente_endereco || !itens || !itens.length) {
        throw new AppError("Dados inválidos: Nome, endereço e itens são obrigatórios.", 400);
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
    } catch (error) {
      next(error);
    }
  },

  getAllOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await OrderModel.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  getOrderDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const items = await OrderModel.getOrderItems(Number(id));
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new AppError("Status é obrigatório", 400);
      }

      const updatedOrder = await OrderModel.updateStatus(Number(id), status);

      if (!updatedOrder) {
        throw new AppError("Pedido não encontrado", 404);
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
};
