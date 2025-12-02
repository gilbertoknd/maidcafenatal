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

-- 抹茶 - Matcha
('Matcha Latte Vanilla', 'Matcha puro com leite e baunilha.', 18.90, '抹茶 - Matcha', '/images/Matcha_latte_vanilla.webp', FALSE),
('Chá matchá', 'Chá matcha servido quente.', 7.90, '抹茶 - Matcha', '/images/Cha_Matcha.webp', FALSE),
('Mewberry Matcha', 'Matcha com morango e leite.', 19.90, '抹茶 - Matcha', '/images/Mawberry_matcha.webp', FALSE),
('Matchá Shake', 'Milkshake de matchá puro.', 21.90, '抹茶 - Matcha', '/images/Matcha_shake.webp', FALSE),

-- Doces Japoneses
('Dango', 'Bolinhos de arroz com calda.', 9.90, 'Doces Japoneses', '/images/Dango.webp', FALSE),
('Taiyaki', 'Bolinho peixe com chocolate.', 14.90, 'Doces Japoneses', '/images/Tayiaki.webp', FALSE),
('Mochi', 'Sabores variados.', 9.90, 'Doces Japoneses', '/images/Mochi.webp', FALSE),
('Dupla de Mochis', 'Dois mochis recheados.', 15.90, 'Doces Japoneses', '/images/Dupla_de_mochis.webp', FALSE),
('Panna Cat', 'Panna Cotta com morango.', 22.90, 'Doces Japoneses', '/images/Panna_cat.webp', FALSE),

-- Croissants
('Croissant Pepperoni', 'Pepperoni e cream cheese.', 25.90, 'Croissants', '/images/Pepperoni_com_cream_cheese.webp', FALSE),
('Croissant Peru', 'Peito de peru e queijo.', 25.90, 'Croissants', '/images/Peito_de_peru_com_queijo.webp', FALSE),
('Croissant Pesto', 'Pesto e tomate seco.', 26.90, 'Croissants', '/images/Pesto_de_tomate_seco.webp', FALSE),

-- Sanduíches
('Croque Monsieur', 'Presunto, queijo e bechamel.', 24.90, 'Sanduíches', '/images/Croque_mounsier.webp', FALSE),
('Estrela Radiante', 'Foccaccini com queijo e pepperoni.', 29.90, 'Sanduíches', '/images/Estrela_radiante.webp', FALSE),
('Força Cósmica', 'Baguette com filé e salada.', 26.90, 'Sanduíches', '/images/Forca_cosmica.webp', FALSE),
('Sol da Madrugada', 'Focaccini com pesto.', 29.90, 'Sanduíches', '/images/Sol_da_madrugada.webp', FALSE),
('Tamago Sando', 'Sanduíche de ovo japonês.', 24.90, 'Sanduíches', '/images/Tamago_sando.webp', FALSE),
('Magia Krocante', 'Frango frito coreano no pão.', 26.90, 'Sanduíches', '/images/Magia_crocante.webp', FALSE),
('Croquet Madame', 'Croque monsieur com ovo.', 25.90, 'Sanduíches', '/images/Croquet_madame.webp', FALSE),

-- Doces e Sobremesas
('Cookies!', '-Chocolate Chip -Matcha & Chocolate Branco -Dark Chocolate', 8.90, 'Doces e Sobremesas', '/images/Cookies.webp', FALSE),
('Fatia de Torta', 'Fuwa Fuwa – Tortas Geladas Sabores do dia: - Chocolate com Brigadeiro - Ninho com Nutella - Red Velvet!', 19.90, 'Doces e Sobremesas', '/images/Fatia_de_Torta.webp', FALSE),
('Cupcakes', 'Ninho com Mousse de Matcha Chocolate dobrado Geleia de morango com Ninho com Mousse de Frutas vermelhas', 13.90, 'Doces e Sobremesas', '/images/Cupcakes.webp', FALSE),
('Docinhos ブリガデイロ', '-Brigadeiro de Ninho com Nutella -Brigadeiro meio amargo -Brigadeiro de cheesecake com framboesa - Brigadeiro de Pistache - Brigadeiro de matcha com pistache', 4.90, 'Doces e Sobremesas', '/images/Docinhos.webp', FALSE),

