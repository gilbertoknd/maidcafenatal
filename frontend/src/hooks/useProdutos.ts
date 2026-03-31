import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { buscarProdutos, buscarProdutosAdmin } from "../services/api";
import type { Produto } from "../types/Produto";

export const useProdutos = (type: "menu" | "store" | "admin" = "menu", isAdminScope: boolean = false) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const queryKey = ["produtos", type, isAdminScope];

  const { data: produtos = [], isLoading: loading, refetch: refresh } = useQuery({
    queryKey,
    queryFn: async () => {
      const fetchFn = isAdminScope ? buscarProdutosAdmin : buscarProdutos;
      const data = await fetchFn();
      
      return data.filter((item: Produto) => {
        if (type === "menu") return !item.is_loja;
        if (type === "store") return item.is_loja;
        return true; // admin shows all
      });
    },
  });

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
