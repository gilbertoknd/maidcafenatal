--Criando tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,           
    nome VARCHAR(100) NOT NULL,      
    descricao TEXT,                  
    preco DECIMAL(10, 2) NOT NULL,   
    imagem_url VARCHAR(255),         
    categoria VARCHAR(50) NOT NULL,  
    destaque BOOLEAN DEFAULT FALSE,  
    curtidas INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Limpa dados antigos para desenvolvimento
TRUNCATE TABLE produtos RESTART IDENTITY;

--Inserindo dados de teste
INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, destaque) VALUES
--Test
('Logo teste', 'Logo do melhor maid café do Brasil', 9.99, 'Logo', '/images/Jua.jpg', TRUE),
-- Happy Hour
('2 Corn Dogs', 'Promoção de Happy Hour: 2 unidades deliciosas.', 18.90, 'Happy Hour', '/images/2_corn_dogs.webp', FALSE),
('2x1 Soju', 'Dose dupla de Soju.', 15.00, 'Happy Hour', '/images/2x1_soju.webp', FALSE),
('Combo Cósmico', 'Sanduíche força cósmica + batata + refrigerante.', 36.90, 'Happy Hour', '/images/Combo_cosmico.webp', FALSE),
('2x1 Sake', 'Dose dupla de Sake.', 15.00, 'Happy Hour', '/images/2x1_sake.webp', FALSE),
('Sakeirinha em dobro! ダブル (ジ)', 'Sexta-feira da Sakeirinha no Mew-Mew!', 22.90, 'Happy Hour', '/images/Sakeirinha_em_dobro.webp', FALSE),
('Burajiru Cha (Sem Alcool)', 'Refresco especial sem álcool.', 13.90, 'Happy Hour', '/images/Burajiru_Cha.webp', FALSE),

-- Refeições
('Bentô japonês', 'Arroz (shari), salada fresca, fruta e proteína do dia.', 29.90, 'Refeições', '/images/Bento_japones.webp', TRUE),
('Bibimbap', 'Prato tradicional coreano com shari, carne salteada, ovo e legumes.', 24.90, 'Refeições', '/images/Bibimbap.webp', FALSE),
('Corn Dog Coreano', 'Espetinho empanado crocante com queijo e salsicha.', 14.90, 'Refeições', '/images/Corn_dog_coreano.webp', FALSE),
('Chikin Katsu', 'Peito de frango empanado com curry japonês.', 31.90, 'Refeições', '/images/Chikin_katsu.webp', FALSE),
('Batatas Fritas', '300g. Acompanha molho especial da casa.', 19.90, 'Refeições', '/images/Batatas_fritas.webp', FALSE),
('Sobrecoxa agridoce', 'Tiras de sobrecoxa ao molho teriyaki.', 29.90, 'Refeições', '/images/Sobrecoxa_agridoce.webp', FALSE),
('Trio de Baozi', 'Trio de Bao macio no vapor.', 21.90, 'Refeições', '/images/Trio_de_baozi.webp', FALSE),
('Frango Crispy', 'Filezinhos empanados com Yakimeshi.', 29.90, 'Refeições', '/images/Frango_crispy.webp', FALSE),
('Toppoki 떡볶이', 'Bolinhos de arroz em molho picante.', 31.90, 'Refeições', '/images/Toppoki.webp', FALSE),
('Nasu Katsu (Vegano)', 'Fatias de berinjela empanadas.', 29.90, 'Refeições', '/images/Nasu_katsu.webp', FALSE),
('Tonkatsu', 'Peito de porco empanado com curry.', 31.90, 'Refeições', '/images/tonkatsu.webp', FALSE),
('Gyoza 6 unidades', 'Massa leve recheada e grelhada.', 19.90, 'Refeições', '/images/gyoza_6_unidades.webp', FALSE),
('Chicken Teriyaki', 'Cubos de frango ao molho Teriyaki.', 30.90, 'Refeições', '/images/Chicken_teriaki.webp', FALSE),

