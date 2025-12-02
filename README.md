# maidcafenatal

![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white) 
© 2025 Mew Mew Maid Café. Todos os direitos reservados.

## 📝 Description

maidcafenatal is a web application built with Express.js and TypeScript, designed to provide a delightful user experience. The application incorporates a robust database for efficient data management, comprehensive testing to ensure reliability, and a well-structured web interface. This project leverages the benefits of TypeScript for type safety and maintainability, while Express.js provides a solid foundation for building a scalable and performant web application. maidcafenatal aims to deliver a seamless and engaging experience through its carefully designed features and technologies.

## ✨ Features

- 🗄️ Database
- 🧪 Testing
- 🕸️ Web


## 🛠️ Tech Stack

- 🚀 Express.js
- 📜 TypeScript


## 📦 Key Dependencies

```
cors: ^2.8.5
dotenv: ^17.2.3
express: ^5.1.0
pg: ^8.16.3
```

## 🚀 Run Commands

- **dev**: `npm run dev`
- **build**: `npm run build`
- **start**: `npm run start`
- **test**: `npm run test`
- **test:ci**: `npm run test:ci`


## 📁 Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── public
│   │   └── images
│   │       ├── 2_chocolates_quentes.webp
│   │       ├── 2_corn_dogs.webp
│   │       ├── 2_cupcakes.webp
│   │       ├── 2_milkshakes_por_3590.webp
│   │       ├── 2x1_sake.webp
│   │       ├── 2x1_soju.webp
│   │       ├── 3_docinhos.webp
│   │       ├── Abafador_de_som.webp
│   │       ├── Agua_mineral.webp
│   │       ├── Amarula_dose.webp
│   │       ├── Americano.webp
│   │       ├── Balinha_coreana.webp
│   │       ├── Batatas_fritas.webp
│   │       ├── Bento_japones.webp
│   │       ├── Bibimbap.webp
│   │       ├── Blue_fairy.webp
│   │       ├── Bolos_comemorativos.webp
│   │       ├── Brownie_delight.webp
│   │       ├── Budweiser_350ml_lata.webp
│   │       ├── Burajiru.webp
│   │       ├── Burajiru_Cha.webp
│   │       ├── Cafe_bombom.webp
│   │       ├── Cafe_com_leite.webp
│   │       ├── Cappuccino.webp
│   │       ├── Cappuccino_italiano.webp
│   │       ├── Caramelo_latte.webp
│   │       ├── Caramelo_salgado.webp
│   │       ├── Cha_Matcha.webp
│   │       ├── Chicken_teriaki.webp
│   │       ├── Chikin_katsu.webp
│   │       ├── Choco-pie.webp
│   │       ├── Choco_pie.webp
│   │       ├── Chocolate_quente.webp
│   │       ├── Chocolate_quente_com_amarula.webp
│   │       ├── Choconhaque.webp
│   │       ├── Coffee_machiatto.webp
│   │       ├── Colecao_doce_natal_mew_mew.webp
│   │       ├── Combo_cosmico.webp
│   │       ├── Cookie_milkshake.webp
│   │       ├── Cookies.webp
│   │       ├── Corn_dog_coreano.webp
│   │       ├── Coxinha_de_carne_de_sol_com_requeijao.webp
│   │       ├── Coxinha_de_frango.webp
│   │       ├── Coxinha_de_frango_com_catupiry.webp
│   │       ├── Croque_mounsier.webp
│   │       ├── Croquet_madame.webp
│   │       ├── Cupcakes.webp
│   │       ├── Dango.webp
│   │       ├── Docinhos.webp
│   │       ├── Dose_de_vinho_de_arroz_sabor_uva.webp
│   │       ├── Dupla_de_mochis.webp
│   │       ├── Empada_de_palmito.webp
│   │       ├── Empada_de_queijo_do_reino.webp
│   │       ├── Espresso.webp
│   │       ├── Espresso_duplo.webp
│   │       ├── Espresso_panna.webp
│   │       ├── Estrela_radiante.webp
│   │       ├── Estrela_radiante_batatinha_ringo_chan.webp
│   │       ├── Fatia_de_torta.webp
│   │       ├── Forca_cosmica.webp
│   │       ├── Frango_crispy.webp
│   │       ├── Frappe_de_oreo.webp
│   │       ├── Geleiazinha_de_fruta.webp
│   │       ├── Geleiazinhas_de_fruta.webp
│   │       ├── Gyoza_6_unidades.webp
│   │       ├── Heineken_longneck.webp
│   │       ├── Ichigo_cute.webp
│   │       ├── J-kit.webp
│   │       ├── Jua.jpg
│   │       ├── Magia_crocante.webp
│   │       ├── Magia_crocante_burajiru.webp
│   │       ├── Matcha_latte_vanilla.webp
│   │       ├── Matcha_shake.webp
│   │       ├── Mawberry_matcha.webp
│   │       ├── Milkshake.webp
│   │       ├── Mini_refrescos_importados.webp
│   │       ├── Mochi.webp
│   │       ├── Nasu_katsu.webp
│   │       ├── Ovomaltine_frappe.webp
│   │       ├── Paco_chan.webp
│   │       ├── Panna_cat.webp
│   │       ├── Peito_de_peru_com_queijo.webp
│   │       ├── Pepperoni_com_cream_cheese.webp
│   │       ├── Pesto_de_tomate_seco.webp
│   │       ├── Pistachio_milkshake.webp
│   │       ├── Pocky.webp
│   │       ├── Refrescos_j_pop.webp
│   │       ├── Refrigerante_lata.webp
│   │       ├── Ringo_chan.webp
│   │       ├── Sakeirinha.webp
│   │       ├── Sakeirinha_em_dobro.webp
│   │       ├── Saque_dose.webp
│   │       ├── Sobrecoxa_agridoce.webp
│   │       ├── Soju_bebida_coreana.webp
│   │       ├── Sol_da_madrugada.webp
│   │       ├── Sol_da_madrugada_batatinha_blue_fairy.webp
│   │       ├── Spaten_350ml_lata.webp
│   │       ├── Suco_350ml.webp
│   │       ├── Tamago_sando.webp
│   │       ├── Tamago_sando_batatinha_ichigo_cute.webp
│   │       ├── Tayiaki.webp
│   │       ├── Tonkatsu.webp
│   │       ├── Toppoki.webp
│   │       ├── Trio_de_baozi.webp
│   │       ├── Vinho_de_arroz_sabor_banana.webp
│   │       └── Vinho_de_arroz_sabor_morango.webp
│   ├── src
│   │   ├── app.ts
│   │   ├── config
│   │   │   └── db.ts
│   │   ├── controllers
│   │   │   └── ProductController.ts
│   │   ├── middlewares
│   │   │   └── errorHandler.ts
│   │   ├── models
│   │   │   └── ProductModel.ts
│   │   ├── routes
│   │   │   └── ProductRoutes.ts
│   │   ├── server.ts
│   │   └── tests
│   │       └── sanity.test.ts
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── database
│   └── init.sql
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── public
    │   ├── Jua.jpg
    │   ├── Logo.svg
    │   └── NovosDrinks.mp4
    ├── src
    │   ├── App.css
    │   ├── App.tsx
    │   ├── assets
    │   │   └── icons
    │   │       ├── ClockIcon.tsx
    │   │       ├── HeartIcon.tsx
    │   │       ├── InstagramIcon.tsx
    │   │       ├── LocationIcon.tsx
    │   │       ├── StarIcon.tsx
    │   │       └── WhatsappIcon.tsx
    │   ├── components
    │   │   ├── AboutSection
    │   │   │   ├── AboutSection.tsx
    │   │   │   └── styles.module.css
    │   │   ├── Banner
    │   │   │   ├── index.tsx
    │   │   │   └── styles.module.css
    │   │   ├── CategoryFilter
    │   │   │   ├── index.tsx
    │   │   │   └── styles.module.css
    │   │   ├── Footer
    │   │   │   ├── index.tsx
    │   │   │   └── styles.module.css
    │   │   ├── Header
    │   │   │   ├── index.tsx
    │   │   │   └── styles.module.css
    │   │   ├── NewArrivalsSection
    │   │   │   ├── NewArrivalsSection.tsx
    │   │   │   └── styles.module.css
    │   │   ├── PopularSection
    │   │   │   ├── PopularSection.tsx
    │   │   │   └── styles.module.css
    │   │   ├── ProductCard
    │   │   │   ├── index.tsx
    │   │   │   └── styles.module.css
    │   │   ├── ScrollToTop
    │   │   │   └── index.tsx
    │   │   └── Search
    │   │       ├── index.tsx
    │   │       └── styles.module.css
    │   ├── index.css
    │   ├── main.tsx
    │   ├── pages
    │   │   ├── Home
    │   │   │   ├── index.tsx
    │   │   │   └── styles.module.css
    │   │   └── Menu
    │   │       ├── index.tsx
    │   │       └── styles.module.css
    │   ├── services
    │   │   └── api.ts
    │   ├── tests
    │   │   └── sanity.test.ts
    │   ├── types
    │   │   └── index.ts
    │   └── utils
    │       ├── formatters.ts
    │       └── scroll.ts
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── vitest.config.ts
```
