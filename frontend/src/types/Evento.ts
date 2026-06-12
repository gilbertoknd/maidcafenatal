export interface Evento {
  id: number;
  titulo: string;
  imagem_url?: string;
  descricao: string | null;
  data: string; // ISO date string
  data_fim?: string | null; // ISO date string
  local: string;
  visivel: boolean;
  criado_em: string;
}

export interface DadosFormEvento {
  titulo: string;
  descricao: string;
  data: string;
  data_fim?: string;
  local: string;
  visivel: boolean;
  imagem?: File | null;
}
