import { useQuery } from "@tanstack/react-query";
import { buscarConfiguracoes } from "../services/api";
import type { SecaoHomeChave } from "../types/Configuracao";
import { SECOES_HOME_ORDEM } from "../types/Configuracao";

/** Defaults: todas as seções visíveis quando a chave não existe no banco. */
const DEFAULTS: Record<SecaoHomeChave, boolean> = Object.fromEntries(
  SECOES_HOME_ORDEM.map((chave) => [chave, true]),
) as Record<SecaoHomeChave, boolean>;

/**
 * Retorna a visibilidade de cada seção da homepage.
 * Consome o cache do TanStack Query `["configuracoes"]` já populado
 * pelo `useConfiguracoesGlobais` no App.
 */
export function useSecoesHome() {
  const { data, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const secoes: Record<SecaoHomeChave, boolean> = { ...DEFAULTS };

  if (data?.configuracoes) {
    for (const chave of SECOES_HOME_ORDEM) {
      const valor = data.configuracoes[chave];
      if (valor !== undefined) {
        secoes[chave] = valor !== "false";
      }
    }
  }

  return { secoes, isLoading };
}
