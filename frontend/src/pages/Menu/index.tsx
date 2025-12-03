import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../../components/ProductCard";
import styles from "./styles.module.css";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ImageBanner } from "../../components/Banner";
import { Search } from "../../components/Search";
import { CategoryFilter } from "../../components/CategoryFilter";

export function MenuPage() {
  const {
    loading,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
  } = useProducts();

  return (
    <>
      <ImageBanner />
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
