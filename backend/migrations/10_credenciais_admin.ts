import type { Pool } from "pg";

/**
 * Migration 10: Troca as credenciais do admin.
 *
 * O seed original criava o usuário `admin` com a senha `admin` — credencial
 * padrão, pública no repositório e trivial de adivinhar num painel exposto na
 * internet. Esta migration renomeia o usuário e substitui o hash.
 *
 * O `database/init.sql` só roda na inicialização de um volume novo do Postgres,
 * então bancos já existentes (produção inclusive) NÃO são afetados por ele —
 * é esta migration que atualiza o ambiente que já está no ar.
 *
 * Idempotente: renomeia o `admin` legado se ele existir; se não existir (banco
 * criado pelo init.sql novo), o usuário já nasce correto e nada acontece.
 *
 * A senha em claro não está aqui de propósito — apenas o hash bcrypt (custo 10).
 */

const NICKNAME_ANTIGO = "admin";
const NICKNAME_NOVO = "KrasnowAdm";
const HASH_NOVO = "$2b$10$fGGHGOfXQ/w5VGFG.e431uLrv7sfn.zH6yz6SFfKzgY3SjPDDtXsy";

export async function up(pool: Pool) {
  // Se o novo já existe (init.sql recente), só garante que o hash está atual.
  const { rowCount: jaExiste } = await pool.query(
    "SELECT id FROM users WHERE nickname = $1",
    [NICKNAME_NOVO],
  );

  if (jaExiste && jaExiste > 0) {
    await pool.query("UPDATE users SET senha = $1 WHERE nickname = $2", [
      HASH_NOVO,
      NICKNAME_NOVO,
    ]);
    console.log(
      `Migration 10: Usuário '${NICKNAME_NOVO}' já existia — hash sincronizado.`,
    );

    // Remove o admin legado, se tiver sobrado dos dois lados.
    const { rowCount: removidos } = await pool.query(
      "DELETE FROM users WHERE nickname = $1",
      [NICKNAME_ANTIGO],
    );
    if (removidos && removidos > 0) {
      console.log(`Migration 10: Usuário legado '${NICKNAME_ANTIGO}' removido.`);
    }
    return;
  }

  // Caso normal em produção: renomeia o admin legado e troca a senha.
  const { rowCount: atualizados } = await pool.query(
    "UPDATE users SET nickname = $1, senha = $2 WHERE nickname = $3",
    [NICKNAME_NOVO, HASH_NOVO, NICKNAME_ANTIGO],
  );

  if (atualizados && atualizados > 0) {
    console.log(
      `Migration 10: '${NICKNAME_ANTIGO}' renomeado para '${NICKNAME_NOVO}' e senha trocada.`,
    );
    return;
  }

  // Nenhum dos dois existe — banco sem admin. Cria para não travar o acesso.
  await pool.query("INSERT INTO users (nickname, senha) VALUES ($1, $2)", [
    NICKNAME_NOVO,
    HASH_NOVO,
  ]);
  console.log(`Migration 10: Nenhum admin encontrado — '${NICKNAME_NOVO}' criado.`);
}

export async function down(pool: Pool) {
  // Hash de 'admin', restaurado apenas para reverter em desenvolvimento.
  const HASH_LEGADO =
    "$2b$10$9TthNunqdYip31itYDZXkOPNQ0zPXI5iBj8R.ZvVRLld5HsrDrQVO";

  await pool.query("UPDATE users SET nickname = $1, senha = $2 WHERE nickname = $3", [
    NICKNAME_ANTIGO,
    HASH_LEGADO,
    NICKNAME_NOVO,
  ]);
  console.log(`Migration 10: Revertido para '${NICKNAME_ANTIGO}'.`);
}
