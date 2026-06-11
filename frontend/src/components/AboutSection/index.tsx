import { Link } from "react-router-dom";
import { Sparkles, Home as HomeIcon, ArrowRight } from "lucide-react";
import styles from "./styles.module.css";

const beneficios = [
  "🎉 Eventos personalizados",
  "🍰 Doces temáticos",
  "🚚 Delivery em Natal",
  "👥 Pra todas as idades",
];

/**
 * Seção "Sobre nós" / Nossa História.
 * Conta a origem do Mew Mew Café com selos de diferenciais e um
 * espaço visual. Estética vinho · bege · rosa do redesign.
 */
export function AboutSection() {
  return (
    <section className={styles.section} id="sobre">
      <div className={styles.card}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} /> Nossa história
          </span>
          <h2 className={styles.title}>Magia japonesa na sua festa</h2>
          <p className={styles.text}>
            Criado em 2025, o Mew Mew traz a experiência mágica dos maid cafés
            de Akihabara para seus eventos e festas. Nossas maids são{" "}
            <em>mahō shōjo</em> — cada uma com seu estilo e sua “magia” — e cada
            cliente é tratado como um convidado especial. Doces temáticos,
            decoração kawaii e aquele acolhimento que vira recordação. Okaeri,
            mestre! ♡
          </p>

          <ul className={styles.benefits}>
            {beneficios.map((texto) => (
              <li className={styles.benefit} key={texto}>
                {texto}
              </li>
            ))}
          </ul>

          <Link to="/agendar" className={styles.cta}>
            Agende seu evento <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.media} aria-hidden="true">
          <HomeIcon size={56} className={styles.mediaIcon} />
          <span className={styles.mediaCaption}>foto · festas Mew Mew</span>
        </div>
      </div>
    </section>
  );
}
