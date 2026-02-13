import { useEffect, useState } from "react";
import { ProductCard } from "../ProductCard";
import { getPopularProducts } from "../../services/api";
import type { Produto } from "../../types/produto";
import styles from "./styles.module.css";

export function PopularSection() {
  const [products, setProducts] = useState<Produto[]>([]);

  useEffect(() => {
    getPopularProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Pedidos Mais Populares</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  );
}
