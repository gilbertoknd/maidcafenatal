import { useState, useEffect, useMemo } from "react";
import { getProducts } from "../services/api";
import type { Produto } from "../types";

export function useProducts() {
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
  };
}