-- Bebidas e Doces
('Matcha Latte Vanilla', 'Matcha puro com leite e baunilha.', 18.90, 'Bebidas', '/images/Matcha_latte_vanilla.webp', FALSE),
('Chá matchá', 'Chá matcha servido quente.', 7.90, 'Bebidas', '/images/Cha_Matcha.webp', FALSE),
('Mewberry Matcha', 'Matcha com morango e leite.', 19.90, 'Bebidas', '/images/Mawberry_matcha.webp', FALSE),
('Matchá Shake', 'Milkshake de matchá puro.', 21.90, 'Bebidas', '/images/Matcha_shake.webp', FALSE),
('Dango', 'Bolinhos de arroz com calda.', 9.90, 'Doces', '/images/Dango.webp', FALSE),
('Taiyaki', 'Bolinho peixe com chocolate.', 14.90, 'Doces', '/images/Tayiaki.webp', FALSE),
('Mochi', 'Sabores variados.', 9.90, 'Doces', '/images/Mochi.webp', FALSE),
('Dupla de Mochis', 'Dois mochis recheados.', 15.90, 'Doces', '/images/Dupla_de_mochis.webp', FALSE),
('Panna Cat', 'Panna Cotta com morango.', 22.90, 'Doces', '/images/Panna_cat.webp', FALSE),

-- Lanches
('Croissant Pepperoni', 'Pepperoni e cream cheese.', 25.90, 'Lanches', '/images/Pepperoni_com_cream_cheese.webp', FALSE),
('Croissant Peru', 'Peito de peru e queijo.', 25.90, 'Lanches', '/images/Peito_de_peru_com_queijo.webp', FALSE),
('Croissant Pesto', 'Pesto e tomate seco.', 26.90, 'Lanches', '/images/Pesto_de_tomate_seco.webp', FALSE),
('Croque Monsieur', 'Presunto, queijo e bechamel.', 24.90, 'Lanches', '/images/Croque_mounsier.webp', FALSE),
('Estrela Radiante', 'Foccaccini com queijo e pepperoni.', 29.90, 'Lanches', '/images/Estrela_radiante.webp', FALSE),
('Força Cósmica', 'Baguette com filé e salada.', 26.90, 'Lanches', '/images/Forca_cosmica.webp', FALSE),
('Sol da Madrugada', 'Focaccini com pesto.', 29.90, 'Lanches', '/images/Sol_da_madrugada.webp', FALSE),
('Tamago Sando', 'Sanduíche de ovo japonês.', 24.90, 'Lanches', '/images/Tamago_sando.webp', FALSE),
('Magia Krocante', 'Frango frito coreano no pão.', 26.90, 'Lanches', '/images/Magia_crocante.webp', FALSE),
('Croquet Madame', 'Croque monsieur com ovo.', 25.90, 'Lanches', '/images/Croquet_madame.webp', FALSE),

-- Promoções
('Promo Magia + Burajiru', 'Sanduíche + Refresco.', 28.90, 'Promoções', '/images/Magia_crocante_burajiru.webp', TRUE),
('Panetone Pistache', 'Natal Mew Mew.', 49.90, 'Promoções', '/images/Colecao_doce_natal_mew_mew.webp', TRUE),
('J-kit Black Friday', 'Dango + Taiyaki + Mochi.', 35.90, 'Promoções', '/images/J-kit.webp', TRUE),
('2 Milkshakes', 'Promoção especial.', 35.90, 'Promoções', '/images/2_milkshakes_por_3590.webp', TRUE),
('Brownie Delight', 'Brownie com sorvete.', 21.90, 'Promoções', '/images/Bronie_delight.webp', TRUE),
('Combo Tamago', 'Tamago Sando + Batata + Refri.', 36.90, 'Promoções', '/images/Tamago_sando_batatinha_ichigo_cute.webp', TRUE),
('Combo Sol', 'Sol da Madrugada + Batata + Refri.', 36.90, 'Promoções', '/images/Sol_da_madrugada_batatinha_blue_fairy.webp', TRUE),
('Combo Estrela', 'Estrela Radiante + Batata + Refri.', 36.90, 'Promoções', '/images/Estrela_radiante_batatinha_ringo_chan.webp', TRUE),
('2 Chocolate Quente', 'Para dois.', 22.90, 'Promoções', '/images/2_chocolates_quentes.webp', TRUE),
('3 Docinhos', 'Preço Black Friday.', 9.90, 'Promoções', '/images/3_docinhos.webp', TRUE);