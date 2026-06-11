import { Link } from "react-router-dom";
import { Sparkles, Cake, PartyPopper, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./styles.module.css";

interface Passo {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  cta?: boolean;
}

const passos: Passo[] = [
  {
    icone: Sparkles,
    titulo: "A experiência mais mágica...",
    descricao:
      "Maids, doces temáticos e toda a magia de um maid café — agora nos seus eventos e festas!",
  },
  {
    icone: Cake,
    titulo: "Doces e comidas temáticas",
    descricao:
      "Bentôs japoneses, parfaits, doces kawaii e tudo preparado com carinho pelas nossas maids.",
  },
  {
    icone: PartyPopper,
    titulo: "Organize seu evento conosco",
    descricao:
      "Aniversários, formaturas, confraternizações — a gente anima com performances, jogos e muita fofura!",
  },
  {
    icone: ArrowRight,
    titulo: "Faça sua encomenda",
    descricao:
      "Monte seu pedido ou agende seu evento e a gente cuida de tudo! Clique aqui para começar.",
    cta: true,
  },
];

/**
 * Seção "Como funciona" — 4 passos da experiência Mew Mew para
 * eventos, encomendas e delivery. O último passo é um CTA que leva
 * à página de agendamento. Alvo da âncora #como-funciona do Hero.
 */
export function HowItWorksSection() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.head}>
        <span className={styles.eyebrow}>✨ Conheça a experiência</span>
        <h2 className={styles.title}>Como funciona</h2>
        <p className={styles.lead}>A magia do Mew Mew agora vai até você!</p>
      </div>

      <ol className={styles.steps}>
        {passos.map(({ icone: Icone, titulo, descricao, cta }, index) => {
          const conteudo = (
            <>
              <span className={styles.number}>{index + 1}</span>
              <div className={styles.iconBox}>
                <Icone size={26} />
              </div>
              <h3 className={styles.stepTitle}>{titulo}</h3>
              <p className={styles.stepText}>{descricao}</p>
            </>
          );

          return cta ? (
            <li className={styles.ctaItem} key={titulo}>
              <Link
                to="/agendar"
                className={`${styles.step} ${styles.stepCta}`}
              >
                {conteudo}
              </Link>
            </li>
          ) : (
            <li className={styles.step} key={titulo}>
              {conteudo}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
