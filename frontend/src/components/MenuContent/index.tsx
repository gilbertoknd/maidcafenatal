import { ProductCard } from "../ProductCard";
import { Search } from "../Search";
import { CategoryFilter } from "../CategoryFilter";
import styles from "./styles.module.css";
import type { Produto } from "../../types/produto";

interface MenuContentProps {
  loading: boolean;
  categories: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredProducts: Produto[];
  // Admin Props
  onEdit?: (produto: Produto) => void;
  onDelete?: (id: number) => void;
  title?: string;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
}

export function MenuContent({
  loading,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filteredProducts,
  onEdit,
  onDelete,
  title = "🌸 Cardápio Mew Mew 🌸",
  headerActions,
  children,
}: MenuContentProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header} id="cardapio">
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className={styles.title}>{title}</h1>
          {headerActions && (
            <div style={{ position: "absolute", right: 0 }}>
              {headerActions}
            </div>
          )}
        </div>
      </header>

      {children}

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
              <ProductCard
                key={produto.id}
                data={produto}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className={styles.loading}>Nenhuma delícia encontrada :(</p>
          )}
        </main>
      )}
    </div>
  );
}
