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

    // Inserir Admin padrão novamente (opcional, mas recomendado para não perder acesso)
    console.log("👤 Restaurando usuário admin padrão...");
    await client.query(`
      INSERT INTO users (nickname, senha) 
      VALUES ('admin', '$2b$10$9TthNunqdYip31itYDZXkOPNQ0zPXI5iBj8R.ZvVRLld5HsrDrQVO')
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
