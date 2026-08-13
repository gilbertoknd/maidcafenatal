/// <reference types="node" />
// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Teste de CONTRATO entre frontend e backend para as chaves de `configuracoes`.
 *
 * Por que ele existe:
 * `backend/src/controllers/ConfiguracaoController.ts` mantém um whitelist
 * `CHAVES_VALIDAS`. O `PUT /api/configuracoes` filtra por ele e responde 400
 * se sobrar zero chave válida. Como `AdminNavbar` e `AdminSecoesHome` enviam
 * UMA chave por vez, uma chave nova declarada só no frontend vira "Erro ao
 * salvar" em produção — e nenhum teste de frontend acusa, porque nenhum deles
 * chega no backend.
 *
 * Backend e frontend são pacotes separados, sem código compartilhado, então a
 * duplicação de `CHAVES_VALIDAS` não tem como ser eliminada sem tooling novo.
 * O que dá para eliminar é o *silêncio*: este teste lê os dois arquivos e falha
 * imediatamente se eles divergirem.
 *
 * Mesmo padrão de `design-tokens.test.ts`, que lê o `index.css` via fs.
 */

const RAIZ = path.resolve(__dirname, "..", "..", "..");
const CAMINHO_FRONT = path.resolve(__dirname, "..", "types", "Configuracao.ts");
const CAMINHO_BACK = path.join(
  RAIZ,
  "backend",
  "src",
  "controllers",
  "ConfiguracaoController.ts",
);

/** Extrai as strings entre aspas de um array literal nomeado. */
function extrairArray(fonte: string, nomeArray: string): string[] {
  const bloco = fonte.match(
    new RegExp(`${nomeArray}[^=]*=\\s*\\[([\\s\\S]*?)\\]`, "m"),
  );
  if (!bloco) return [];
  return [...bloco[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("Contrato de chaves de configuração (frontend × backend)", () => {
  let chavesFrontend: string[];
  let chavesBackend: string[];

  beforeAll(() => {
    const front = fs.readFileSync(CAMINHO_FRONT, "utf-8");
    const back = fs.readFileSync(CAMINHO_BACK, "utf-8");

    chavesFrontend = [
      ...extrairArray(front, "SECOES_HOME_ORDEM"),
      ...extrairArray(front, "NAV_PAGINAS_ORDEM"),
    ];
    chavesBackend = extrairArray(back, "CHAVES_VALIDAS");
  });

  // ─── Guardas do próprio parser ───
  // Sem isto, um regex que deixasse de casar devolveria [] e todos os testes
  // abaixo passariam vacuamente — exatamente o silêncio que queremos matar.
  it("deve conseguir extrair as chaves do frontend", () => {
    expect(chavesFrontend.length).toBeGreaterThanOrEqual(10);
    expect(chavesFrontend).toContain("secao_home_hero");
    expect(chavesFrontend).toContain("nav_loja");
  });

  it("deve conseguir extrair o CHAVES_VALIDAS do backend", () => {
    expect(chavesBackend.length).toBeGreaterThanOrEqual(10);
    expect(chavesBackend).toContain("fonte_navbar");
    expect(chavesBackend).toContain("home_eventos");
  });

  // ─── O contrato ───
  it("toda chave declarada no frontend deve estar no whitelist do backend", () => {
    const faltando = chavesFrontend.filter((c) => !chavesBackend.includes(c));

    expect(
      faltando,
      `Chave(s) declaradas em frontend/src/types/Configuracao.ts mas ausentes ` +
        `do array CHAVES_VALIDAS em backend/src/controllers/ConfiguracaoController.ts: ` +
        `${faltando.join(", ")}. O PUT /api/configuracoes vai responder 400 e o ` +
        `painel admin vai mostrar "Erro ao salvar".`,
    ).toEqual([]);
  });

  it("não deve haver chave secao_home_*/nav_* órfã no backend", () => {
    const orfas = chavesBackend.filter(
      (c) =>
        (c.startsWith("secao_home_") || c.startsWith("nav_")) &&
        !chavesFrontend.includes(c),
    );

    expect(
      orfas,
      `Chave(s) no CHAVES_VALIDAS do backend sem declaração correspondente no ` +
        `frontend: ${orfas.join(", ")}. Provavelmente sobra de uma seção/link ` +
        `removido — limpe o whitelist.`,
    ).toEqual([]);
  });
});
