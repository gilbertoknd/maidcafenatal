import { pool } from "../config/db.js";
import { Produto } from "../types/ProdutoTypes.js";

// Produto model responsável por interagir com a tabela produtos no banco de dados

// Busca de produtos
export async function listarTodosProdutos() {
  const result = await pool.query("SELECT * FROM produtos WHERE visivel = true ORDER BY id ASC");
  return result.rows;
}

export async function listarTodosProdutosAdmin() {
  const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");
  return result.rows;
}

export async function listarProdutosPopulares() {
  const result = await pool.query(
    "SELECT * FROM produtos WHERE visivel = true ORDER BY curtidas DESC LIMIT 6",
  );
  return result.rows;
}

export async function listarNovosProdutos() {
  const result = await pool.query(
    "SELECT * FROM produtos WHERE visivel = true ORDER BY criado_em DESC LIMIT 3",
  );
  return result.rows;
}

// Criação de produtos
export async function criarProduto(data: Partial<Produto>) {
  const query = `
    INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, promocao, tags, is_loja, preco_original, visivel)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
    data.preco_original || null,
    data.visivel ?? true,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Atualização de produtos
export async function atualizarProduto(id: string | number, data: Partial<Produto>) {
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
        preco_original = $9,
        visivel = COALESCE($10, visivel)
    WHERE id = $11
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
    data.preco_original || null,
    data.visivel,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Exclusão de produtos
export async function deletarProduto(id: string | number) {
  const result = await pool.query(
    "DELETE FROM produtos WHERE id = $1 RETURNING *",
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

// Curtidas
export async function curtirProduto(id: string | number) {
  const result = await pool.query(
    "UPDATE produtos SET curtidas = curtidas + 1 WHERE id = $1 RETURNING curtidas",
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].curtidas;
}

export async function descurtirProduto(id: string | number) {
  const result = await pool.query(
    "UPDATE produtos SET curtidas = GREATEST(curtidas - 1, 0) WHERE id = $1 RETURNING curtidas",
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].curtidas;
}
