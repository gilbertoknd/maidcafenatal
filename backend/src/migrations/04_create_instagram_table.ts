import { Pool } from "pg";

export async function up(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS instagram_posts (
      id SERIAL PRIMARY KEY,
      imagem_url VARCHAR(255) NOT NULL,
      link_url VARCHAR(255) NOT NULL,
      visivel BOOLEAN DEFAULT TRUE,
      ordem INTEGER DEFAULT 0,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function down(pool: Pool) {
  await pool.query(`DROP TABLE IF EXISTS instagram_posts;`);
}
