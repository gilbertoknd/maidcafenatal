import { Request, Response, NextFunction } from "express";
import { PedidoModel } from "../models/PedidoModel.js";
import { AppError } from "../errors/AppError.js";

export const PedidoController = {
  criarPedido: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cliente_nome, cliente_endereco, itens } = req.body;

      if (!cliente_nome || !cliente_endereco || !itens || !itens.length) {
        throw new AppError("Dados inválidos: Nome, endereço e itens são obrigatórios.", 400);
      }

      const pedido = await PedidoModel.criarPedido(
        cliente_nome,
        cliente_endereco,
        itens,
      );

      res.status(201).json({
        message: "Pedido criado com sucesso",
        pedido_id: pedido.id,
        total: pedido.total,
      });
    } catch (error) {
      next(error);
    }
  },

  listarTodos: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pedidos = await PedidoModel.listarTodos();
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  },

  buscarItens: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const itens = await PedidoModel.buscarItensPedido(Number(id));
      res.status(200).json(itens);
    } catch (error) {
      next(error);
    }
  },

  atualizarStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new AppError("Status é obrigatório", 400);
      }

      const pedidoAtualizado = await PedidoModel.atualizarStatus(Number(id), status);

      if (!pedidoAtualizado) {
        throw new AppError("Pedido não encontrado", 404);
      }

      res.status(200).json(pedidoAtualizado);
    } catch (error) {
      next(error);
    }
  },
};
