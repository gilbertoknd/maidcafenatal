import { useQuery } from "@tanstack/react-query";
import { buscarProdutos } from "../services/api";
import type { Produto } from "../types/Produto";

/**
 * Hook que verifica se existem produtos visíveis na loja e na seção de mangás.
 * Utilizado pelo Header para ocultar links de navegação quando não há produtos.
 * Reutiliza a mesma queryKey de produtos para aproveitar o cache do TanStack Query.
 */
export function useNavVisibilidade() {
  const { data: produtos = [], isLoading } = useQuery<Produto[]>({
    queryKey: ["produtos", "nav-visibilidade"],
    queryFn: buscarProdutos,
    staleTime: 5 * 60 * 1000, // 5 minutos — dados de navegação não precisam ser real-time
  });

  const temLoja = produtos.some((p) => p.is_loja);
  const temMangas = produtos.some((p) => p.is_manga);

  return { temLoja, temMangas, isLoading };
}
