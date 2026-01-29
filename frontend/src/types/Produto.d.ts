export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: string; //Postgres pode retornar decimal como string
  imagem_url: string;
  categoria: string;
  destaque: boolean;
  curtidas: number;
}
