# Stage 1: Build
FROM node:20-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Runner (Produção)
FROM node:20-alpine AS runner

RUN corepack enable pnpm

WORKDIR /app
ENV NODE_ENV=production

# Copia apenas deps de produção
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copia os binários compilados
COPY --from=builder /app/dist ./dist

# Cria as pastas de upload já existentes e com dono `node`. Sem isso, o processo
# (que roda como USER node) não consegue criá-las dentro de /app/public (root) e
# o backend crasha no boot (mkdir EACCES em public/fonts). Os volumes do
# docker-compose montam por cima para persistir os arquivos.
RUN mkdir -p /app/public/images /app/public/fonts && chown -R node:node /app/public

# Rodar com usuário sem privilégios
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]