import { Link } from "react-router-dom";
import { Handshake, ArrowRight } from "lucide-react";
import { parceiros } from "../../data/parceirosData";
import { ParceiroCard } from "../ParceiroCard";
import styles from "./styles.module.css";

/**
 * Seção de parceiros da homepage — negócios amigos do Mew Mew Café.
 * Dados estáticos (data/parceirosData.ts), sem chamada à API.
 * A visibilidade é controlada por `secao_home_parceiros` no admin.
 */
export function ParceirosSection() {
  return (
    <section className={styles.section} id="parceiros">
      <div className={styles.container}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>
            <Handshake size={15} /> Quem caminha com a gente
          </span>
          <h2 className={styles.title}>Nossos Parceiros ♡</h2>
          <p className={styles.subtitle}>
            Negócios queridos que fazem parte da magia Mew Mew.
          </p>
        </header>

        <div className={styles.grid}>
          {parceiros.map((parceiro) => (
            <ParceiroCard key={parceiro.id} parceiro={parceiro} />
          ))}
        </div>

        <div className={styles.acoes}>
          <Link
            to="/parceiros"
            className={styles.cta}
            aria-label="Ver todos os parceiros do Mew Mew Café"
          >
            Ver todos <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
