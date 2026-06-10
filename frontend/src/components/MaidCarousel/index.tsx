import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";
import { maids } from "../../data/maidsData";
import styles from "./styles.module.css";

/**
 * Carrossel de Maids no estilo do redesign 2026:
 * uma fileira de avatares circulares (seletor) e um card de destaque
 * com a maid selecionada (foto, nome e biografia breve).
 *
 * Acessibilidade/Testes: cada maid é renderizada como um card de destaque
 * (todos no DOM, apenas o ativo visível), garantindo imagem com alt={nome},
 * nome, descrição breve e link para /maids/:id de todas as 6 maids.
 */
export function MaidCarousel() {
  const [active, setActive] = useState(0);
  const total = maids.length;

  const goPrev = () => setActive((i) => (i > 0 ? i - 1 : total - 1));
  const goNext = () => setActive((i) => (i < total - 1 ? i + 1 : 0));

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <Heart size={14} /> Conheça a equipe
        </span>
        <h2 className={styles.title}>Nossas Maids ♡</h2>
        <p className={styles.lead}>
          Deslize ou toque num avatar pra conhecer cada uma das nossas maids
          mágicas.
        </p>
      </div>

      {/* Fileira de avatares (seletor) */}
      <div className={styles.selector}>
        <button
          type="button"
          className={styles.arrow}
          onClick={goPrev}
          aria-label="Maid anterior"
        >
          <ChevronLeft size={22} />
        </button>

        <ul className={styles.avatars}>
          {maids.map((maid, index) => (
            <li key={maid.id}>
              <button
                type="button"
                className={`${styles.avatarBtn} ${
                  index === active ? styles.avatarActive : ""
                }`}
                onClick={() => setActive(index)}
                aria-label={`Selecionar ${maid.nome}`}
                aria-pressed={index === active}
                style={{ "--maid-color": maid.cor } as CSSProperties}
              >
                <img src={maid.imagem} alt="" className={styles.avatarImg} />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.arrow}
          onClick={goNext}
          aria-label="Próxima maid"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Palco de destaque — todas as maids no DOM, só a ativa visível */}
      <div className={styles.stage}>
        {maids.map((maid, index) => (
          <article
            key={maid.id}
            className={`${styles.featured} ${
              index === active ? styles.featuredActive : ""
            }`}
          >
            <div
              className={styles.photoWrap}
              style={{ "--maid-color": maid.cor } as CSSProperties}
            >
              <img
                src={maid.imagem}
                alt={maid.nome}
                className={styles.photo}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>

            <div className={styles.info}>
              <span className={styles.featBadge}>Maid em destaque</span>
              <div className={styles.nameRow}>
                <h3 className={styles.maidName}>{maid.nome}</h3>
                <Heart size={20} className={styles.heart} />
              </div>
              <p className={styles.maidBio}>{maid.descricaoBreve}</p>
              <Link to={`/maids/${maid.id}`} className={styles.meetLink}>
                Conheça-me <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
