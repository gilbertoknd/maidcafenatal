import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import path from "path";
import fs from "fs";
import {
  criarProduto,
  listarTodosProdutos,
  listarTodosProdutosAdmin,
  listarNovosProdutos,
  listarProdutosPopulares,
  atualizarProduto,
  deletarProduto,
  curtirProduto,
  descurtirProduto,
} from "../models/ProdutoModel.js";

export class ProdutoController {
  // Busca de produtos
  static async listarTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await listarTodosProdutos();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  static async listarTodosAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await listarTodosProdutosAdmin();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  static async listarPopulares(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await listarProdutosPopulares();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  static async listarNovos(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await listarNovosProdutos();
      res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  // Criação de produtos
  static async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const imagem_url = req.file ? `/images/${req.file.filename}` : null;

      const { nome, descricao, categoria, tags } = req.body;
      const preco = parseFloat(req.body.preco);
      const promocao = req.body.promocao === "true";
      const is_loja = req.body.is_loja === "true";
      const visivel = req.body.visivel === "false" ? false : true;

      if (!nome || isNaN(preco) || !categoria) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        throw new AppError(
          "Dados inválidos. Verifique nome, preço e categoria.",
          400,
        );
      }

      const produto = await criarProduto({
        nome,
        descricao,
        preco,
        categoria,
        imagem_url,
        promocao,
        tags: tags || null,
        is_loja,
        visivel,
      });

      res.status(201).json(produto);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Erro ao apagar imagem órfã:", err);
        });
      }
      next(error);
    }
  }

  // Atualização de produtos
  static async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const imagem_url = req.file ? `/images/${req.file.filename}` : null;

      const { nome, descricao, categoria, tags } = req.body;
      const preco = req.body.preco ? parseFloat(req.body.preco) : undefined;
      const promocao = req.body.promocao === "true";
      const is_loja = req.body.is_loja === "true";
      const visivel = req.body.visivel !== undefined ? req.body.visivel === "true" : undefined;

      const produto = await atualizarProduto(id, {
        nome,
        descricao,
        preco: preco as number,
        categoria,
        imagem_url,
        promocao,
        tags: tags || null,
        is_loja,
        visivel,
      });

      if (!produto) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        throw new AppError("Produto não encontrado", 404);
      }

      res.json(produto);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {});
      }
      next(error);
    }
  }

  // Exclusão de produtos
  static async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const produto = await deletarProduto(id);

      if (!produto) {
        throw new AppError("Produto não encontrado", 404);
      }

      if (produto.imagem_url) {
        const nomeArquivo = produto.imagem_url.split("/").pop();
        const imagePath = path.resolve(
          process.cwd(),
          "public",
          "images",
          nomeArquivo,
        );

        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(imagePath, () =>
              console.log("Imagem deletada do disco:", produto.imagem_url),
            );
          }
        });
      }

      res.json({ message: "Produto deletado com sucesso", produto: produto });
    } catch (error) {
      next(error);
    }
  }

  // Curtidas
  static async adicionarCurtida(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const novasCurtidas = await curtirProduto(id);

      if (!novasCurtidas && novasCurtidas !== 0) {
        throw new AppError("Produto não encontrado", 404);
      }

      res.json({ novas_curtidas: novasCurtidas });
    } catch (error) {
      next(error);
    }
  }

  static async removerCurtida(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const novasCurtidas = await descurtirProduto(id);

      if (!novasCurtidas && novasCurtidas !== 0) {
        throw new AppError("Produto não encontrado", 404);
      }

      res.json({ novas_curtidas: novasCurtidas });
    } catch (error) {
      next(error);
    }
  }
}
