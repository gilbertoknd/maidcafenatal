import type { Produto } from "../types/Produto";

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

export async function sendOrderToBackend(orderData: {
  cliente_nome: string;
  cliente_endereco: string;
  itens: { produto_id: number; quantidade: number }[];
}): Promise<{ message: string; orderId: number; total: number }> {
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar pedido");
  }

  return response.json();
}

export const getOrders = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erro ao buscar pedidos");
  return response.json();
};

export const updateOrderStatus = async (id: number, status: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error("Erro ao atualizar status");
  return response.json();
};
