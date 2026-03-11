export interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string | null; //Aqui recebemos apenas o nome do arquivo
  promocao: boolean;
  tags?: string; //Opcional para suportar itens sem tags
  isLoja?: boolean;
}
