import type { Pool } from "pg";

/**
 * Migration 09: Destaque dos doces no cardápio.
 *
 * O cardápio tem poucos itens, então damos mais destaque a cada um:
 * - Atualiza as fotos dos doces existentes para as novas imagens em PNG
 *   sem fundo (estilo "sticker"), mais bonitas e consistentes.
 * - Cria os doces que ainda não existiam (Cake Pops, Cheesecake Japonês
 *   e Panna Cotta de Caramelo).
 *
 * Idempotente: os UPDATEs casam por nome e os INSERTs só ocorrem quando o
 * item ainda não existe, então rodar de novo não duplica nada.
 */
export async function up(pool: Pool) {
  // --- Atualiza os doces que já existem com as novas fotos sem fundo ---
  await pool.query(`
    UPDATE produtos
       SET imagem_url = '/images/Dango.png',
           descricao = 'Trio de bolinhos de mochi no espeto, levemente adocicados. Fofura em cada mordida!'
     WHERE nome = 'Dango';
  `);

  await pool.query(`
    UPDATE produtos
       SET imagem_url = '/images/Mochi.png',
           descricao = 'Massa de arroz macia e geladinha em sabores variados. Escolha o seu favorito!'
     WHERE nome = 'Mochi';
  `);

  await pool.query(`
    UPDATE produtos
       SET imagem_url = '/images/Cookie.png',
           descricao = 'Cookies caseiros e recheados: Chocolate Chip, Matcha com Chocolate Branco ou Dark Chocolate.'
     WHERE nome = 'Cookies!';
  `);

  // Panna Cat ganha a foto da panna cotta de baunilha em formato de gatinho.
  await pool.query(`
    UPDATE produtos
       SET imagem_url = '/images/Pannacota_Baunilha.png',
           descricao = 'Panna cotta de baunilha em formato de gatinho, com calda de frutas vermelhas. Cremosa e irresistível!'
     WHERE nome = 'Panna Cat';
  `);

  // --- Cria os doces novos (somente se ainda não existirem) ---
  const novos: Array<{
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    imagem_url: string;
  }> = [
    {
      nome: "Cake Pops",
      descricao:
        "Bolinhos no palito cobertos com chocolate colorido e granuladinho. Doçura mágica em formato fofo!",
      preco: 12.9,
      categoria: "Doces e Sobremesas",
      imagem_url: "/images/Cake_pops.png",
    },
    {
      nome: "Cheesecake Japonês",
      descricao:
        "Cheesecake japonês super fofinho e aerado, com calda de morango. Leve como uma nuvem!",
      preco: 18.9,
      categoria: "Doces e Sobremesas",
      imagem_url: "/images/Japanese_Cheesecake.png",
    },
    {
      nome: "Panna Cotta de Caramelo",
      descricao:
        "Panna cotta de caramelo em formato de capivara, fofa demais pra comer (mas você vai querer)!",
      preco: 22.9,
      categoria: "Doces Japoneses",
      imagem_url: "/images/Pannacota_Caramelo.png",
    },
  ];

  for (const p of novos) {
    await pool.query(
      `
      INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, promocao, is_loja, is_manga, visivel)
      SELECT $1, $2, $3, $4, $5, FALSE, FALSE, FALSE, TRUE
      WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = $1);
    `,
      [p.nome, p.descricao, p.preco, p.categoria, p.imagem_url],
    );
  }

  console.log("Migration 09: Doces do cardápio atualizados e novos itens criados.");
}

export async function down(pool: Pool) {
  await pool.query(`
    DELETE FROM produtos
     WHERE nome IN ('Cake Pops', 'Cheesecake Japonês', 'Panna Cotta de Caramelo');
  `);
  console.log("Migration 09: Novos doces removidos.");
}
