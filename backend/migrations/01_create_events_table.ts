import { Pool } from "pg";

export async function up(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS eventos (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(100) NOT NULL,
      descricao TEXT,
      data TIMESTAMP NOT NULL,
      local VARCHAR(255) NOT NULL,
      visivel BOOLEAN DEFAULT TRUE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function down(pool: Pool) {
  await pool.query(`DROP TABLE IF EXISTS eventos;`);
}
