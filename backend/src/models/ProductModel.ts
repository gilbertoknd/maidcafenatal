import { pool } from "../config/db.js";

//TODO: Product model responsável por interagir com a tabela produtos no banco de dados

//Tipagem
interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string | null; // Aqui recebemos apenas o nome do arquivo
  destaque: boolean;
}

//Products gets
export async function listAllProducts() {
  const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");

  return result.rows;
}

export async function listPopularProducts() {
  const result = await pool.query(
    "SELECT * FROM produtos ORDER BY curtidas DESC LIMIT 6"
  );

  return result.rows;
}

export async function listNewProducts() {
  const result = await pool.query(
    "SELECT * FROM produtos ORDER BY criado_em DESC LIMIT 3"
  );

  return result.rows;
}

//Products posts
export async function createProduct(data: ProductData) {
  const query = `
    INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, destaque)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    data.nome,
    data.descricao,
    data.preco,
    data.categoria,
    data.imagemUrl, // Mapeia para a coluna 'imagem_url' do banco
    data.destaque,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

//Product update
export async function updateProduct(id: string, data: ProductData) {
  const query = `
    UPDATE produtos
    SET nome = $1,
        descricao = $2,
        preco = $3,
        categoria = $4,
        imagem_url = COALESCE($5, imagem_url),
        destaque = $6
    WHERE id = $7
    RETURNING *;
  `;

  const values = [
    data.nome,
    data.descricao,
    data.preco,
    data.categoria,
    data.imagemUrl,
    data.destaque,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

//Product delete
export async function deleteProduct(id: string) {
  const result = await pool.query(
    "DELETE FROM produtos WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0]; //Retorna o produto deletado
}

//Likes
export async function likeProduct(id: string) {
  const result = await pool.query(
    "UPDATE produtos SET curtidas = curtidas + 1 WHERE id = $1 RETURNING curtidas",
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].curtidas;
}

export async function unlikeProduct(id: string) {
  const result = await pool.query(
    "UPDATE produtos SET curtidas = GREATEST(curtidas - 1, 0) WHERE id = $1 RETURNING curtidas",
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].curtidas;
}
