import { pool } from "../src/config/db.js";

export async function up() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS campanhas_cupom (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          descricao TEXT,
          prefixo VARCHAR(10) NOT NULL,
          tipo_desconto VARCHAR(20) NOT NULL,
          valor_desconto DECIMAL(10,2) NOT NULL,
          limite_total INTEGER,
          ativa BOOLEAN DEFAULT true,
          validade TIMESTAMP,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS cupons (
          id SERIAL PRIMARY KEY,
          campanha_id INTEGER REFERENCES campanhas_cupom(id) ON DELETE CASCADE,
          codigo VARCHAR(20) UNIQUE NOT NULL,
          cliente_nome VARCHAR(100) NOT NULL,
          cliente_whatsapp VARCHAR(20) NOT NULL,
          fingerprint_token VARCHAR(100) NOT NULL,
          ip_cliente VARCHAR(45),
          usado BOOLEAN DEFAULT false,
          usado_em TIMESTAMP,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_whatsapp_campanha UNIQUE (campanha_id, cliente_whatsapp),
          CONSTRAINT unique_fingerprint_campanha UNIQUE (campanha_id, fingerprint_token)
      );
    `);

    // Insert a default campaign "Bem-vindo" if there are no campaigns yet
    const { rows } = await client.query('SELECT COUNT(*) FROM campanhas_cupom');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO campanhas_cupom (nome, descricao, prefixo, tipo_desconto, valor_desconto, ativa)
        VALUES ('Bem-vindo Mew Mew', 'Cupom de 10% de desconto na sua primeira compra!', 'MEW', 'percentual', 10.00, true)
      `);
    }

    await client.query("COMMIT");
    console.log("Migration 06: Created campanhas_cupom and cupons tables");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function down() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    await client.query(`DROP TABLE IF EXISTS cupons CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS campanhas_cupom CASCADE;`);

    await client.query("COMMIT");
    console.log("Migration 06: Dropped cupons and campanhas_cupom tables");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
