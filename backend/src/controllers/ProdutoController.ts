import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ProdutoModel } from "../models/ProdutoModel.js";
import { StorageProvider } from "../utils/StorageProvider.js";

export const ProdutoController = {
  // Busca de produtos
  listarTodos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const produtos = await ProdutoModel.listarTodos();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  },

  listarTodosAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const produtos = await ProdutoModel.listarTodosAdmin();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  },

  listarPopulares: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const produtos = await ProdutoModel.listarPopulares();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  },

  listarNovidades: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const produtos = await ProdutoModel.listarNovidades();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  },

  // Criação de produtos
  criar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imagem_url = req.file ? `/images/${req.file.filename}` : null;

      const { nome, descricao, categoria, tags } = req.body;
      const preco = parseFloat(req.body.preco);
      const promocao = req.body.promocao === "true";
      const is_loja = req.body.is_loja === "true";
      const is_manga = req.body.is_manga === "true";
      const visivel = req.body.visivel === "false" ? false : true;

      if (!nome || isNaN(preco) || !categoria) {
        if (req.file) {
          await StorageProvider.deleteFile(req.file.path);
        }

        throw new AppError(
          "Dados inválidos. Verifique nome, preço e categoria.",
          400,
        );
      }

      const produto = await ProdutoModel.criar({
        nome,
        descricao,
        preco,
        categoria,
        imagem_url,
        promocao,
        tags: tags || null,
        is_loja,
        is_manga,
        visivel,
      });

      res.status(201).json(produto);
    } catch (error) {
      if (req.file) {
        await StorageProvider.deleteFile(req.file.path);
      }
      next(error);
    }
  },

  // Atualização de produtos
  atualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const imagem_url = req.file ? `/images/${req.file.filename}` : null;

      const { nome, descricao, categoria, tags } = req.body;
      const preco = req.body.preco ? parseFloat(req.body.preco) : undefined;
      const promocao = req.body.promocao === "true";
      const is_loja = req.body.is_loja === "true";
      const is_manga = req.body.is_manga === "true";
      const visivel = req.body.visivel !== undefined ? req.body.visivel === "true" : undefined;

      const produto = await ProdutoModel.atualizar(id, {
        nome,
        descricao,
        preco: preco as number,
        categoria,
        imagem_url,
        promocao,
        tags: tags || null,
        is_loja,
        is_manga,
        visivel,
      });

      if (!produto) {
        if (req.file) {
          await StorageProvider.deleteFile(req.file.path);
        }
        throw new AppError("Produto não encontrado", 404);
      }

      res.json(produto);
    } catch (error) {
      if (req.file) {
        await StorageProvider.deleteFile(req.file.path);
      }
      next(error);
    }
  },

  // Exclusão de produtos
  deletar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const produto = await ProdutoModel.deletar(id);

      if (!produto) {
        throw new AppError("Produto não encontrado", 404);
      }

      if (produto.imagem_url) {
        await StorageProvider.deleteFile(produto.imagem_url);
      }

      res.json({ message: "Produto deletado com sucesso", produto: produto });
    } catch (error) {
      next(error);
    }
  },

  // Curtidas
  adicionarCurtida: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const novasCurtidas = await ProdutoModel.curtir(id);

      if (!novasCurtidas && novasCurtidas !== 0) {
        throw new AppError("Produto não encontrado", 404);
      }

      res.json({ novas_curtidas: novasCurtidas });
    } catch (error) {
      next(error);
    }
  },

  removerCurtida: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const novasCurtidas = await ProdutoModel.descurtir(id);

      if (!novasCurtidas && novasCurtidas !== 0) {
        throw new AppError("Produto não encontrado", 404);
      }

      res.json({ novas_curtidas: novasCurtidas });
    } catch (error) {
      next(error);
    }
  },

  alternarVisibilidade: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const produto = await ProdutoModel.alternarVisibilidade(id);

      if (!produto) {
        throw new AppError("Produto não encontrado", 404);
      }

      res.json(produto);
    } catch (error) {
      next(error);
    }
  },
};
