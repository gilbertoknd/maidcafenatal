import { describe, it, expect, vi } from "vitest";
import { executarMigrations } from "../database/migrator.js";

// Lista real das migrations em src/migrations (o migrator lê a pasta de verdade).
const TODAS = [
  "01_create_events_table",
  "02_add_image_to_events",
  "03_create_configuracoes_fontes",
  "04_create_instagram_table",
  "05_add_is_manga_to_produtos",
  "06_create_cupons_tables",
  "07_add_data_fim_to_eventos",
  "08_home_eventos_config",
  "09_destaque_doces_cardapio",
  "10_credenciais_admin",
];

// Mock de pool: registra os SQLs e responde a lista de migrations já aplicadas.
function criarPoolMock(nomesAplicados: string[]) {
  const sqls: string[] = [];
  const query = vi.fn(async (sql: string) => {
    sqls.push(sql);
    if (/SELECT name FROM migrations/i.test(sql)) {
      return { rows: nomesAplicados.map((name) => ({ name })) };
    }
    return { rows: [], rowCount: 0 };
  });
  return { pool: { query } as unknown as import("pg").Pool, sqls, query };
}

describe("executarMigrations", () => {
  it("cria a tabela de controle migrations", async () => {
    const { pool, sqls } = criarPoolMock(TODAS);
    await executarMigrations(pool);
    expect(sqls.some((s) => /CREATE TABLE IF NOT EXISTS migrations/i.test(s))).toBe(true);
  });

  it("reconhece migrations legadas gravadas com .ts e NÃO reaplica nenhuma", async () => {
    // Formato antigo do runner: nome com extensão.
    const legadas = TODAS.map((n) => `${n}.ts`);
    const { pool, sqls } = criarPoolMock(legadas);
    await executarMigrations(pool);
    // Se algo fosse reaplicado, haveria INSERT INTO migrations.
    expect(sqls.some((s) => /INSERT INTO migrations/i.test(s))).toBe(false);
  });

  it("aplica uma migration pendente e a registra pelo nome normalizado (sem extensão)", async () => {
    // 01–09 já aplicadas; só a 10 pende. (Evita rodar 05/06, que usam pool próprio.)
    const aplicadas = TODAS.slice(0, 9);
    const { pool, sqls } = criarPoolMock(aplicadas);
    await executarMigrations(pool);
    const inserts = sqls.filter((s) => /INSERT INTO migrations/i.test(s));
    expect(inserts.length).toBe(1);
  });
});
