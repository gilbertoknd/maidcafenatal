import { useEffect, useState } from "react";
import { ProdutoCard } from "../ProdutoCard";
import { buscarProdutosPopulares } from "../../services/api";
import type { Produto } from "../../types/Produto";
import styles from "./styles.module.css";

export function PopularSection() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    buscarProdutosPopulares().then(setProdutos).catch(console.error);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Pedidos Mais Populares</h2>
      <div className={styles.grid}>
        {produtos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
