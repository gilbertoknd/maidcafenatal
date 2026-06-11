import { Link } from "react-router-dom";
import { Sparkles, BookOpen, ArrowRight } from "lucide-react";
import styles from "./styles.module.css";

/**
 * Seção de boas-vindas (Hero) da Home.
 * Recebe o cliente com a mascote, a chamada principal e os CTAs.
 * Estética "vinho · bege · rosa" do redesign 2026.
 */
export function HeroSection() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.inner}>
        {/* Coluna de texto */}
        <div className={styles.content}>
          <span className={styles.badge}>
            <Sparkles size={16} /> A experiência maid café mais mágica do
            Nordeste
          </span>

          <h1 className={styles.title}>
            Você foi <mark className={styles.highlight}>invocadx</mark> para o
            café dos animes!
          </h1>

          <p className={styles.subtitle}>
            Doces temáticos, comidas japonesas e maids mágicas na sua festa!
            Eventos personalizados, delivery e kit festa com o carinho do Mew
            Mew. Okaeri, mestre! ♡
          </p>

          <div className={styles.actions}>
            <Link to="/cardapio" className={styles.btnPrimary}>
              Ver cardápio <ArrowRight size={18} />
            </Link>
            <a href="#como-funciona" className={styles.btnSecondary}>
              <BookOpen size={18} /> Como funciona
            </a>
          </div>

          <ul className={styles.tags}>
            <li className={styles.tag}>🎂 Aniversários temáticos</li>
            <li className={styles.tag}>🎓 Formaturas &amp; eventos</li>
            <li className={styles.tag}>📦 Delivery &amp; encomendas</li>
          </ul>
        </div>

        {/* Coluna da mascote */}
        <div className={styles.visual}>
          <div className={styles.bubble}>
            Okaeri, mestre! Já escolheu seu mangá? ♡
          </div>

          <div className={styles.mascotCard}>
            <img
              src="/mascot.png"
              alt="Mascote do Mew Mew Café"
              className={styles.mascot}
              loading="eager"
            />
          </div>

          <div className={styles.priceTag}>
            <span className={styles.priceLabel}>Café das maids</span>
            <strong className={styles.priceValue}>R$ 12,90</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
