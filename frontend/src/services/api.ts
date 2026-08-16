import type { Produto } from "../types/Produto";
import type { Evento } from "../types/Evento";
import type { ConfiguracoesFontes, FonteCustomizada } from "../types/Configuracao";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Rotas autenticadas usam o cookie HttpOnly de sessão: o token não fica mais no
// localStorage (imune a XSS). Basta enviar `credentials: "include"` para o
// navegador anexar o cookie automaticamente. Ver GEMINI.md seção 34 (achado #7).

export async function buscarProdutos(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos`);
  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return response.json();
}

export async function buscarProdutosAdmin(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos/admin`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Erro ao buscar catálogo completo");
  }
  return response.json();
}

export async function buscarProdutosPopulares(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos/populares`);
  if (!response.ok) {
    throw new Error("Erro ao buscar produtos populares");
  }
  return response.json();
}

export async function buscarProdutosNovidades(): Promise<Produto[]> {
  const response = await fetch(`${BASE_URL}/api/produtos/novidades`);
  if (!response.ok) {
    throw new Error("Erro ao buscar novidades");
  }
  return response.json();
}

export async function alternarCurtidaProduto(
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

export async function enviarPedido(orderData: {
  cliente_nome: string;
  cliente_endereco: string;
  itens: { produto_id: number; quantidade: number }[];
  codigo_cupom?: string;
}): Promise<{ message: string; pedido_id: number; total: number }> {
  const response = await fetch(`${BASE_URL}/api/pedidos`, {
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

export const buscarPedidos = async () => {
  const response = await fetch(`${BASE_URL}/api/pedidos`, {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao buscar pedidos");
  return response.json();
};

export const atualizarStatusPedido = async (id: number, status: string) => {
  const response = await fetch(`${BASE_URL}/api/pedidos/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error("Erro ao atualizar status");
  return response.json();
};

export async function verificarToken(): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/api/autenticacao/verify`, {
    credentials: "include"
  });
  return response.ok;
}

export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/api/autenticacao/logout`, {
    method: "POST",
    credentials: "include"
  });
}

// --- EVENTOS ---
export async function buscarEventos(): Promise<Evento[]> {
  const response = await fetch(`${BASE_URL}/api/eventos`);
  if (!response.ok) throw new Error("Erro ao buscar eventos");
  return response.json();
}

export async function buscarEventoPorId(id: string | number): Promise<Evento> {
  const response = await fetch(`${BASE_URL}/api/eventos/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar detalhes do evento");
  return response.json();
}

export async function buscarEventosAdmin(): Promise<Evento[]> {
  const response = await fetch(`${BASE_URL}/api/eventos/admin`, {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao buscar eventos no modo admin");
  return response.json();
}

export async function criarEvento(data: FormData): Promise<Evento> {
  const response = await fetch(`${BASE_URL}/api/eventos`, {
    method: "POST",
    credentials: "include",
    body: data
  });
  if (!response.ok) throw new Error("Erro ao criar evento");
  return response.json();
}

export async function atualizarEvento(id: number, data: FormData): Promise<Evento> {
  const response = await fetch(`${BASE_URL}/api/eventos/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data
  });
  if (!response.ok) throw new Error("Erro ao atualizar evento");
  return response.json();
}

export async function deletarEvento(id: number): Promise<{ message: string; evento: Evento }> {
  const response = await fetch(`${BASE_URL}/api/eventos/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao deletar evento");
  return response.json();
}

export async function alterarVisibilidadeEvento(id: number): Promise<Evento> {
  const response = await fetch(`${BASE_URL}/api/eventos/${id}/visibilidade`, {
    method: "PATCH",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao alterar visibilidade do evento");
  return response.json();
}

export async function alterarVisibilidadeProduto(id: number): Promise<Produto> {
  const response = await fetch(`${BASE_URL}/api/produtos/${id}/visibilidade`, {
    method: "PATCH",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao alterar visibilidade do produto");
  return response.json();
}

// --- BANNERS ---
import type { Banner } from "../types/Banner";

export async function buscarBanners(): Promise<Banner[]> {
  const response = await fetch(`${BASE_URL}/api/banners`);
  if (!response.ok) throw new Error("Erro ao buscar banners");
  return response.json();
}

export async function atualizarBanner(pagina: string, data: FormData): Promise<Banner> {
  const response = await fetch(`${BASE_URL}/api/banners/${pagina}`, {
    method: "PUT",
    credentials: "include",
    body: data
  });

  if (!response.ok) throw new Error("Erro ao atualizar banner");
  return response.json();
}

// --- CONFIGURAÇÕES DE FONTES ---
export async function buscarConfiguracoes(): Promise<ConfiguracoesFontes> {
  const response = await fetch(`${BASE_URL}/api/configuracoes`);
  if (!response.ok) throw new Error("Erro ao buscar configurações");
  return response.json();
}

export async function atualizarConfiguracoes(
  dados: Record<string, string>
): Promise<{ message: string; configuracoes: Record<string, string> }> {
  const response = await fetch(`${BASE_URL}/api/configuracoes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dados)
  });

  if (!response.ok) throw new Error("Erro ao atualizar configurações");
  return response.json();
}

