import type { Pool } from "pg";

export async function up(pool: Pool) {
  // Tabela de fontes customizadas (upload .woff2)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fontes_customizadas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) UNIQUE NOT NULL,
      arquivo_url VARCHAR(255) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela de configurações chave-valor
  await pool.query(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      chave VARCHAR(100) PRIMARY KEY,
      valor VARCHAR(255) NOT NULL,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed das configurações padrão de fontes
  await pool.query(`
    INSERT INTO configuracoes (chave, valor) VALUES
      ('fonte_titulo_site', 'Sweet Apricot'),
      ('fonte_navbar', 'Sweet Apricot'),
      ('fonte_categorias', 'Sweet Apricot'),
      ('fonte_titulos_itens', 'Inter'),
      ('fonte_descricoes', 'Inter'),
      ('fonte_botoes', 'Inter'),
      ('fonte_geral', 'Inter')
    ON CONFLICT (chave) DO NOTHING;
  `);
}
