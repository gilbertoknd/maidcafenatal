import { useState, useEffect, useMemo, useCallback } from "react";
import { getProducts } from "../services/api";
import type { Produto } from "../types/Produto";

export function useProducts(type: "menu" | "store" | "admin" = "menu") {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const refresh = useCallback(() => {
    setLoading(true);
    getProducts()
      .then((data: Produto[]) => {
        const filteredData = data.filter((item) => {
          if (type === "menu") return !item.is_loja;
          if (type === "store") return item.is_loja;
          return true; // admin shows all
        });
        setProdutos(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const categories = useMemo(() => {
    const allCategories = produtos.map((p) => p.categoria);
    return ["Todos", ...new Set(allCategories)];
  }, [produtos]);

  const filteredProducts = useMemo(() => {
    return produtos.filter((produto) => {
      const matchesSearch = produto.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || produto.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [produtos, searchTerm, selectedCategory]);

  return {
    produtos,
    loading,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    refresh,
  };
}
