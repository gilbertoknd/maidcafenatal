export interface Evento {
  id: number;
  titulo: string;
  imagem_url?: string | null;
  descricao: string | null;
  data: string;
  data_fim?: string | null;
  local: string;
  visivel: boolean;
  criado_em: string;
}

export interface DadosFormEvento {
  titulo: string;
  descricao?: string;
  data: string;
  data_fim?: string | null;
  local: string;
  visivel: boolean;
  criado_em?: string | Date;
}
