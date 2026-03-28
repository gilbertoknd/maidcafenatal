// src/hooks/useAdminProdutos.ts
import { useState, useCallback } from "react";
import { useAutenticacao } from "./useAutenticacao";
import type { Produto } from "../types/Produto";
import { buscarProdutosAdmin, alterarVisibilidadeProduto } from "../services/api";

export function useAdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  const { verifyTokenExpiration } = useAutenticacao();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // READ (Buscar Admin - inclui ocultos)
  const buscarProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await buscarProdutosAdmin();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos admin", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE / UPDATE
  const salvarProduto = async (
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

      if (!verifyTokenExpiration(res)) return false;

      if (res.ok) {
        await buscarProdutos();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.error || "Erro na operação");
      }
    } catch (error) {
      alert((error as Error).message || "Erro de conexão");
      return false;
    }
  };

  // DELETE
  const deletarProduto = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiUrl}/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyTokenExpiration(res)) return false;

      if (res.ok) {
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

  const alternarVisibilidade = async (id: number) => {
    try {
      const data = await alterarVisibilidadeProduto(id);
      if (data) {
        await buscarProdutos();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar visibilidade");
      return false;
    }
  };

  return {
    produtos,
    loading,
    buscarProdutos,
    salvarProduto,
    deletarProduto,
    alternarVisibilidade,
  };
}
