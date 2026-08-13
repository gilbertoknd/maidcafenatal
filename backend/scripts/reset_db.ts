import { pool } from "../src/config/db.js";

async function resetDb() {
  console.log("Iniciando reset do banco de dados...");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lista de tabelas para limpar
    const tables = ["itens_pedido", "pedidos", "produtos", "eventos", "users"];

    for (const table of tables) {
      console.log(`🧹 Limpando tabela: ${table}`);
      await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    // Recria o admin para não perder o acesso ao painel após o TRUNCATE.
    // Precisa espelhar o hash de database/init.sql e da migration 10 — senão
    // um `pnpm db:reset` reintroduz a credencial antiga em silêncio.
    console.log("👤 Restaurando usuário admin...");
    await client.query(`
      INSERT INTO users (nickname, senha)
      VALUES ('KrasnowAdm', '$2b$10$fGGHGOfXQ/w5VGFG.e431uLrv7sfn.zH6yz6SFfKzgY3SjPDDtXsy')
      ON CONFLICT (nickname) DO NOTHING
    `);

    await client.query("COMMIT");
    console.log("✅ Banco de dados resetado com sucesso!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Erro ao resetar banco de dados:", error);
  } finally {
    client.release();
    process.exit(0);
  }
}

resetDb();
