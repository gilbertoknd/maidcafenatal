import { useEffect, useState } from "react";
import { ProductCard } from "../ProductCard";
import { getNewProducts } from "../../services/api";
import type { Produto } from "../../types";
import styles from "./styles.module.css";

export function NewArrivalsSection() {
  const [products, setProducts] = useState<Produto[]>([]);

  useEffect(() => {
    getNewProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Novidades no Cardápio</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  );
}
