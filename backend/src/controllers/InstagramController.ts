import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { InstagramModel } from "../models/InstagramModel.js";
import { StorageProvider } from "../utils/StorageProvider.js";

export const InstagramController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await InstagramModel.getAllPosts(true);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },

  listarAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await InstagramModel.getAllPosts(false);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },

  criar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError("A imagem é obrigatória.", 400);
      }

      const imagem_url = `/images/${req.file.filename}`;
      const { link_url } = req.body;
      const ordem = req.body.ordem ? parseInt(req.body.ordem) : 0;

      if (!link_url) {
        await StorageProvider.deleteFile(req.file.path);
        throw new AppError("O link do Instagram é obrigatório.", 400);
      }

      const post = await InstagramModel.createPost({
        imagem_url,
        link_url,
        ordem
      });

      res.status(201).json(post);
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
      const { link_url, visivel, ordem } = req.body;

      const post = await InstagramModel.updatePost(parseInt(id), {
        imagem_url,
        link_url,
        visivel: visivel !== undefined ? visivel === "true" || visivel === true : undefined,
        ordem: ordem !== undefined ? parseInt(ordem) : undefined
      });

      if (!post) {
        if (req.file) {
            await StorageProvider.deleteFile(req.file.path);
        }
        throw new AppError("Post não encontrado.", 404);
      }

      res.json(post);
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
      const deletado = await InstagramModel.deletePost(parseInt(id));

      if (!deletado) {
        throw new AppError("Post não encontrado.", 404);
      }

      res.json({ message: "Post deletado com sucesso." });
    } catch (error) {
      next(error);
    }
  }
};
