/// <reference types="node" />
// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Teste TDD para validar os design tokens (variáveis CSS) do index.css.
 * Garante que a paleta de cores 2026 (Parchment · Cardinal · Blush Mochi · Charcoal)
 * esteja corretamente definida.
 */
describe("Design Tokens - Paleta de Cores 2026", () => {
  let cssContent: string;

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, "..", "index.css");
    cssContent = fs.readFileSync(cssPath, "utf-8");
  });

  // ─── Nova Paleta Principal ───
  it("deve ter --color-primary mapeado para Cardinal Red (#A91D22)", () => {
    expect(cssContent).toMatch(/--color-primary:\s*#a91d22/i);
  });

  it("deve ter a variante escura da cor principal (--color-primary-dark)", () => {
    expect(cssContent).toMatch(/--color-primary-dark:\s*#[0-9a-fA-F]{6}/);
  });

  it("deve ter --color-background como Parchment (#F4EBE1)", () => {
    expect(cssContent).toMatch(/--color-background:\s*#f4ebe1/i);
  });

  it("deve ter --color-text como Sacristy Charcoal (#242121)", () => {
    expect(cssContent).toMatch(/--color-text:\s*#242121/i);
  });

  // ─── Cores Base ───
  it("deve ter o Branco Neve (#FFFFFF) como cor branca", () => {
    expect(cssContent).toMatch(/--color-white:\s*#ffffff/i);
  });

  it("deve ter --color-secondary-background derivado da nova paleta", () => {
    expect(cssContent).toMatch(/--color-secondary-background:\s*#[0-9a-fA-F]{6}/i);
  });

  // ─── Blush Mochi (Kawaii Softener) ───
  it("deve ter --color-rose como Blush Mochi (#E8C3BA)", () => {
    expect(cssContent).toMatch(/--color-rose:\s*#e8c3ba/i);
  });

  // ─── Cores Redesign 2026 ───
  it("deve ter --color-wine mapeado para Cardinal Red (#A91D22)", () => {
    expect(cssContent).toMatch(/--color-wine:\s*#a91d22/i);
  });

  it("deve ter --color-cream como Parchment (#F4EBE1)", () => {
    expect(cssContent).toMatch(/--color-cream:\s*#f4ebe1/i);
  });

  it("deve ter --color-ink como Sacristy Charcoal (#242121)", () => {
    expect(cssContent).toMatch(/--color-ink:\s*#242121/i);
  });

  // ─── Cores de Destaque ───
  it("deve ter o Verde Menta (#A8E6CF) como cor de destaque", () => {
    expect(cssContent).toMatch(/--color-accent-mint:\s*#a8e6cf/i);
  });

  it("deve ter o Amarelo Estelar (#FFF3B0) como cor de estrelas/novidades", () => {
    expect(cssContent).toMatch(/--color-star-active:\s*#fff3b0/i);
  });

  // ─── Cor de Apoio ───
  it("deve ter o Lilás Místico (#D1C4E9) como cor de apoio para bordas", () => {
    expect(cssContent).toMatch(/--color-accent-lilac:\s*#d1c4e9/i);
  });

  // ─── Variáveis derivadas devem existir ───
  it("deve ter variáveis de sombra e overlay", () => {
    expect(cssContent).toMatch(/--color-shadow:/);
    expect(cssContent).toMatch(/--color-modal-overlay:/);
    expect(cssContent).toMatch(/--color-overlay-dark:/);
  });

  it("deve ter variáveis de background derivadas", () => {
    expect(cssContent).toMatch(/--color-background:/);
    expect(cssContent).toMatch(/--color-tertiary-background:/);
  });

  it("deve ter variáveis de borda derivadas", () => {
    expect(cssContent).toMatch(/--color-primary-border:/);
    expect(cssContent).toMatch(/--color-secondary-border:/);
    expect(cssContent).toMatch(/--color-border:/);
  });

  // ─── Tipografia ───
  it("deve ter a fonte Sweet Apricot declarada via @font-face local", () => {
    expect(cssContent).toContain("font-family: \"Sweet Apricot\"");
    expect(cssContent).toContain("sweet-apricot.woff2");
  });

  it("deve ter --font-title usando Sweet Apricot (apenas para títulos)", () => {
    expect(cssContent).toMatch(/--font-title:\s*["']Sweet Apricot["']/);
  });

  it("deve ter --font-main usando Inter como fonte do corpo/geral", () => {
    expect(cssContent).toMatch(/--font-main:\s*["']Inter["']|Inter/);
  });

  it("NÃO deve usar Sweet Apricot como a fonte global do :root", () => {
    // A fonte global (font-family no :root) deve ser --font-main (Inter), não Sweet Apricot diretamente
    const rootBlockMatch = cssContent.match(/:root\s*\{[\s\S]*?\n\}/);
    expect(rootBlockMatch).toBeTruthy();
    const rootBlock = rootBlockMatch![0];
    // Deve conter font-family: var(--font-general) ou similar que não seja Sweet Apricot diretamente
    expect(rootBlock).toContain("font-family: var(--font-general)");
  });
});
