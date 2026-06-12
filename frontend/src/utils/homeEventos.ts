import type { HomeEventosConfig } from "../types/Configuracao";

/**
 * Conteúdo padrão da seção de eventos da home — usado enquanto o admin
 * não personalizou nada (ou se o JSON salvo estiver corrompido).
 */
export const HOME_EVENTOS_PADRAO: HomeEventosConfig = {
  titulo: "Tem sempre algo fofo rolando",
  subtitulo:
    "Eventos temáticos, performances e festas. Acompanhe o @mewmewnatal pra novidades.",
  cards: [
    {
      dia: "Sex",
      detalhe: "& sáb",
      titulo: "Café das Maids",
      descricao: "Performances, dancinhas e fotos com a equipe.",
      pill: "Toda semana",
      link: "/eventos",
    },
    {
      dia: "Sáb",
      detalhe: "tarde",
      titulo: "Eventos temáticos",
      descricao: "Cosplay, datas especiais e encontros otaku.",
      pill: "Ver agenda",
      link: "/eventos",
    },
    {
      dia: "Todo",
      detalhe: "dia",
      titulo: "Festa de aniversário",
      descricao:
        "Aniversariante ganha sobremesa de cortesia; espaço climatizado p/ 15–30 pessoas.",
      pill: "Reservar",
      link: "/agendar",
    },
    {
      dia: "Dom",
      detalhe: "família",
      titulo: "Domingo em família",
      descricao: "Ambiente lúdico pra todas as idades, das 11h às 19h.",
      pill: "Aberto",
      link: "/eventos",
    },
  ],
  ctaPrimarioTexto: "Ver agenda completa",
  ctaPrimarioLink: "/eventos",
  ctaSecundarioTexto: "Agendar evento",
  ctaSecundarioLink: "/agendar",
};

/**
 * Converte o JSON salvo na configuração `home_eventos` para o objeto
 * tipado, caindo para o conteúdo padrão se ausente ou inválido.
 */
export function parseHomeEventos(valor?: string): HomeEventosConfig {
  if (!valor) return HOME_EVENTOS_PADRAO;
  try {
    const parsed = JSON.parse(valor);
    if (!parsed || !Array.isArray(parsed.cards) || parsed.cards.length === 0) {
      return HOME_EVENTOS_PADRAO;
    }
    return { ...HOME_EVENTOS_PADRAO, ...parsed };
  } catch {
    return HOME_EVENTOS_PADRAO;
  }
}
