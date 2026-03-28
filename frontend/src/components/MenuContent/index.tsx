import { ProdutoCard } from "../ProdutoCard";
import { Search } from "../Search";
import { CategoryFilter } from "../CategoryFilter";
import styles from "./styles.module.css";
import type { Produto } from "../../types/Produto";

interface MenuContentProps {
  loading: boolean;
  categories: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredProducts: Produto[];
  // Admin Props
  isAdmin?: boolean;
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
  isAdmin = false,
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
              <ProdutoCard
                key={produto.id}
                produto={produto}
                isAdmin={isAdmin || !!onEdit}
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
