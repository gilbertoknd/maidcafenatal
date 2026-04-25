import styles from "./styles.module.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
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
        <MaidCarousel />
        <PopularSection />
        <NewArrivalsSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
