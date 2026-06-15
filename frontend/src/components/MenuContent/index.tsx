import { useMemo } from "react";
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
  onToggleVisibility?: (id: number) => void;
  title?: string;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
  emptyMessage?: string;
  /** Exibe os cards em destaque (imagem maior, grade mais larga). */
  featured?: boolean;
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
  onToggleVisibility,
  title = "🌸 Cardápio Mew Mew 🌸",
  headerActions,
  children,
  emptyMessage = "Nenhuma delícia encontrada :(",
  featured = false,
}: MenuContentProps) {
  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce(
      (acc, produto) => {
        const cat = produto.categoria || "Outros";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(produto);
        return acc;
      },
      {} as Record<string, Produto[]>,
    );
  }, [filteredProducts]);

  const categoriesToShow = useMemo(
    () => Object.keys(groupedProducts),
    [groupedProducts],
  );

  return (
    <div className={styles.container}>
      {title && (
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
      )}

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
        <div className={styles.menuGroups}>
          {categoriesToShow.length > 0 ? (
            categoriesToShow.map((cat) => (
              <section key={cat} className={styles.categorySection}>
                <h2 className={styles.categorySubtitle}>{cat}</h2>
                <main
                  className={`${styles.grid} ${featured ? styles.gridFeatured : ""}`}
                >
                  {groupedProducts[cat].map((produto) => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      isAdmin={isAdmin || !!onEdit}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleVisibility={onToggleVisibility}
                      featured={featured}
                    />
                  ))}
                </main>
              </section>
            ))
          ) : (
            <p className={styles.loading}>{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
