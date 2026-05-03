import { pool } from "../config/db.js";
import { Produto } from "../types/ProdutoTypes.js";

export const ProdutoModel = {
  listarTodos: async () => {
    const result = await pool.query("SELECT * FROM produtos WHERE visivel = true ORDER BY id ASC");
    return result.rows;
  },

  listarTodosAdmin: async () => {
    const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");
    return result.rows;
  },

  listarPopulares: async () => {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE visivel = true ORDER BY curtidas DESC LIMIT 6",
    );
    return result.rows;
  },

  listarNovidades: async () => {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE visivel = true ORDER BY criado_em DESC LIMIT 3",
    );
    return result.rows;
  },

  criar: async (data: Partial<Produto>) => {
    const query = `
      INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, promocao, tags, is_loja, is_manga, preco_original, visivel)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      data.nome,
      data.descricao,
      data.preco,
      data.categoria,
      data.imagem_url,
      data.promocao,
      data.tags || null,
      data.is_loja || false,
      data.is_manga || false,
      data.preco_original || null,
      data.visivel ?? true,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  atualizar: async (id: string | number, data: Partial<Produto>) => {
    const query = `
      UPDATE produtos
      SET nome = $1,
          descricao = $2,
          preco = $3,
          categoria = $4,
          imagem_url = COALESCE($5, imagem_url),
          promocao = $6,
          tags = $7,
          is_loja = $8,
          is_manga = $9,
          preco_original = $10,
          visivel = COALESCE($11, visivel)
      WHERE id = $12
      RETURNING *;
    `;

    const values = [
      data.nome,
      data.descricao,
      data.preco,
      data.categoria,
      data.imagem_url,
      data.promocao,
      data.tags || null,
      data.is_loja || false,
      data.is_manga || false,
      data.preco_original || null,
      data.visivel,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  deletar: async (id: string | number) => {
    const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  },

  curtir: async (id: string | number) => {
    const result = await pool.query(
      "UPDATE produtos SET curtidas = curtidas + 1 WHERE id = $1 RETURNING curtidas",
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].curtidas;
  },

  descurtir: async (id: string | number) => {
    const result = await pool.query(
      "UPDATE produtos SET curtidas = GREATEST(curtidas - 1, 0) WHERE id = $1 RETURNING curtidas",
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].curtidas;
  },

  alternarVisibilidade: async (id: string | number) => {
    const query = `
      UPDATE produtos
      SET visivel = NOT visivel
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
