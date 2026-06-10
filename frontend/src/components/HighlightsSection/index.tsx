import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Sparkles,
  BookOpenText,
  Cake,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./styles.module.css";

interface Destaque {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  link: string;
  textoLink: string;
}

const destaques: Destaque[] = [
  {
    icone: UtensilsCrossed,
    titulo: "Bentô Japonês",
    descricao:
      "Comidinhas fofas e autênticas, montadas com carinho de verdade.",
    link: "/cardapio",
    textoLink: "Ver cardápio",
  },
  {
    icone: Sparkles,
    titulo: "Café das Maids",
    descricao:
      "Performances, dancinhas e fotos com a equipe toda sexta e sábado.",
    link: "/eventos",
    textoLink: "Ver agenda",
  },
  {
    icone: BookOpenText,
    titulo: "Mangateca",
    descricao:
      "Uma biblioteca de mangás à vontade pra ler enquanto saboreia.",
    link: "/mangas",
    textoLink: "Explorar mangás",
  },
  {
    icone: Cake,
    titulo: "Aniversários",
    descricao:
      "Aniversariante ganha sobremesa de cortesia e um espaço só de vocês.",
    link: "/eventos",
    textoLink: "Reservar",
  },
];

/**
 * Seção de destaques do maid café — grade de 4 cards com os
 * diferenciais da casa (comida, performances, mangás e festas).
 */
export function HighlightsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <Sparkles size={15} /> Nossos destaques
        </span>
        <h2 className={styles.title}>O que torna o Mew Mew mágico</h2>
        <p className={styles.lead}>
          Do salãozinho à mangateca — tudo pensado pra te acolher como mestre.
        </p>
      </div>

      <div className={styles.grid}>
        {destaques.map(({ icone: Icone, titulo, descricao, link, textoLink }) => (
          <article className={styles.card} key={titulo}>
            <div className={styles.iconBox}>
              <Icone size={28} />
            </div>
            <h3 className={styles.cardTitle}>{titulo}</h3>
            <p className={styles.cardText}>{descricao}</p>
            <Link to={link} className={styles.cardLink}>
              {textoLink} <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
