import { useEffect, useState } from "react";
import { ProdutoCard } from "../ProdutoCard";
import { getProdutosNovidades } from "../../services/api";
import type { Produto } from "../../types/Produto";
import styles from "./styles.module.css";

export function NewArrivalsSection() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    getProdutosNovidades().then(setProdutos).catch(console.error);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Novidades no Cardápio</h2>
      <div className={styles.grid}>
        {produtos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