export async function uploadFonteCustomizada(data: FormData): Promise<FonteCustomizada> {
  const response = await fetch(`${BASE_URL}/api/configuracoes/fontes`, {
    method: "POST",
    credentials: "include",
    body: data
  });

  if (!response.ok) throw new Error("Erro ao fazer upload da fonte");
  return response.json();
}

export async function deletarFonteCustomizada(id: number): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/api/configuracoes/fontes/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!response.ok) throw new Error("Erro ao deletar fonte");
  return response.json();
}

// --- INSTAGRAM ---
import type { InstagramPost } from "../types/Instagram";

export async function buscarInstagramPosts(): Promise<InstagramPost[]> {
  const response = await fetch(`${BASE_URL}/api/instagram`);
  if (!response.ok) throw new Error("Erro ao buscar posts do Instagram");
  return response.json();
}

export async function buscarInstagramPostsAdmin(): Promise<InstagramPost[]> {
  const response = await fetch(`${BASE_URL}/api/instagram/admin`, {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao buscar posts do Instagram (Admin)");
  return response.json();
}

export async function criarInstagramPost(data: FormData): Promise<InstagramPost> {
  const response = await fetch(`${BASE_URL}/api/instagram`, {
    method: "POST",
    credentials: "include",
    body: data
  });
  if (!response.ok) throw new Error("Erro ao criar post do Instagram");
  return response.json();
}

export async function atualizarInstagramPost(id: number, data: FormData): Promise<InstagramPost> {
  const response = await fetch(`${BASE_URL}/api/instagram/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data
  });
  if (!response.ok) throw new Error("Erro ao atualizar post do Instagram");
  return response.json();
}

export async function deletarInstagramPost(id: number): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/api/instagram/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao deletar post do Instagram");
  return response.json();
}

// --- CUPONS ---
import type { CampanhaCupom, CupomResgatado, CupomValido } from "../types/Cupom";

export async function buscarCampanhasAtivas(): Promise<CampanhaCupom[]> {
  const response = await fetch(`${BASE_URL}/api/cupons/campanhas-ativas`);
  if (!response.ok) throw new Error("Erro ao buscar campanhas de cupons");
  return response.json();
}

export async function resgatarCupom(data: {
  campanha_id: number;
  cliente_nome: string;
  cliente_whatsapp: string;
  fingerprint_token: string;
}): Promise<CupomResgatado> {
  const response = await fetch(`${BASE_URL}/api/cupons/resgatar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Erro ao resgatar cupom");
  }
  return response.json();
}

export async function validarCupom(codigo: string): Promise<CupomValido> {
  const response = await fetch(`${BASE_URL}/api/cupons/validar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Erro ao validar cupom");
  }
  return response.json();
}

// --- CUPONS ADMIN ---
export async function buscarCampanhasAdmin(): Promise<CampanhaCupom[]> {
  const response = await fetch(`${BASE_URL}/api/cupons/admin/campanhas`, {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao buscar campanhas (Admin)");
  return response.json();
}

export async function criarCampanhaAdmin(data: Record<string, unknown>): Promise<CampanhaCupom> {
  const response = await fetch(`${BASE_URL}/api/cupons/admin/campanhas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Erro ao criar campanha");
  return response.json();
}

export async function buscarCuponsAdmin(campanhaId?: number): Promise<CupomResgatado[]> {
  const query = campanhaId ? `?campanha_id=${campanhaId}` : "";
  const response = await fetch(`${BASE_URL}/api/cupons/admin/cupons${query}`, {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Erro ao buscar cupons (Admin)");
  return response.json();
}
