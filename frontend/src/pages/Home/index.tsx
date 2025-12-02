import styles from "./styles.module.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Bem-vindo ao Mew Mew Café</h1>
        <p className={styles.subtitle}>
          O lugar mais fofo e delicioso da cidade.
        </p>
        <Link to="/cardapio" className={styles.button}>
          Ver Cardápio
        </Link>
      </main>
      <Footer />
    </>
  );
}