-- Salgados
('Empada de Queijo do Reino', 'Massa leve e amanteigada, recheada com o autêntico queijo do reino.', 14.90, 'Salgados', '/images/Empada_de_Queijo_do_Reino.webp', FALSE),
('Empada de Palmito', 'Acompanha molho especial da casa', 12.90, 'Salgados', '/images/Empada_de_Palmito.webp', FALSE),
('Coxinha de Frango com Catupiry', 'O clássico brasileiro com toque extra de cremosidade.', 14.90, 'Salgados', '/images/Coxinha_de_Frango_com_Catupiry.webp', FALSE),
('Coxinha de Carne de Sol com Requeijão', 'Nossa coxinha de carne de sol com requeijão é crocante por fora e cremosa por dentro. Uma delicia com sabor de casa e muito recheio!', 14.90, 'Salgados', '/images/Coxinha_de_Carne_de_Sol_com_Requeijao.webp', FALSE),
('Coxinha de Frango', 'Clássica coxinha de frango.', 13.90, 'Salgados', '/images/Coxinha_de_Frango.webp', FALSE),

-- Cafés
('Caramelo Salgado', 'Nosso campeão de pedidos: café cremoso com caramelo salgado da casa. Equilíbrio entre doçura e intensidade!', 20.90, 'Cafés', '/images/Caramelo_Salgado.webp', FALSE),
('Café com Leite', 'Tradicional, reconfortante e sempre gostoso.', 9.90, 'Cafés', '/images/Cafe_com_Leite.webp', FALSE),
('Chocolate Quente', 'Denso e aconchegante, servido em 100ml. Ideal para aquecer corações.', 14.90, 'Cafés', '/images/Chocolate_Quente.webp', FALSE),
('Cappuccino', 'Cappuccino brasileiro. A mistura perfeita para seu dia!', 12.90, 'Cafés', '/images/Cappuccino.webp', FALSE),
('Choconhaque', 'Chocolate quente com um toque de conhaque. Perfeito para tardes frias e conversas longas.', 19.90, 'Cafés', '/images/Choconhaque.webp', FALSE),
('Chocolate Quente com Amarula', 'Para quem quer algo especial: aveludado, doce e com aquele toque adulto.', 19.90, 'Cafés', '/images/Chocolate_Quente_com_Amarula.webp', FALSE),
('Espresso', 'O essencial com força e alma.', 8.90, 'Cafés', '/images/Espresso.webp', FALSE),
('Americano', 'Mais leve, mais longo. Um café para saborear devagar.', 8.90, 'Cafés', '/images/Americano.webp', FALSE),
('Caramelo Latte', 'A mistura perfeita do caramelo artesanal, leite prensado e café espresso. O melhor dos dois mundos.', 19.90, 'Cafés', '/images/Caramelo_latte.webp', FALSE),
('Paço-chan', 'E bebida que é a cara do mês de junho! Café, leite cremoso, doce de leite e paçoca.', 14.50, 'Cafés', '/images/Paco_chan.webp', FALSE),
('Ovomaltine Frappe', 'Clássico crocante que todo mundo ama: leite geladinho com Ovomaltine, café espresso e cobertura cremosa. Crocância e cremosidade no mesmo gole!', 23.90, 'Cafés', '/images/Ovomaltine_frappe.webp', FALSE),
('Frappé de Óreo', 'Frappé geladinho de Óreo com, café espresso chantilly e crocância irresistível.', 23.90, 'Cafés', '/images/Frappe_de_oreo.webp', FALSE),
('Café BomBom!', 'Camadas de leite condensado, espresso e espuma cremosa de leite, com aquele toque de chocolate por cima.', 14.90, 'Cafés', '/images/Cafe_BomBom.webp', FALSE),
('Cappuccino Italiano', 'Cappucino tradicional sem açucar', 13.90, 'Cafés', '/images/Cappuccino_italiano.webp', FALSE),
('Espresso Duplo', 'Espresso duplo!', 10.90, 'Cafés', '/images/Espresso_duplo.webp', FALSE),
('Coffee Machiatto', 'Café espresso com a creminha do leite', 9.90, 'Cafés', '/images/Coffee_machiatto.webp', FALSE),
('Espresso Panna', 'Um clássico italiano servido em versão especial: espresso encorpado, finalizado com uma nuvem de chantilly macio.', 11.90, 'Cafés', '/images/Espresso_Panna.webp', FALSE),

