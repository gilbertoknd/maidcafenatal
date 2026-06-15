import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProdutoCard } from "../ProdutoCard";
import { Search } from "../Search";
import { CategoryFilter } from "../CategoryFilter";
import { SortDropdown } from "../SortDropdown";
import { ordenarProdutos, type SortKey } from "../../utils/ordenarProdutos";
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
  /**
   * Variante visual dos cards:
   * - "default": compacto (padrão).
   * - "featured": imagem maior e sem corte (cardápio com poucos itens).
   * - "manga": capa inteira em proporção de pôster.
   */
  variant?: "default" | "featured" | "manga";
  /** Exibe o dropdown de ordenação e o botão de esconder filtros. */
  sortable?: boolean;
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
  variant = "default",
  sortable = false,
}: MenuContentProps) {
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [filtersVisible, setFiltersVisible] = useState(true);

  const sortedProducts = useMemo(
    () => (sortable ? ordenarProdutos(filteredProducts, sortKey) : filteredProducts),
    [filteredProducts, sortKey, sortable],
  );

  const groupedProducts = useMemo(() => {
    return sortedProducts.reduce(
      (acc, produto) => {
        const cat = produto.categoria || "Outros";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(produto);
        return acc;
      },
      {} as Record<string, Produto[]>,
    );
  }, [sortedProducts]);

  const categoriesToShow = useMemo(
    () => Object.keys(groupedProducts),
    [groupedProducts],
  );

  const gridVariantClass =
    variant === "featured"
      ? styles.gridFeatured
      : variant === "manga"
        ? styles.gridManga
        : "";

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

      {sortable && (
        <div className={styles.controlsBar}>
          <button
            type="button"
            className={styles.toggleFiltersBtn}
            onClick={() => setFiltersVisible((v) => !v)}
            aria-pressed={!filtersVisible}
          >
            <SlidersHorizontal size={16} />
            {filtersVisible ? "Esconder filtros" : "Mostrar filtros"}
          </button>
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>
      )}

      {filtersVisible && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      <Search value={searchTerm} onChange={setSearchTerm} />

      {loading ? (
        <p className={styles.loading}>Carregando refeições...</p>
      ) : (
        <div className={styles.menuGroups}>
          {categoriesToShow.length > 0 ? (
            categoriesToShow.map((cat) => (
              <section key={cat} className={styles.categorySection}>
                <h2 className={styles.categorySubtitle}>{cat}</h2>
                <main className={`${styles.grid} ${gridVariantClass}`}>
                  {groupedProducts[cat].map((produto) => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      isAdmin={isAdmin || !!onEdit}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleVisibility={onToggleVisibility}
                      variant={variant}
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
