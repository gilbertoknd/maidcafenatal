import styles from "./styles.module.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Link } from "react-router-dom";
import { VideoBanner } from "../../components/Banner";
import { PopularSection } from "../../components/PopularSection/PopularSection";
import { NewArrivalsSection } from "../../components/NewArrivalsSection/NewArrivalsSection";
import { AboutSection } from "../../components/AboutSection/AboutSection";

export function Home() {
  return (
    <>
      <VideoBanner />
      <Header />
      <main className={styles.container} id="inicio">
        <div className={styles.hero}>
          <h1 className={styles.title}>Bem-vindo ao Mew Mew Café</h1>
          <p className={styles.subtitle}>O lugar mais mágico da cidade ✨️💖</p>
          <Link to="/cardapio" className={styles.button}>
            Ver Cardápio
          </Link>
        </div>

        <PopularSection />
        <NewArrivalsSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