-- Milkshakes
('Cookie Milkshake!', 'Um shake cremoso e crocante para se deliciar!', 22.90, 'Milkshakes', '/images/Cookie_Milkshake.webp', FALSE),
('Pistachio Milkshake!', 'Uma nuvem de pistache docinho pra te abraçar por dentro!', 23.90, 'Milkshakes', '/images/Pistachio_Milkshake.webp', FALSE),
('Milkshake', 'Docinhos e cheios de amor. Sabores disponíveis: • Doce de leite • Pedacinho do céu • Morango • Chocolate', 20.90, 'Milkshakes', '/images/Milkshake.webp', FALSE),

-- Bebidas Mágicas
('Blue Fairy', 'Soda cintilante feita com xarope de curaçau blue. Refrescância digna de uma garota mágica!', 13.90, 'Bebidas Mágicas', '/images/Blue_Fairy.webp', FALSE),
('Ringo Chan', 'Soda italiana feita com xarope de sabor maçã verde. Ideal para dias quentes!', 13.90, 'Bebidas Mágicas', '/images/Ringo_Chan.webp', FALSE),
('Ichigo Cute', 'Soda italiana feita com xarope de morango. Refrescante e vai bem com qualquer comida!', 13.90, 'Bebidas Mágicas', '/images/Ichigo_Cute.webp', FALSE),
('Burajiru Cha', 'Refresco de chá de maracujá com cidreira, toque de limão, laranja e maçã verde. Leve, aromático e super refrescante, servido gelado e sem álcool.', 15.90, 'Bebidas Mágicas', '/images/Burajiru_Cha.webp', FALSE),

-- Bebidas
('Água Mineral', 'Opções: - Sem gás 6 reais 500 ml - Com gás 6 reais 500 ml (Marcas podem variar)', 6.00, 'Bebidas', '/images/Agua_Mineral.webp', FALSE),
('Refrigerante (lata)', '- Coca-Cola normal - Fanta laranja -Sprite - Coca Zero 350ml', 8.00, 'Bebidas', '/images/Refrigerante_lata.webp', FALSE),
('Suco - 350ml', 'Feito da polpa! Sabores do dia: - Acerola - Uva - Maracujá - Abacaxi', 8.00, 'Bebidas', '/images/Suco_350ml.webp', FALSE),

-- Bebidas Alcoólicas
('Saquê - Dose', 'Tradicional bebida japonesa. Ideal para acompanhar o bentô.', 15.00, 'Bebidas Alcoólicas', '/images/Saque_Dose.webp', FALSE),
('Amarula - Dose', '40ml', 10.00, 'Bebidas Alcoólicas', '/images/Amarula_Dose.webp', FALSE),
('Soju - Bebida Coreana', 'Bebida típica da Coreia. Dose 40ml. Consulte sabores. Teor alcoólico 12,8%', 12.00, 'Bebidas Alcoólicas', '/images/Soju_Bebida_Coreana.webp', FALSE),
('Sakeirinha', 'Sakeirinha refrescante.', 18.90, 'Bebidas Alcoólicas', '/images/Sakeirinha.webp', FALSE),
('Heineken 350ml Longneck', 'Cerveja Heineken.', 10.90, 'Bebidas Alcoólicas', '/images/Heineken_longneck.webp', FALSE),
('Spaten 350ml lata', 'Cerveja Spaten.', 8.90, 'Bebidas Alcoólicas', '/images/Spaten_350ml_lata.webp', FALSE),
('Budweiser 350ml lata', 'Cerveja Budweiser.', 7.90, 'Bebidas Alcoólicas', '/images/Budweiser_350ml_lata.webp', FALSE),

