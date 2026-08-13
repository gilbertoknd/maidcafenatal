/**
 * Dados estáticos dos parceiros do Mew Mew Café.
 * Utilizados pela seção da homepage e pela página /parceiros.
 *
 * As sinopses são baseadas exclusivamente nas informações oficiais
 * divulgadas pelos próprios parceiros (site e perfil do Instagram).
 */

export type TipoLinkParceiro = "site" | "instagram" | "whatsapp";

export interface LinkParceiro {
  tipo: TipoLinkParceiro;
  url: string;
  rotulo: string;
}

export interface Parceiro {
  id: string;
  nome: string;
  descricaoBreve: string;
  /** Caminho da logo em public/parceiros (ex.: "/parceiros/artepsi.png"). */
  logo: string;
  /** Fallback exibido como monograma quando a logo não carrega. */
  iniciais: string;
  /** Cor de destaque do card — pastel da família da paleta. */
  cor: string;
  links: LinkParceiro[];
}

export const parceiros: Parceiro[] = [
  {
    id: "artepsi",
    nome: "ArtePsi",
    descricaoBreve:
      "Psicoterapia para mulheres com abordagem em artepsicoterapia. Atendimento conduzido por Mônica Rodrigues, psicóloga humanista com mestrado em neurociência.",
    logo: "/parceiros/artepsi.jpg",
    iniciais: "AP",
    cor: "#D1C4E9",
    links: [
      {
        tipo: "site",
        url: "https://artepsimonica.com",
        rotulo: "artepsimonica.com",
      },
      {
        tipo: "instagram",
        url: "https://www.instagram.com/artepsinomundo/",
        rotulo: "@artepsinomundo",
      },
    ],
  },
  {
    id: "jjang",
    nome: "Jjang",
    descricaoBreve:
      "Mercado coreano em Natal/RN com produtos importados: ramen, soju, snacks e doces.",
    logo: "/parceiros/jjang.jpg",
    iniciais: "JJ",
    cor: "#F0C4BA",
    links: [
      {
        tipo: "instagram",
        url: "https://www.instagram.com/jjangnatal/",
        rotulo: "@jjangnatal",
      },
      {
        tipo: "whatsapp",
        url: "https://api.whatsapp.com/send/?phone=5584992088194",
        rotulo: "WhatsApp",
      },
    ],
  },
];
