import { useRef, useState, type MouseEvent } from "react";
import styles from "./styles.module.css";
import { trackEvent } from "../../utils/analytics";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  // 1. Separamos as categorias (removemos "Todos" da lista que rola)
  const scrollableCategories = categories.filter((c) => c !== "Todos");

  // A Ref agora apontará para a área de scroll, não para o container todo
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // --- Lógica de Arrastar (Mantida igual, apenas aplicada no lugar certo) ---
  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Multiplicador de velocidade
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    // Wrapper geral que segura os dois lados
    <div className={styles.wrapper}>
      {/* LADO ESQUERDO: Lista de Categorias (Com Scroll e Drag) */}
      <div
        className={styles.scrollArea}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {scrollableCategories.map((category) => (
          <button
            key={category}
            // Adicionei uma verificação para evitar clique acidental enquanto arrasta
            onClick={() => {
              if (!isDragging) {
                trackEvent("select_content", {
                  content_type: "category_tab",
                  item_id: category,
                });
                onSelectCategory(category);
              }
            }}
            className={`${styles.button} ${
              selectedCategory === category ? styles.active : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* DIVISÓRIA VISUAL */}
      <div className={styles.divider}></div>

      {/* LADO DIREITO: Botão Todos (Fixo) */}
      <div className={styles.fixedArea}>
        <button
          onClick={() => {
            trackEvent("select_content", {
              content_type: "category_tab",
              item_id: "Todos",
            });
            onSelectCategory("Todos");
          }}
          className={`${styles.button} ${styles.todosBtn} ${
            selectedCategory === "Todos" ? styles.active : ""
          }`}
        >
          Todos
        </button>
      </div>
    </div>
  );
}
