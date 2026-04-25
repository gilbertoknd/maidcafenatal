import styles from "./styles.module.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Link } from "react-router-dom";
import { Banner } from "../../components/Banner";
import { PopularSection } from "../../components/PopularSection";
import { NewArrivalsSection } from "../../components/NewArrivalsSection";
import { AboutSection } from "../../components/AboutSection";
import { MaidCarousel } from "../../components/MaidCarousel";

export function Home() {
  return (
    <>
      <Banner pagina="home" />
      <Header />
      <main className={styles.container} id="inicio">
        <div className={styles.hero}>
          <h1 className={styles.title}>Bem-vindo ao Mew Mew Café</h1>
          <p className={styles.subtitle}>A experiência mais mágica da cidade ✨️💖</p>
          <Link to="/cardapio" className={styles.button}>
            Ver Cardápio
          </Link>
        </div>

        <MaidCarousel />
        <PopularSection />
        <NewArrivalsSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
