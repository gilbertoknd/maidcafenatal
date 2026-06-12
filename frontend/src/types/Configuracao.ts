export interface FonteCustomizada {
  id: number;
  nome: string;
  arquivo_url: string;
}

export interface ConfiguracoesFontes {
  configuracoes: Record<string, string>;
  fontes_customizadas: FonteCustomizada[];
}

/** Card da agenda fixa exibida na seção de eventos da home. */
export interface HomeEventoCard {
  dia: string;
  detalhe: string;
  titulo: string;
  descricao: string;
  pill: string;
  link: string;
}

/** Conteúdo editável da seção "Tem sempre algo fofo rolando" da home. */
export interface HomeEventosConfig {
  titulo: string;
  subtitulo: string;
  cards: HomeEventoCard[];
  ctaPrimarioTexto: string;
  ctaPrimarioLink: string;
  ctaSecundarioTexto: string;
  ctaSecundarioLink: string;
}
