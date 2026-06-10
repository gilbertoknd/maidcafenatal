import { Link } from "react-router-dom";
import {
  Sparkles,
  PawPrint,
  Leaf,
  Snowflake,
  Users,
  Home as HomeIcon,
  ArrowRight,
} from "lucide-react";
import styles from "./styles.module.css";

const beneficios = [
  { icone: PawPrint, texto: "Pet friendly" },
  { icone: Leaf, texto: "Opções veganas" },
  { icone: Snowflake, texto: "Climatizado" },
  { icone: Users, texto: "Pra todas as idades" },
];

/**
 * Seção "Sobre nós" / Nossa História.
 * Conta a origem do Mew Mew Café com selos de diferenciais e um
 * espaço visual do salão. Estética vinho · bege · rosa do redesign.
 */
export function AboutSection() {
  return (
    <section className={styles.section} id="sobre">
      <div className={styles.card}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} /> Nossa história
          </span>
          <h2 className={styles.title}>Magia japonesa no coração de Natal</h2>
          <p className={styles.text}>
            Inaugurado em 2025, o Mew Mew é o primeiro maid café do Nordeste e a
            primeira cafeteria temática do RN. Inspirado nos cafés de Akihabara,
            aqui as maids são <em>mahō shōjo</em> — cada uma com seu estilo e sua
            “magia” — e cada cliente é tratado como um convidado especial.
            Comida boa de verdade, mangá à vontade e aquele acolhimento que vira
            recordação. Okaeri, mestre! ♡
          </p>

          <ul className={styles.benefits}>
            {beneficios.map(({ icone: Icone, texto }) => (
              <li className={styles.benefit} key={texto}>
                <Icone size={15} /> {texto}
              </li>
            ))}
          </ul>

          <Link to="/eventos" className={styles.cta}>
            Conheça o nosso mundo <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.media} aria-hidden="true">
          <HomeIcon size={56} className={styles.mediaIcon} />
          <span className={styles.mediaCaption}>foto · salão do café</span>
        </div>
      </div>
    </section>
  );
}