-- Nossa Lojinha
('Abafador de Som', 'Leia seus mangás com tranquilidade! Espuma confortável para seus ouvidos.', 2.00, 'Nossa Lojinha', '/images/Abafador_de_som.webp', FALSE),
('Balinha Coreana', 'Balinha coreana de Yuzu ( azedo)', 3.99, 'Nossa Lojinha', '/images/Balinha_coreana.webp', FALSE),
('Choco-Pie', 'Duas camadas de biscoito macio, Com cobertura de chocolate, e recheio de marshmallow.', 8.00, 'Nossa Lojinha', '/images/Choco-pie.webp', FALSE),
('Mini Refrescos Importados', 'Morango, Abacaxi, Uva + Coco, Refri Uva.', 20.99, 'Nossa Lojinha', '/images/Mini_refrescos_importados.webp', FALSE),
('Geleiazinhas de fruta', 'Saborzinhos frutados e divertidos! Dá pra tomar ou congelar.', 5.00, 'Nossa Lojinha', '/images/Geleiazinhas_de_fruta.webp', FALSE),
('Refrescos J,K,C,T-POP', 'Colecione as latas temáticas da cultura pop! Sabores e estampas rotativas.', 24.99, 'Nossa Lojinha', '/images/Refrescos_j_pop.webp', FALSE),
('Pocky', 'Palitinhos crocantes com cobertura de chocolate ou morango.', 20.90, 'Nossa Lojinha', '/images/Pocky.webp', FALSE),

-- Promoções
('Magia Krokante promo + Burajiru!', 'Um casal perfeito, a crocancia do nosso sanduiche de KFC com a refresco do nossa mais nova sensação, o Burajiru!', 28.90, 'Promoções', '/images/Magia_crocante_burajiru.webp', TRUE),

-- Novidades
('Coleção Doce Natal Mew Mew', 'Panetones artesanais: Pistachio, Chocolate com Caramelo, Chocolate Branco com Geleia, Frutas Cristalizadas.', 0.00, 'Novidades', '/images/Colecao_doce_natal_mew_mew.webp', TRUE),
('Dose de vinho de Arroz ( Sabor UVA)', 'CONTEM ALCOOL', 6.90, 'Novidades', '/images/Dose_de_vinho_de_arroz_sabor_uva.webp', FALSE),
('Vinho de Arroz( sabor Morango)', 'CONTEM ALCOOL', 6.90, 'Novidades', '/images/Vinho_de_arroz_sabor_morango.webp', FALSE),
('Vinho de Arroz( sabor Banana)', 'CONTEM ALCOOL', 6.90, 'Novidades', '/images/Vinho_de_arroz_sabor_banana.webp', FALSE),

-- Encomendas
('Bolos Comemorativos', 'Encomendas para momentos especiais.', 0.00, 'Encomendas', '/images/Bolos_comemorativos.webp', FALSE),

-- Black Friday
('J-kit', 'Inclui: - 1 Dango - 1 Taiyaki - 1 Mochi', 35.90, 'Black Friday', '/images/J-kit.webp', TRUE),
('2 Milkshakes por 35,90', 'Aproveite sabores mágicos por um preço encantado! Promoção por tempo limitado!', 35.90, 'Black Friday', '/images/2_milkshakes_por_3590.webp', TRUE),
('Brownie Delight', 'Brownie de chocolate amargo caseiro com sorvete. Adicionais: Nutella, Doce de Leite.', 21.90, 'Black Friday', '/images/Brownie_delight.webp', TRUE),
('Tamago Sando+ Batatinha + Ichigo Cute!', 'Escolha com carinho... o seu combo!', 36.90, 'Black Friday', '/images/Tamago_sando_batatinha_ichigo_cute.webp', TRUE),
('Sol da Madrugada + Batatinha + Blue Fairy!', 'Escolha com carinho... o seu combo!', 36.90, 'Black Friday', '/images/Sol_da_madrugada_batatinha_blue_fairy.webp', TRUE),
('2 Chocolate Quente', 'Uma tarde quentinha, em dupla', 22.90, 'Black Friday', '/images/2_chocolates_quentes.webp', TRUE),
('Estrela Radiante + Batatinha + Ringo Chan!', 'Escolha com carinho...o seu combo!', 36.90, 'Black Friday', '/images/Estrela_radiante_batatinha_ringo_chan.webp', TRUE),
('2 Cupcakes', 'Ninho com Mousse de Matcha, Chocolate dobrado, Geleia de morango...', 22.90, 'Black Friday', '/images/2_cupcakes.webp', TRUE),
('3 Docinhos ブリガデイロ', '3 vezes dos docinhos classicos da Mew Mew no preço exclusivo!', 9.90, 'Black Friday', '/images/3_docinhos.webp', TRUE);