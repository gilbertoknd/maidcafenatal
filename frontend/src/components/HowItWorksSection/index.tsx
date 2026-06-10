import { DoorOpen, ScrollText, Sparkles, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./styles.module.css";

interface Passo {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
}

const passos: Passo[] = [
  {
    icone: DoorOpen,
    titulo: "Okaeri!",
    descricao: "A maid te recebe como mestre e mostra o cantinho perfeito.",
  },
  {
    icone: ScrollText,
    titulo: "Peça à la carte",
    descricao: "Monte seu pedido e pegue um mangá pra ler enquanto espera.",
  },
  {
    icone: Sparkles,
    titulo: "Moe moe kyun",
    descricao: "A magia é servida junto: o docinho vem com um feitiço de amor.",
  },
  {
    icone: Camera,
    titulo: "Foto & lembrança",
    descricao: "Leve uma foto fofa com a equipe e volte sempre, mestre! ♡",
  },
];

/**
 * Seção "Como funciona um maid café" — 4 passos da experiência.
 * Alvo da âncora #como-funciona do botão secundário do Hero.
 */
export function HowItWorksSection() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <Sparkles size={15} /> É sua primeira vez?
        </span>
        <h2 className={styles.title}>Como funciona um maid café</h2>
        <p className={styles.lead}>
          Não precisa saber nada — a gente te guia, mestre. É fácil e mágico.
        </p>
      </div>

      <ol className={styles.steps}>
        {passos.map(({ icone: Icone, titulo, descricao }, index) => (
          <li className={styles.step} key={titulo}>
            <span className={styles.number}>{index + 1}</span>
            <div className={styles.iconBox}>
              <Icone size={26} />
            </div>
            <h3 className={styles.stepTitle}>{titulo}</h3>
            <p className={styles.stepText}>{descricao}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
