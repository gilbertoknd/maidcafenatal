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

/** Chaves de visibilidade das seções da homepage. */
export type SecaoHomeChave =
  | "secao_home_banner"
  | "secao_home_hero"
  | "secao_home_como_funciona"
  | "secao_home_maids"
  | "secao_home_eventos"
  | "secao_home_sobre"
  | "secao_home_instagram"
  | "secao_home_clube_mew";

/** Lista ordenada das seções (ordem de exibição na home). */
export const SECOES_HOME_ORDEM: SecaoHomeChave[] = [
  "secao_home_banner",
  "secao_home_hero",
  "secao_home_como_funciona",
  "secao_home_maids",
  "secao_home_eventos",
  "secao_home_sobre",
  "secao_home_instagram",
  "secao_home_clube_mew",
];

/** Mapa de label amigável para cada seção da home. */
export const SECOES_HOME_LABELS: Record<SecaoHomeChave, string> = {
  secao_home_banner: "Banner (Vídeo/Imagem)",
  secao_home_hero: "Hero (Boas-vindas)",
  secao_home_como_funciona: "Como Funciona",
  secao_home_maids: "Carrossel de Maids",
  secao_home_eventos: "Eventos",
  secao_home_sobre: "Sobre Nós",
  secao_home_instagram: "Instagram",
  secao_home_clube_mew: "Clube Mew",
};

/** Chaves de visibilidade das páginas na navbar. */
export type NavChave =
  | "nav_loja"
  | "nav_mangas"
  | "nav_eventos"
  | "nav_cupons"
  | "nav_agendar";

/** Lista ordenada das páginas da navbar (ordem de exibição). */
export const NAV_PAGINAS_ORDEM: NavChave[] = [
  "nav_loja",
  "nav_mangas",
  "nav_eventos",
  "nav_cupons",
  "nav_agendar",
];

/** Mapa de label amigável para cada página da navbar. */
export const NAV_PAGINAS_LABELS: Record<NavChave, string> = {
  nav_loja: "Loja Online",
  nav_mangas: "Mangás",
  nav_eventos: "Eventos",
  nav_cupons: "Cupons",
  nav_agendar: "Agendar Evento",
};

