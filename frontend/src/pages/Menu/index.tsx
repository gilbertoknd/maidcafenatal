import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard";
import { getProducts } from "../../services/api";
import type { Produto } from "../../types";
import styles from "./styles.module.css";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export function MenuPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <header className={styles.header} id="cardapio">
          <h1 className={styles.title}>🌸 Cardápio Mew Mew 🌸</h1>
        </header>

        {loading ? (
          <p className={styles.loading}>Carregando refeições...</p>
        ) : (
          <main className={styles.grid}>
            {produtos.map((produto) => (
              <ProductCard key={produto.id} data={produto} />
            ))}
          </main>
        )}
      </div>
      <Footer />
    </>
  );
}
