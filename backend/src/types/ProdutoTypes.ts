export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem_url: string | null;
  promocao: boolean;
  tags?: string | null;
  is_loja: boolean;
  preco_original?: number | null;
  visivel: boolean;
  curtidas: number;
  criado_em: string;
}

export type ProdutoFormData = Omit<Produto, "id" | "curtidas" | "criado_em">;
