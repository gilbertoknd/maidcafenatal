import { Request, Response, NextFunction } from "express";
import {
  likeProduct,
  listAllProducts,
  listNewProducts,
  listPopularProducts,
  unlikeProduct,
} from "../models/ProductModel";

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await listAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getPopular(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await listPopularProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getNew(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await listNewProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async addLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const newLikes = await likeProduct(id);

      if (!newLikes && newLikes !== 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json({ novas_curtidas: newLikes });
    } catch (error) {
      next(error);
    }
  }

  static async removeLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const newLikes = await unlikeProduct(id);

      if (!newLikes && newLikes !== 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json({ novas_curtidas: newLikes });
    } catch (error) {
      next(error);
    }
  }
}
