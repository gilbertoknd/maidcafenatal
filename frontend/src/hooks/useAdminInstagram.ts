import { useState, useCallback } from "react";
//import { useAutenticacao } from "./useAutenticacao";
import type { InstagramPost } from "../types/Instagram";
import {
  buscarInstagramPostsAdmin,
  criarInstagramPost,
  atualizarInstagramPost,
  deletarInstagramPost,
} from "../services/api";

export function useAdminInstagram() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await buscarInstagramPostsAdmin();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao buscar posts do Instagram admin", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const salvarPost = async (formData: FormData, id?: number) => {
    try {
      let post;
      if (id) {
        post = await atualizarInstagramPost(id, formData);
      } else {
        post = await criarInstagramPost(formData);
      }

      await buscarPosts();
      return post;
    } catch (error) {
      console.error("Erro ao salvar post do Instagram", error);
      alert((error as Error).message || "Erro ao salvar post");
      return null;
    }
  };

  const deletarPost = async (id: number) => {
    try {
      await deletarInstagramPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao deletar post do Instagram", error);
      alert("Erro ao deletar post");
      return false;
    }
  };

  const alternarVisibilidade = async (id: number, visivel: boolean) => {
    try {
      const formData = new FormData();
      formData.append("visivel", String(!visivel));
      await atualizarInstagramPost(id, formData);
      await buscarPosts();
      return true;
    } catch (error) {
      console.error("Erro ao alternar visibilidade", error);
      alert("Erro ao alterar visibilidade");
      return false;
    }
  };

  return {
    posts,
    loading,
    buscarPosts,
    salvarPost,
    deletarPost,
    alternarVisibilidade,
  };
}
