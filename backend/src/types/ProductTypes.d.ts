export interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string | null; // Aqui recebemos apenas o nome do arquivo
  destaque: boolean;
}
