import "dotenv/config";
import app from "./app.js";
import { pool } from "./config/db.js";
import { executarMigrations } from "./database/migrator.js";

const PORT = process.env.PORT || 3000;

async function iniciar() {
  // Aplica migrations pendentes no boot. Assim, todo deploy sincroniza o schema
  // automaticamente — sem depender de rodar um comando manual (era a causa do
  // incidente em que a produção ficou com a credencial antiga do admin).
  try {
    await executarMigrations(pool);
  } catch (error) {
    // Uma falha de migration NÃO deve impedir o servidor de subir: logamos e
    // seguimos (o site continua servindo; corrige-se a migration à parte).
    console.error(
      "[boot] falha ao aplicar migrations (o servidor sobe mesmo assim):",
      error,
    );
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

iniciar();
