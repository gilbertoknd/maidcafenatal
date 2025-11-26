FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5173

#Comando para iniciar, "--host" mt importante no Docker
CMD ["pnpm", "dev", "--host"]