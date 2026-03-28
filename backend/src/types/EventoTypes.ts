export interface Evento {
  id: number;
  titulo: string;
  imagem_url?: string | null;
  descricao: string | null;
  data: string;
  local: string;
  visivel: boolean;
  criado_em: string;
}

export interface EventoFormData {
  titulo: string;
  descricao?: string;
  data: string;
  local: string;
  visivel: boolean;
  criado_em?: string | Date;
}
