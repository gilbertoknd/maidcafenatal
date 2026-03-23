export interface EventData {
  id?: number;
  titulo: string;
  descricao?: string;
  data: string | Date;
  local: string;
  imagemUrl?: string | null;
  visivel?: boolean;
  criado_em?: string | Date;
}
