import { pool } from "../config/db";

//TODO: Product model responsável por interagir com a tabela produtos no banco de dados

//Products
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

//Likes
export async function likeProduct(id: string) {
  const result = await pool.query(
    "UPDATE produtos SET curtidas = curtidas + 1 WHERE id = $1 RETURNING curtidas",
    [id]
  );

  return result.rows[0].curtidas;
}

export async function unlikeProduct(id: string) {
  const result = await pool.query(
    "UPDATE produtos SET curtidas = GREATEST(curtidas - 1, 0) WHERE id = $1 RETURNING curtidas",
    [id]
  );

  return result.rows[0].curtidas;
}
