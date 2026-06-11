import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { maids } from "../../data/maidsData";
import styles from "./styles.module.css";

/**
 * Showcase das Maids em painéis com corte diagonal (clip-path).
 * As 6 maids ficam lado a lado em fatias sobrepostas; o painel inteiro
 * é um link para a página de detalhes (/maids/:id). No hover o painel
 * expande e a imagem ganha destaque. No mobile, os painéis empilham
 * verticalmente mantendo o corte diagonal.
 */
export function MaidCarousel() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <Heart size={14} /> Conheça a equipe
        </span>
        <h2 className={styles.title}>Nossas Maids ♡</h2>
        <p className={styles.lead}>
          Toque numa maid pra conhecer a história e a magia de cada uma.
        </p>
      </div>

      <div className={styles.strip}>
        {maids.map((maid, index) => (
          <Link
            key={maid.id}
            to={`/maids/${maid.id}`}
            className={styles.panel}
            style={{ "--maid-color": maid.cor } as CSSProperties}
            aria-label={`Conheça a maid ${maid.nome}`}
          >
            <img
              src={maid.imagem}
              alt={maid.nome}
              className={styles.photo}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <span className={styles.overlay} aria-hidden="true" />
            <span className={styles.name}>{maid.nome}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
