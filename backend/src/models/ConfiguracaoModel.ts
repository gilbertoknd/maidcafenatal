import { pool } from "../config/db.js";

export class ConfiguracaoModel {
  // Retorna todas as configurações como um objeto chave-valor
  static async listarConfiguracoes(): Promise<Record<string, string>> {
    const result = await pool.query("SELECT chave, valor FROM configuracoes");
    const configuracoes: Record<string, string> = {};
    for (const row of result.rows) {
      configuracoes[row.chave] = row.valor;
    }
    return configuracoes;
  }

  // Atualiza múltiplas configurações usando transação
  static async atualizarConfiguracoes(
    dados: Record<string, string>,
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const [chave, valor] of Object.entries(dados)) {
        await client.query(
          `INSERT INTO configuracoes (chave, valor)
           VALUES ($1, $2)
           ON CONFLICT (chave) DO UPDATE
           SET valor = EXCLUDED.valor, atualizado_em = CURRENT_TIMESTAMP`,
          [chave, valor],
        );
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Lista todas as fontes customizadas enviadas por upload
  static async listarFontesCustomizadas(): Promise<
    Array<{ id: number; nome: string; arquivo_url: string }>
  > {
    const result = await pool.query(
      "SELECT id, nome, arquivo_url FROM fontes_customizadas ORDER BY nome ASC",
    );
    return result.rows;
  }

  // Cria registro de fonte customizada no banco
  static async criarFonteCustomizada(
    nome: string,
    arquivo_url: string,
  ): Promise<{ id: number; nome: string; arquivo_url: string }> {
    const result = await pool.query(
      "INSERT INTO fontes_customizadas (nome, arquivo_url) VALUES ($1, $2) RETURNING id, nome, arquivo_url",
      [nome, arquivo_url],
    );
    return result.rows[0];
  }

  // Remove fonte customizada e retorna os dados para limpeza do arquivo
  static async deletarFonteCustomizada(
    id: number,
  ): Promise<{ id: number; nome: string; arquivo_url: string } | null> {
    const result = await pool.query(
      "DELETE FROM fontes_customizadas WHERE id = $1 RETURNING id, nome, arquivo_url",
      [id],
    );
    return result.rows[0] || null;
  }
}
