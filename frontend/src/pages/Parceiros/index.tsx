import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ParceiroCard } from "../../components/ParceiroCard";
import { parceiros } from "../../data/parceirosData";
import styles from "./styles.module.css";

/**
 * Página pública com todos os parceiros do Mew Mew Café.
 * Consome os dados estáticos de data/parceirosData.ts (sem API).
 */
export function ParceirosPage() {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Nossos Parceiros ♡</h1>
          <p>Negócios queridos que caminham junto com o Mew Mew Café.</p>
        </section>

        <section className={styles.content}>
          <div className={styles.grid}>
            {parceiros.map((parceiro) => (
              <ParceiroCard key={parceiro.id} parceiro={parceiro} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
