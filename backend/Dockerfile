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

# Rodar com usuário sem privilégios
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]