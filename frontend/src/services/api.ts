import type { Produto } from "../types";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getProducts(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos`);
  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return response.json();
}

export async function toggleProductLike(
  id: number,
  action: "like" | "unlike"
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
