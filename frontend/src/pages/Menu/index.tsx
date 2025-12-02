import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "../../components/ProductCard";
import { getProducts } from "../../services/api";
import type { Produto } from "../../types";
import styles from "./styles.module.css";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Banner } from "../../components/Banner";
import { Search } from "../../components/Search";
import { CategoryFilter } from "../../components/CategoryFilter";

export function MenuPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

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

  const categories = useMemo(() => {
    const allCategories = produtos.map((p) => p.categoria);
    return ["Todos", ...new Set(allCategories)];
  }, [produtos]);

  const filteredProducts = produtos.filter((produto) => {
    const matchesSearch = produto.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || produto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Banner />
      <Header />
      <div className={styles.container}>
        <header className={styles.header} id="cardapio">
          <h1 className={styles.title}>🌸 Cardápio Mew Mew 🌸</h1>
        </header>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <Search value={searchTerm} onChange={setSearchTerm} />

        {loading ? (
          <p className={styles.loading}>Carregando refeições...</p>
        ) : (
          <main className={styles.grid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((produto) => (
                <ProductCard key={produto.id} data={produto} />
              ))
            ) : (
              <p className={styles.loading}>Nenhuma delícia encontrada :(</p>
            )}
          </main>
        )}
      </div>
      <Footer />
    </>
  );
}
