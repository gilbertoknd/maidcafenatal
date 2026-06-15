import type { Produto } from "../types/Produto";

/** Chaves de ordenação disponíveis (espelham o dropdown de filtros). */
export type SortKey =
  | "recommended"
  | "bestsellers"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "most_viewed";

/** Opção exibida no dropdown de ordenação. */
export interface SortOption {
  key: SortKey;
  label: string;
}

/** Lista de opções na mesma ordem da referência (Filters.jpg). */
export const SORT_OPTIONS: SortOption[] = [
  { key: "recommended", label: "Recomendados" },
  { key: "bestsellers", label: "Mais Vendidos" },
  { key: "newest", label: "Mais Recentes" },
  { key: "price_asc", label: "Preço: Menor - Maior" },
  { key: "price_desc", label: "Preço: Maior - Menor" },
  { key: "name_asc", label: "Nome: A-Z" },
  { key: "name_desc", label: "Nome: Z-A" },
  { key: "most_viewed", label: "Mais Vistos" },
];

const toNumber = (valor: string) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Ordena uma lista de produtos de acordo com a chave escolhida.
 * Não muta o array original e mantém a ordem recebida quando "recommended".
 *
 * Observação: o catálogo não possui métricas de vendas/visualizações, então
 * "Mais Vendidos" e "Mais Vistos" usam as curtidas como sinal de popularidade.
 */
export function ordenarProdutos(produtos: Produto[], chave: SortKey): Produto[] {
  if (chave === "recommended") return produtos;

  const copia = [...produtos];

  switch (chave) {
    case "bestsellers":
    case "most_viewed":
      return copia.sort((a, b) => b.curtidas - a.curtidas);
    case "newest":
      return copia.sort((a, b) => b.id - a.id);
    case "price_asc":
      return copia.sort((a, b) => toNumber(a.preco) - toNumber(b.preco));
    case "price_desc":
      return copia.sort((a, b) => toNumber(b.preco) - toNumber(a.preco));
    case "name_asc":
      return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    case "name_desc":
      return copia.sort((a, b) => b.nome.localeCompare(a.nome, "pt-BR"));
    default:
      return copia;
  }
}
