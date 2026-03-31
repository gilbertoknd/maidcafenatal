import { Request, Response, NextFunction } from "express";
import { EventoModel } from "../models/EventoModel.js";
import { Evento } from "../types/EventoTypes.js";
import { AppError } from "../errors/AppError.js";
import { StorageProvider } from "../utils/StorageProvider.js";

export const EventoController = {
  listarTodos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventos = await EventoModel.listarTodos();
      res.status(200).json(eventos);
    } catch (error) {
      next(error);
    }
  },

  listarTodosAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventos = await EventoModel.listarTodosAdmin();
      res.status(200).json(eventos);
    } catch (error) {
      next(error);
    }
  },

  buscarPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const evento = await EventoModel.buscarPorId(id);

      if (!evento) {
        throw new AppError("Evento não encontrado", 404);
      }

      res.status(200).json(evento);
    } catch (error) {
      next(error);
    }
  },

  criar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imagem_url = req.file ? `/images/${req.file.filename}` : null;
      
      const { titulo, descricao, data, local } = req.body;
      const visivel = req.body.visivel === "false" ? false : true;

      const eventData: Partial<Evento> = {
        titulo,
        descricao,
        data,
        local,
        visivel,
        imagem_url
      };

      const novoEvento = await EventoModel.criar(eventData);
      res.status(201).json(novoEvento);
    } catch (error) {
      if (req.file) {
        await StorageProvider.deleteFile(req.file.path);
      }
      next(error);
    }
  },

  atualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const imagem_url = req.file ? `/images/${req.file.filename}` : undefined;

      const { titulo, descricao, data, local } = req.body;
      const visivel = req.body.visivel !== undefined ? req.body.visivel === "true" : undefined;

      const eventData: Partial<Evento> = {
        titulo,
        descricao,
        data,
        local,
        visivel,
        imagem_url
      };

      const eventoAtualizado = await EventoModel.atualizar(id, eventData);

      if (!eventoAtualizado) {
        if (req.file) {
          await StorageProvider.deleteFile(req.file.path);
        }
        throw new AppError("Evento não encontrado", 404);
      }

      res.status(200).json(eventoAtualizado);
    } catch (error) {
      if (req.file) {
        await StorageProvider.deleteFile(req.file.path);
      }
      next(error);
    }
  },

  deletar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const eventoDeletado = await EventoModel.deletar(id);

      if (!eventoDeletado) {
        throw new AppError("Evento não encontrado", 404);
      }

      if (eventoDeletado.imagem_url) {
        await StorageProvider.deleteFile(eventoDeletado.imagem_url);
      }

      res
        .status(200)
        .json({
          message: "Evento deletado com sucesso",
          evento: eventoDeletado,
        });
    } catch (error) {
      next(error);
    }
  },

  alternarVisibilidade: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const eventoAtualizado = await EventoModel.alternarVisibilidade(id);

      if (!eventoAtualizado) {
        throw new AppError("Evento não encontrado", 404);
      }

      res.status(200).json(eventoAtualizado);
    } catch (error) {
      next(error);
    }
  },
};
