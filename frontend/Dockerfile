# Stage 1: Build
FROM node:20-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Variável de build para produção
ARG VITE_BACKEND_URL=https://api.jcafenatal.store
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN pnpm build

# Stage 2: Runner (Nginx)
FROM nginx:alpine AS runner

# Remove arquivos default do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o bundle estático do builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5174

CMD ["nginx", "-g", "daemon off;"]