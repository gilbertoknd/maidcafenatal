// src/hooks/useAdminProducts.ts
import { useState, useCallback } from "react";
import { useAuth } from "./useAuth"; // Reaproveitando seu hook de auth
import type { Produto } from "../types/produto";

export function useAdminProducts() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  //Pegamos a função de verificar token do seu hook useAuth
  const { verifyTokenExpiration } = useAuth();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  //READ (Buscar)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/produtos`);
      if (res.ok) {
        const data = await res.json();
        setProdutos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // CREATE / UPDATE
  const saveProduct = async (
    formData: FormData,
    isUpdate: boolean,
    id?: number,
  ) => {
    const token = localStorage.getItem("token");
    try {
      let url = `${apiUrl}/api/produtos`;
      let method = "POST";

      if (isUpdate && id) {
        url = `${apiUrl}/api/produtos/${id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      //Verifica segurança
      if (!verifyTokenExpiration(res)) return false;

      if (res.ok) {
        await fetchProducts(); // Recarrega a lista
        return true; // Sucesso
      } else {
        const err = await res.json();
        throw new Error(err.error || "Erro na operação");
      }
    } catch (error: any) {
      alert(error.message || "Erro de conexão");
      return false;
    }
  };

  //DELETE
  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiUrl}/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyTokenExpiration(res)) return false;

      if (res.ok) {
        //Otimização: Remove da lista localmente sem precisar buscar no banco de novo
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        return true;
      } else {
        alert("Erro ao deletar");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    produtos,
    loading,
    fetchProducts,
    saveProduct,
    deleteProduct,
  };
}
