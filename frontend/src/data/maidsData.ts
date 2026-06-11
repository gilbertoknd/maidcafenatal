/**
 * Dados estáticos das Maids do Mew Mew Café.
 * Utilizados pelo carrossel na homepage e pela página de detalhes.
 */

export interface Maid {
  id: string;
  nome: string;
  descricaoBreve: string;
  descricaoCompleta: string;
  imagem: string;
  cor: string;
}

export const maids: Maid[] = [
  {
    id: "sakura",
    nome: "Sakura",
    descricaoBreve: "A flor do café ✿ Especialista em doces e sorrisos!",
    descricaoCompleta:
      "Sakura é a maid mais doce do Mew Mew Café! Com seu sorriso caloroso e amor por confeitaria, ela transforma cada sobremesa numa obra de arte. Sempre decorando os pratos com flores comestíveis, Sakura acredita que a comida deve ser bonita tanto por dentro quanto por fora. Sua especialidade são os parfaits de morango e os lattes com arte floral. Ela adora receber os clientes com um abraço (figurativo!) e garantir que todos se sintam em casa.",
    imagem: "/maids/sakura.jpg",
    cor: "#FFB7C5",
  },
  {
    id: "luna",
    nome: "Luna",
    descricaoBreve: "Misteriosa e elegante ☽ Mestre dos chás e cafés especiais!",
    descricaoCompleta:
      "Luna é a maid mais enigmática do café, conhecida por sua elegância e conhecimento enciclopédico sobre chás e cafés do mundo inteiro. Sob a luz suave do café, ela prepara blends exclusivos que parecem ter poderes mágicos — cada xícara é uma experiência sensorial única. Quando não está preparando bebidas, Luna pode ser encontrada lendo livros antigos no cantinho do café. Dizem que ela conhece os segredos das estrelas!",
    imagem: "/maids/hanna.jpg",
    cor: "#7B9CDB",
  },
  {
    id: "mint",
    nome: "Mint",
    descricaoBreve: "Nyan~ 🐱 A gatinha travessa que anima o ambiente!",
    descricaoCompleta:
      "Mint é pura energia e diversão! Com suas orelhinhas de gato e risada contagiante, ela transforma qualquer dia cinzento numa festa. Mint é a responsável pelos jogos e atividades interativas do café — desde quizzes de anime até competições de karaokê. Sua especialidade no cardápio são os milkshakes coloridos e os onigiri em formato de gatinho. Se você ouvir um 'nyan~' ecoando pelo café, pode ter certeza que a Mint está por perto!",
    imagem: "/maids/nana.jpg",
    cor: "#A8E6CF",
  },
  {
    id: "hana",
    nome: "Hana",
    descricaoBreve: "Raio de sol ☀️ Cada prato servido com amor e alegria!",
    descricaoCompleta:
      "Hana é como um raio de sol que ilumina o Mew Mew Café! Sempre sorridente e cheia de energia positiva, ela faz questão de aprender o nome de cada cliente e lembrar de seus pedidos favoritos. Hana é apaixonada por culinária japonesa e seus pratos sempre vêm com uma decoração especial feita com carinho. Ela também adora contar histórias engraçadas enquanto serve, tornando cada visita uma experiência única e memorável.",
    imagem: "/maids/vitoria.jpg",
    cor: "#FFE57F",
  },
  {
    id: "yuki",
    nome: "Yuki",
    descricaoBreve: "Serena como a neve ❄️ Perfeição em cada detalhe!",
    descricaoCompleta:
      "Yuki é a personificação da elegância serena. Com seus movimentos graciosos e atenção meticulosa aos detalhes, ela eleva o serviço do Mew Mew Café a um nível artístico. Yuki é especialista em latte art — seus desenhos na espuma do café são verdadeiras obras-primas efêmeras. Ela também cuida da decoração sazonal do café, transformando o ambiente a cada estação do ano. Apesar de parecer reservada, Yuki tem um senso de humor sutil que surpreende a todos.",
    imagem: "/maids/yanne.jpg",
    cor: "#B3E5FC",
  },
];

/**
 * Busca uma maid pelo seu ID (slug).
 */
export function buscarMaidPorId(id: string): Maid | undefined {
  return maids.find((m) => m.id === id);
}
