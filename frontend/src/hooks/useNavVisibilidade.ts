import { useQuery } from "@tanstack/react-query";
import { buscarProdutos, buscarConfiguracoes } from "../services/api";
import type { Produto } from "../types/Produto";
import type { NavChave } from "../types/Configuracao";

/**
 * Hook que controla a visibilidade dos links da navbar.
 *
 * Para Loja e Mangás: combina verificação de produtos existentes
 * com a configuração do admin (ambas precisam ser verdadeiras).
 *
 * Para Eventos, Cupons e Agendar: apenas verifica a configuração admin.
 *
 * Default: todos visíveis quando a chave não existe no banco.
 */
export function useNavVisibilidade() {
  const { data: produtos = [], isLoading: loadingProdutos } = useQuery<Produto[]>({
    queryKey: ["produtos", "nav-visibilidade"],
    queryFn: buscarProdutos,
    staleTime: 5 * 60 * 1000,
  });

  const { data: configData, isLoading: loadingConfig } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
    staleTime: 5 * 60 * 1000,
  });

  /** Verifica se uma chave de nav está habilitada pelo admin. */
  function isNavHabilitado(chave: NavChave): boolean {
    if (!configData?.configuracoes) return true;
    const valor = configData.configuracoes[chave];
    if (valor === undefined) return true;
    return valor !== "false";
  }

  // Loja e Mangás dependem de haver produtos E do admin habilitar
  const temProdutosLoja = produtos.some((p) => p.is_loja);
  const temProdutosMangas = produtos.some((p) => p.is_manga);

  return {
    loja: temProdutosLoja && isNavHabilitado("nav_loja"),
    mangas: temProdutosMangas && isNavHabilitado("nav_mangas"),
    eventos: isNavHabilitado("nav_eventos"),
    cupons: isNavHabilitado("nav_cupons"),
    agendar: isNavHabilitado("nav_agendar"),
    isLoading: loadingProdutos || loadingConfig,
  };
}
