export interface CampanhaCupom {
  id: number;
  nome: string;
  descricao: string;
  tipo_desconto: "percentual" | "fixo";
  valor_desconto: string;
  limite_total: number | null;
  qtd_cupons: string;
  prefixo: string;
  ativa: boolean;
  validade: string | null;
  criado_em: string;
}

export interface CupomResgatado {
  id: number;
  campanha_id: number;
  codigo: string;
  cliente_nome: string;
  cliente_whatsapp: string;
  fingerprint_token: string;
  usado: boolean;
  usado_em: string | null;
  criado_em: string;
}

export interface CupomValido {
  codigo: string;
  usado: boolean;
  ativa: boolean;
  validade: string | null;
  tipo_desconto: "percentual" | "fixo";
  valor_desconto: string;
}
