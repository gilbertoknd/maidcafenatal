import type { Produto } from "../types/produto";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getProducts(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos`);
  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return response.json();
}

export async function getPopularProducts(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos/populares`);
  if (!response.ok) {
    throw new Error("Erro ao buscar produtos populares");
  }
  return response.json();
}

export async function getNewProducts(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos/novidades`);
  if (!response.ok) {
    throw new Error("Erro ao buscar novidades");
  }
  return response.json();
}

export async function toggleProductLike(
  id: number,
  action: "like" | "unlike",
): Promise<number> {
  const response = await fetch(`${BASE_URL}/api/produtos/${id}/${action}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar like no servidor");
  }

  const data = await response.json();
  return data.novas_curtidas;
}
